import { Debug } from '@sentry/integrations';
import {
  init as nodeInit,
  NodeOptions,
  configureScope as nodeConfigureScope,
} from '@sentry/node';
import {
  init as browserInit,
  BrowserOptions,
  configureScope as browserConfigureScope,
} from '@sentry/react';
import { Options } from '@sentry/types';

import { IS_BROWSER, IS_PROD, SENTRY_DSN } from '../../constants';

export const defaultOptions: Options = {
  attachStacktrace: true,
  dsn: SENTRY_DSN,
  enabled: true,
  maxBreadcrumbs: 50,
};

type BootParameters = {
  init: typeof browserInit | typeof nodeInit;
  options: NodeOptions | BrowserOptions;
  configureScope: typeof browserConfigureScope | typeof nodeConfigureScope;
};

export const isomorphicSentryBoot = ({
  init,
  options,
  configureScope,
}: BootParameters) => {
  if (!IS_PROD) {
    options.beforeSend = () => null;
    options.integrations = [
      new Debug({
        // set to true if you want to use `debugger;` instead
        debugger: false,
      }),
    ];
  }

  init(options);

  configureScope((scope) => {
    if (!IS_BROWSER) {
      scope.setTag('nodejs', process.version);
    }

    scope.setTag('buildTime', process.env.BUILD_TIME!);
  });
};
