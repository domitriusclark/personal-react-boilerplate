import {
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuOptionGroup,
  MenuItemOption,
  MenuDivider,
  Button,
  BoxProps,
  useColorModeValue,
} from '@chakra-ui/core';
import { TFunction } from 'i18next';
import React from 'react';
import { FlagIcon, FlagIconCode } from 'react-flag-kit';
import { useTranslation } from 'react-i18next';
import { MdTranslate } from 'react-icons/md';

import {
  SUPPORTED_LANGUAGES_MAP,
  ENABLED_LANGUAGES,
} from '../../../../constants';
import { makeChangeLanguageHandler } from '../../../i18n';
import { MFC } from '../../../types';
import { ExternalLink } from '../ExternalLink';

type FlapMap = { [key: string]: FlagIconCode };

const flagMap: FlapMap = {
  [SUPPORTED_LANGUAGES_MAP.en]: 'GB',
  [SUPPORTED_LANGUAGES_MAP.de]: 'DE',
};

type LanguageSwitchProps = BoxProps;

export const LanguageSwitch: MFC<LanguageSwitchProps> = (props) => {
  const { i18n, t } = useTranslation('i18n');
  const backgroundColor = useColorModeValue('gray.100', 'whiteAlpha.100');

  return (
    <Box d="inline-block" {...props}>
      <Menu>
        <MenuButton as={Button} colorScheme="teal" width="100%">
          <Box d="inline-block" as={MdTranslate} mr="2" />
          {t('language-toggle')}
        </MenuButton>
        <MenuList>
          <MenuOptionGroup
            title={t('available-languages')}
            value={i18n.language}
            type="radio"
          >
            {ENABLED_LANGUAGES.map((slug) => (
              <LanguageOption
                t={t}
                slug={slug}
                isCurrentLanguage={slug === i18n.language}
                key={slug}
              />
            ))}
          </MenuOptionGroup>
          <MenuDivider />
          <MenuItem
            as={ExternalLink}
            _focus={{
              backgroundColor,
              boxShadow: 'unset',
            }}
            href="//github.com/chevron-9/next-karma-docs"
          >
            {t('help-cta')}
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
};

interface LanguageOptionProps {
  slug: string;
  isCurrentLanguage: boolean;
  t: TFunction;
}

const LanguageOption: MFC<LanguageOptionProps> = ({
  slug,
  isCurrentLanguage,
  t,
}) => {
  return (
    <MenuItemOption
      value={slug}
      isDisabled={isCurrentLanguage}
      isChecked={isCurrentLanguage}
      onClick={isCurrentLanguage ? undefined : makeChangeLanguageHandler(slug)}
    >
      <Box mr={2} display="inline-block">
        <FlagIcon aria-hidden="true" code={flagMap[slug]} />
      </Box>
      {t(slug)}
    </MenuItemOption>
  );
};
