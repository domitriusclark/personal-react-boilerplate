import { useColorMode, IconButtonProps, IconButton } from '@chakra-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaSun, FaMoon } from 'react-icons/fa';

import { useThemePersistence } from '../../../hooks/useThemePersistence';
import { MFC } from '../../../types';

export type ThemeSwitchAltProps = Omit<
  IconButtonProps,
  'children' | 'aria-label'
>;

export const ThemeSwitchAlt: MFC<ThemeSwitchAltProps> = (props) => {
  const { t } = useTranslation('theme');
  const { colorMode, toggleColorMode } = useColorMode();
  useThemePersistence(colorMode);

  const isDarkTheme = colorMode === 'dark';

  return (
    <IconButton
      {...props}
      onClick={toggleColorMode}
      role="checkbox"
      aria-checked={isDarkTheme}
      icon={isDarkTheme ? <FaMoon /> : <FaSun />}
      color="yellow.500"
      background="none"
      aria-label={t(isDarkTheme ? 'set-light-theme' : 'set-dark-theme')}
    />
  );
};
