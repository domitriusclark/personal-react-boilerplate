import { useColorModeValue, Icon } from '@chakra-ui/core';
import React from 'react';

export function SentryIcon() {
  const fill = useColorModeValue('rgb(54, 45, 89)', 'white');

  return (
    <Icon viewBox="52.5 45 160 160" boxSize="1em" width="3rem" height="3rem">
      <title>Sentry Logo</title>
      <path
        fill={fill}
        d="M144.9 65.43a13.75 13.75 0 00-23.81 0l-19.6 33.95 5 2.87a96.14 96.14 0 0147.83 77.4h-13.76a82.4 82.4 0 00-41-65.54l-5-2.86L76.3 143l5 2.87a46.35 46.35 0 0122.46 33.78H72.33a2.27 2.27 0 01-2-3.41l8.76-15.17a31.87 31.87 0 00-10-5.71l-8.67 15.14a13.75 13.75 0 0011.91 20.62h43.25v-5.73A57.16 57.16 0 0091.84 139l6.88-11.92a70.93 70.93 0 0130.56 58.26v5.74h36.65v-5.73a107.62 107.62 0 00-48.84-90.05L131 71.17a2.27 2.27 0 013.93 0l60.66 105.07a2.27 2.27 0 01-2 3.41H179.4c.18 3.83.2 7.66 0 11.48h14.24a13.75 13.75 0 0011.91-20.62z"
      />
    </Icon>
  );
}
