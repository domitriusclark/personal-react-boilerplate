import { chakra } from '@chakra-ui/core';
import React from 'react';

import { MFC } from '../../../types';

export const ChakraIcon: MFC<{ size: string }> = ({ size }) => {
  return (
    <chakra.svg
      width="auto"
      viewBox="0 0 998 257"
      xmlns="http://www.w3.org/2000/svg"
      height={size}
    >
      <title>Chakra Logo</title>
      <rect width="257" height="257" fill="url(#paint0_linear)" rx="128.5" />
      <path
        fill="#fff"
        d="M69.56 133.99l87.59-87c1.64-1.62 4.27.36 3.17 2.38l-32.6 59.76a2 2 0 001.75 2.95h56.34a2 2 0 011.36 3.47l-98.72 92.14c-1.78 1.65-4.41-.68-2.99-2.64l46.74-64.47a2 2 0 00-1.62-3.18H70.97a2 2 0 01-1.41-3.41z"
      />
      <defs>
        <linearGradient
          id="paint0_linear"
          x1="128.5"
          x2="128.5"
          y2="257"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#7BCBD4" />
          <stop offset="1" stopColor="#29C6B7" />
        </linearGradient>
      </defs>
    </chakra.svg>
  );
};
