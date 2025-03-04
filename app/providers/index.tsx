'use client';

import { FC, PropsWithChildren } from 'react';

import { ChakraProvider, defaultSystem } from '@chakra-ui/react';

import { useRecorder } from '@/app/hooks/useRecorder';

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ChakraProvider value={defaultSystem}>
      <useRecorder.Provider>{children}</useRecorder.Provider>
    </ChakraProvider>
  );
};
