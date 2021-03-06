import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

import { render, fireEvent, screen, testA11Y } from '../../../../../testUtils';

import { ThemeSwitchAlt } from '.';

describe('<ThemeSwitchAlt />', () => {
  it('renders without crashing', () => {
    render(<ThemeSwitchAlt />);
  });

  it('passes a11y test', async () => {
    await testA11Y(<ThemeSwitchAlt />);
  });

  /**
   * Weird test, I know.
   *
   * - continues to work when initial theme is changed outside of the test
   * - continues to work given any prop on the `Box` component
   */
  it('indicates the current theme visually', () => {
    render(<ThemeSwitchAlt />);
    const sun = render(<FaSun />);
    const moon = render(<FaMoon />);

    const sunPath = sun.container.querySelector('path')!.outerHTML;
    const moonPath = moon.container.querySelector('path')!.outerHTML;

    const button = screen.getByRole('checkbox');

    const isInitiallyLight =
      button.querySelector('path')!.outerHTML === sunPath;

    fireEvent.click(button);

    const postClickPath = button.querySelector('path')!.outerHTML;

    expect(postClickPath).not.toBe(isInitiallyLight ? sunPath : moonPath);
    expect(postClickPath).toStrictEqual(isInitiallyLight ? moonPath : sunPath);
  });
});
