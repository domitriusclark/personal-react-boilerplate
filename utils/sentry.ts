import * as Sentry from '@sentry/browser';
import { BrowserOptions } from '@sentry/browser';
import { Debug } from '@sentry/integrations';
import Cookie from 'js-cookie';
import { IS_PROD, IS_BROWSER } from 'src/constants';

export default function (release = process.env.SENTRY_RELEASE) {
  const sentryOptions: BrowserOptions = {
    dsn: process.env.SENTRY_DSN,
    release,
    maxBreadcrumbs: 50,
    attachStacktrace: true,
    enabled: IS_PROD,
  };

  // When we're developing locally
  if (!IS_PROD) {
    // Don't actually send the errors to Sentry
    sentryOptions.beforeSend = () => null;

    // Instead, dump the errors to the console
    sentryOptions.integrations = [
      new Debug({
        // Trigger DevTools debugger instead of using console.log
        debugger: false,
      }),
    ];
  }

  Sentry.init(sentryOptions);

  return {
    Sentry,
    captureException: (err: any, ctx: any) => {
      Sentry.configureScope(scope => {
        if (err.message) {
          // De-duplication currently doesn't work correctly for SSR / browser errors
          // so we force deduplication by error message if it is present
          scope.setFingerprint([err.message]);
        }

        if (err.statusCode) {
          scope.setExtra('statusCode', err.statusCode);
        }

        if (ctx) {
          const { req, res, errorInfo, query, pathname } = ctx;

          if (res && res.statusCode) {
            scope.setExtra('statusCode', res.statusCode);
          }

          if (IS_BROWSER) {
            scope.setTag('ssr', 'false');
            scope.setExtra('query', query);
            scope.setExtra('pathname', pathname);

            // On client-side we use js-cookie package to fetch it
            const sessionId = Cookie.get('sid');
            if (sessionId) {
              scope.setUser({ id: sessionId });
            }
          } else {
            scope.setTag('ssr', 'true');
            scope.setExtra('url', req.url);
            scope.setExtra('method', req.method);
            scope.setExtra('headers', req.headers);
            scope.setExtra('params', req.params);
            scope.setExtra('query', req.query);

            // On server-side we take session cookie directly from request
            if (req.cookies.sid) {
              scope.setUser({ id: req.cookies.sid });
            }
          }

          if (errorInfo) {
            Object.keys(errorInfo).forEach(key =>
              scope.setExtra(key, errorInfo[key])
            );
          }
        }
      });

      return Sentry.captureException(err);
    },
  };
}