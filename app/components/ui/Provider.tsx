'use client';

import { FC, PropsWithChildren } from 'react';

import { ChakraProvider, defaultSystem } from '@chakra-ui/react';

export const Provider: FC<PropsWithChildren> = ({ children }) => {
  return <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>;
};
