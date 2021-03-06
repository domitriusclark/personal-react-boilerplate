import { Switch, useColorMode, Flex, FlexProps, Box } from '@chakra-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaSun, FaMoon } from 'react-icons/fa';

import { useThemePersistence } from '../../../hooks/useThemePersistence';
import { MFC } from '../../../types';

const gray = 'gray.500';
const yellow = 'yellow.500';

const colorMap = {
  moon: {
    dark: yellow,
    light: gray,
  },
  sun: {
    dark: gray,
    light: yellow,
  },
};

export type ThemeSwitchProps = FlexProps;

export const ThemeSwitch: MFC<ThemeSwitchProps> = (props) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { t } = useTranslation('theme');
  useThemePersistence(colorMode);

  const isLightTheme = colorMode === 'light';

  return (
    <Flex cursor="pointer" d="inline-flex" {...props}>
      <Box
        d="inline-block"
        as={FaSun}
        height="6"
        color={colorMap.sun[colorMode]}
        data-testid="theme-switch-sun"
        onClick={toggleColorMode}
        aria-label={t(isLightTheme ? 'is-light-theme' : 'set-light-theme')}
      />
      <Switch
        aria-label="toggle theme"
        isChecked={!isLightTheme}
        onChange={toggleColorMode}
        display="flex"
        alignItems="center"
        marginLeft="2"
        marginRight="2"
      />
      <Box
        d="inline-block"
        as={FaMoon}
        height="6"
        color={colorMap.moon[colorMode]}
        data-testid="theme-switch-moon"
        onClick={toggleColorMode}
        aria-label={t(isLightTheme ? 'set-dark-theme' : 'is-dark-theme')}
      />
    </Flex>
  );
};
