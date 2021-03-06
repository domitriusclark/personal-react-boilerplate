import {
  Link as ChakraLink,
  LinkProps as ChakraLinkProps,
} from '@chakra-ui/core';
import { LinkProps as NextLinkProps } from 'next/dist/client/link';
import NextLink from 'next/link';
import React from 'react';

import { MFC, WithChildren } from '../../../types';

export type InternalLinkProps = NextLinkProps &
  Omit<ChakraLinkProps, 'as'> &
  WithChildren;

export const InternalLink: MFC<InternalLinkProps> = ({
  href,
  as,
  replace,
  scroll,
  shallow,
  prefetch,
  children,
  ...rest
}) => {
  return (
    <NextLink
      passHref
      href={href}
      as={as}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      prefetch={prefetch}
    >
      <ChakraLink {...rest}>{children}</ChakraLink>
    </NextLink>
  );
};
