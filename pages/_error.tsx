import * as Sentry from '@sentry/node';
import { NextPageContext } from 'next';
import NextErrorComponent from 'next/error';
import React from 'react';

import { INTERNAL_SERVER_ERROR, NOT_FOUND } from '../src/utils/statusCodes';

export interface ErrorProps {
  statusCode: number | null | undefined;
  hasGetInitialPropsRun: boolean;
  err?: Error;
}

// eslint-disable-next-line import/no-default-export
export default function CustomError({
  statusCode,
  err,
  hasGetInitialPropsRun,
}: ErrorProps) {
  // getInitialProps is not called in case of
  // https://github.com/vercel/next.js/issues/8592. As a workaround, we pass
  // err via _app.js so it can be captured

  // the 404 page may still pass down hasGetInitialPropsRun = false and a 404
  // code - like further down, reporting 404 is excluded
  if (!hasGetInitialPropsRun && err && statusCode !== NOT_FOUND) {
    Sentry.captureException(err);
  }

  if (statusCode === NOT_FOUND) {
    return <h1>Error: {NOT_FOUND}</h1>;
  }

  if (statusCode === INTERNAL_SERVER_ERROR) {
    return <h1>Server Error: {INTERNAL_SERVER_ERROR}</h1>;
  }

  return <h1>Client Error</h1>;
}

export async function getInitialProps(ctx: NextPageContext) {
  // Running on the server, the response object (err ? err.statusCode : null)
  // Next.js will pass an err on the server if a page's data fetching methods
  // threw or returned a Promise that rejected
  //
  // Running on the client (browser), Next.js will provide an err if:
  //
  //  - a page's `getInitialProps` threw or returned a Promise that rejected
  //  - an exception was thrown somewhere in the React lifecycle (render,
  //    componentDidMount, etc) that was caught by Next.js's React Error
  //    Boundary. Read more about what types of exceptions are caught by Error
  //    Boundaries: https://reactjs.org/docs/error-boundaries.html
  if (ctx.res?.statusCode === NOT_FOUND) {
    // Opinionated: do not record an exception in Sentry for 404
    return { statusCode: NOT_FOUND };
  }

  const errorInitialProps = await NextErrorComponent.getInitialProps(ctx);
  // Workaround for https://github.com/vercel/next.js/issues/8592, mark when
  // getInitialProps has run
  // @ts-expect-error
  errorInitialProps.hasGetInitialPropsRun = true;

  if (ctx.err) {
    Sentry.captureException(ctx.err);

    return errorInitialProps;
  }

  // If this point is reached, getInitialProps was called without any
  // information about what the error might be. This is unexpected and may
  // indicate a bug introduced in Next.js, so record it in Sentry
  Sentry.captureException(
    new Error(`_error.js getInitialProps missing data at path: ${ctx.asPath}`)
  );

  return errorInitialProps;
}

CustomError.getInitialProps = getInitialProps;
