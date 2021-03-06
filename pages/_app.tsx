import { ColorMode } from '@chakra-ui/core';
import { NextComponentType, NextPageContext } from 'next';
import { DefaultSeo } from 'next-seo';
import NextApp, { AppContext } from 'next/app';
import { NextRouter } from 'next/router';
import React from 'react';
import { I18nextProvider } from 'react-i18next';

import { seo } from '../next-seo.config';
import { Chakra } from '../src/client/Chakra';
import { ServiceWorker } from '../src/client/components/common/ServiceWorker';
import { AuthContextProvider } from '../src/client/context/AuthContext';
import { User } from '../src/client/context/AuthContext/AuthContext';
import { detectInitialColorMode } from '../src/client/hooks/useThemePersistence';
import {
  I18nextResourceLocale,
  initI18Next,
  getI18N,
  detectLanguage,
} from '../src/client/i18n';
import { getSession } from '../src/server/auth/cookie';
import {
  attachInitialContext,
  attachRoutingContext,
  ErrorBoundary as TopLevelErrorBoundary,
} from '../src/utils/sentry/client';

export interface PageProps {
  language: string;
  i18nBundle: I18nextResourceLocale;
  session: User | null;
  initialColorMode: ColorMode;
}

export interface AppRenderProps {
  pageProps: PageProps;
  err?: Error;
  Component?: NextComponentType<NextPageContext, AppRenderProps, PageProps>;
  router?: NextRouter;
}

// eslint-disable-next-line import/no-default-export
export default function App({ Component, pageProps, router }: AppRenderProps) {
  if (!Component) {
    return null;
  }

  if (router) {
    attachRoutingContext(router, Component.name);
  }

  const i18nInstance = initI18Next(pageProps);

  return (
    <>
      <DefaultSeo {...seo} />
      <TopLevelErrorBoundary showDialog>
        <I18nextProvider i18n={i18nInstance}>
          <AuthContextProvider session={pageProps.session}>
            <Chakra initialColorMode={pageProps.initialColorMode}>
              <ServiceWorker />
              {/* <CustomPWAInstallPrompt /> */}
              <Component {...pageProps} />
            </Chakra>
          </AuthContextProvider>
        </I18nextProvider>
      </TopLevelErrorBoundary>
    </>
  );
}

export async function getInitialProps(
  props: AppContext
): Promise<AppRenderProps> {
  const {
    ctx,
    Component: { getInitialProps },
  } = props;

  const session = await getSession(ctx.req);
  const initialColorMode = detectInitialColorMode(ctx);
  const language = detectLanguage(ctx);
  const i18nBundle = await getI18N(language, ctx);

  const appProps: AppRenderProps = await NextApp.getInitialProps(props);

  attachInitialContext({
    initialColorMode,
    language,
    req: props.ctx.req,
    session,
  });

  // return {
  //   ...appProps,
  //   pageProps: {
  //     i18nBundle,
  //     initialColorMode,
  //     language,
  //     session,
  //   },
  // };

  /*
   * Uncomment these lines as well as the destructuring above to disable support
   * for subcomponent `getInitialProps` if you dont need it.
   *
   * It's currently required for the custom _error & _document page.
   *
   * @see https://nextjs.org/docs/api-reference/data-fetching/getInitialProps
   */
  const componentPageProps = getInitialProps ? await getInitialProps(ctx) : {};

  return {
    ...appProps,
    pageProps: {
      i18nBundle,
      initialColorMode,
      language,
      session,
      ...componentPageProps,
    },
  };
}

App.getInitialProps = getInitialProps;
