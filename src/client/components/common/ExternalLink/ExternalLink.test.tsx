import React from 'react';

import { render, screen, testA11Y } from '../../../../../testUtils';

import { ExternalLink, ExternalLinkProps } from '.';

const defaultProps: ExternalLinkProps = {
  children: 'test',
  href: '//github.com/ljosberinn',
};

describe('<ExternalLink />', () => {
  it('renders without crashing given default props', () => {
    render(<ExternalLink {...defaultProps} />);
  });

  it('passes a11y test given default props', async () => {
    await testA11Y(<ExternalLink {...defaultProps} />);
  });

  it('has a default icon after its text', () => {
    const { container } = render(<ExternalLink {...defaultProps} />);

    const link = screen.getByRole('link');
    const svg = container.querySelector('svg');

    expect(svg).not.toBeNull();
    expect(svg!.parentElement).toBe(link);
  });

  it('optionally omits its default icon after its text', () => {
    const { container } = render(<ExternalLink {...defaultProps} omitIcon />);

    expect(container.querySelector('svg')).toBeNull();
  });
});
