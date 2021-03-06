import { addBreadcrumb, BrowserOptions, Severity } from '@sentry/react';
import { init, configureScope } from '@sentry/react';
import { IncomingMessage } from 'http';
import { NextRouter } from 'next/router';

import { AppRenderProps } from '../../../pages/_app';
import { IS_BROWSER } from '../../constants';
import { isomorphicSentryBoot, defaultOptions } from './shared';

export { ErrorBoundary } from '@sentry/react';

const options: BrowserOptions = {
  ...defaultOptions,
};

isomorphicSentryBoot({ configureScope, init, options });

interface InitialContextArgs
  extends Omit<AppRenderProps['pageProps'], 'i18nBundle'> {
  req?: IncomingMessage;
}

/**
 * Attaches app boot data to Sentry
 */
export const attachInitialContext = ({
  req,
  language,
  session,
  initialColorMode,
}: InitialContextArgs) => {
  addBreadcrumb({
    level: Severity.Debug,
    message: `Booting (${IS_BROWSER ? 'in browser' : 'on server'})`,
  });

  configureScope((scope) => {
    scope.setExtra('language', language);
    scope.setExtra('initialColorMode', initialColorMode);

    if (req) {
      scope.setContext('headers', req.headers);
    }

    if (session) {
      scope.setContext('session', session);
    }
  });
};

/**
 * Attaches routing data to Sentry
 *
 * @see https://github.com/UnlyEd/next-right-now/blob/v1-ssr-mst-aptd-gcms-lcz-sty/src/pages/_app.tsx#L158
 */
export const attachRoutingContext = (
  { route, pathname, query, asPath }: NextRouter,
  name: string = 'unknown'
) => {
  configureScope((scope) => {
    scope.setContext('router', {
      asPath,
      pathname,
      query,
      route,
    });
  });

  // in prod, this will make components show up with their minified name!
  attachComponentBreadcrumb(name);
};

export const attachComponentBreadcrumb = (name: string) => {
  addBreadcrumb({
    level: Severity.Debug,
    message: `Preparing "${name}" (${IS_BROWSER ? 'in browser' : 'on server'})`,
  });
};
