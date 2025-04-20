'use client';

import { FC, PropsWithChildren } from 'react';

import { ChakraProvider, defaultSystem } from '@chakra-ui/react';

import { useActiveLanguage } from '@/app/hooks/useActiveLanguage';
import { useRecorder } from '@/app/hooks/useRecorder';

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ChakraProvider value={defaultSystem}>
      <useActiveLanguage.Provider>
        <useRecorder.Provider>{children}</useRecorder.Provider>
      </useActiveLanguage.Provider>
    </ChakraProvider>
  );
};
