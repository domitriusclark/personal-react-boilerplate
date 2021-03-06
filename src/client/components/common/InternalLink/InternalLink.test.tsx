import React, { ReactNode } from 'react';

import { render, testA11Y } from '../../../../../testUtils';

import { InternalLink, InternalLinkProps } from '.';

jest.mock('next/link', () => {
  const nextLink = jest.requireActual('next/link');

  return {
    ...nextLink,
    default: ({ children }: { children: ReactNode }) => children,
  };
});

const defaultProps: InternalLinkProps = {
  children: 'Docs',
  href: '/docs',
};

describe('<InternalLink />', () => {
  it('renders without crashing given default props', () => {
    render(<InternalLink {...defaultProps} />);
  });

  it('passes a11y test given default props', async () => {
    await testA11Y(<InternalLink {...defaultProps} />);
  });
});
