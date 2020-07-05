import { render } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { Socket } from 'net';
import { AppContext, AppInitialProps } from 'next/app';
import { Router } from 'next/router';
import fetch from 'node-fetch';
import React from 'react';

import App, { AppRenderProps, getInitialProps } from '../../../pages/_app';
import { SUPPORTED_LANGUAGES_MAP } from '../../constants';
import * as cookieUtils from '../../server/auth/cookie';
import i18nCache from '../../server/i18n';
import * as sentryUtils from '../../utils/sentry';
import * as i18n from '../i18n';

const server = setupServer();

beforeAll(() => {
  // @ts-expect-error
  global.fetch = fetch;
  server.listen();
});

afterEach(() => server.resetHandlers());

afterAll(() => {
  // @ts-expect-error
  global.fetch = undefined;
  server.close();
});

const defaultProps: AppRenderProps = {
  Component: () => null,
  pageProps: {
    i18nBundle: { namespace: {} },
    language: 'en',
    session: null,
  },
  router: new Router('/', {}, '', {
    App: () => null,
    Component: () => null,
    initialProps: {},
    isFallback: false,
    pageLoader: undefined,
    subscription: async () => {},
    wrapApp: () => {},
  }),
};

describe('<App />', () => {
  it('renders without crashing given default props', () => {
    render(<App {...defaultProps} />);
  });

  it('initializes i18n', () => {
    const initI18NextSpy = jest.spyOn(i18n, 'initI18Next');

    render(<App {...defaultProps} />);

    expect(initI18NextSpy).toHaveBeenCalledWith(defaultProps.pageProps);
  });

  it('attaches routing breadcrumbs to Sentry', () => {
    const attachRoutingContextSpy = jest.spyOn(
      sentryUtils,
      'attachRoutingContext'
    );

    render(<App {...defaultProps} />);

    expect(attachRoutingContextSpy).toHaveBeenCalledWith(
      expect.any(Router),
      expect.any(String)
    );
  });
});

const asyncIterator = () => {};

const appContext: AppContext = {
  AppTree: () => null,
  Component: () => null,
  ctx: {
    AppTree: (_: AppInitialProps) => <h1>test</h1>,
    pathname: '/',
    query: {},
    req: {
      _destroy: jest.fn(),
      _read: jest.fn(),
      aborted: false,
      addListener: jest.fn(),
      complete: false,
      connection: new Socket(),
      destroy: jest.fn(),
      destroyed: false,
      emit: jest.fn(),
      eventNames: jest.fn(),
      getMaxListeners: jest.fn(),
      headers: {},
      httpVersion: '1.1',
      httpVersionMajor: 1,
      httpVersionMinor: 1,
      isPaused: jest.fn(),
      listenerCount: jest.fn(),
      listeners: jest.fn(),
      off: jest.fn(),
      on: jest.fn(),
      once: jest.fn(),
      pause: jest.fn(),
      pipe: jest.fn(),
      prependListener: jest.fn(),
      prependOnceListener: jest.fn(),
      push: jest.fn(),
      rawHeaders: [],
      rawListeners: jest.fn(),
      rawTrailers: [],
      read: jest.fn(),
      readable: true,
      readableEncoding: 'utf-8',
      readableEnded: false,
      readableHighWaterMark: 0,
      readableLength: 0,
      readableObjectMode: true,
      removeAllListeners: jest.fn(),
      removeListener: jest.fn(),
      resume: jest.fn(),
      setEncoding: jest.fn(),
      setMaxListeners: jest.fn(),
      setTimeout: jest.fn(),
      socket: new Socket(),
      trailers: {},
      unpipe: jest.fn(),
      unshift: jest.fn(),
      wrap: jest.fn(),
      [Symbol.asyncIterator]: () =>
        (asyncIterator as unknown) as AsyncIterableIterator<any>,
    },
  },
  router: new Router('/', {}, '', {
    App: () => null,
    Component: () => null,
    initialProps: {},
    isFallback: false,
    pageLoader: undefined,
    subscription: async () => {},
    wrapApp: () => {},
  }),
};

describe('App.getInitialProps()', () => {
  it('performs boot steps', async () => {
    server.use(
      rest.get('http://localhost:3000/api/v1/i18n/en', (_req, res, ctx) =>
        res(ctx.json(i18nCache.de))
      )
    );

    const getSessionSpy = jest.spyOn(cookieUtils, 'getSession');
    const detectLanguageSpy = jest.spyOn(i18n, 'detectLanguage');
    const getI18NSpy = jest.spyOn(i18n, 'getI18N');
    const attachInitialContextSpy = jest.spyOn(
      sentryUtils,
      'attachInitialContext'
    );

    const initialProps = await getInitialProps(appContext);

    expect(getSessionSpy).toHaveBeenCalledWith(appContext.ctx.req);
    expect(detectLanguageSpy).toBeCalledWith(appContext.ctx);
    expect(getI18NSpy).toHaveBeenCalledWith(
      SUPPORTED_LANGUAGES_MAP.en,
      appContext.ctx.req
    );

    expect(attachInitialContextSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        language: SUPPORTED_LANGUAGES_MAP.en,
        req: appContext.ctx.req,
        session: null,
      })
    );

    expect(initialProps).toMatchObject({
      pageProps: {
        // in theory, we could check for i18nCache.en here but it's actually
        // machine dependant, so in my case .de
        i18nBundle: expect.any(Object),
        language: 'en',
        session: null,
      },
    });
  });
});
