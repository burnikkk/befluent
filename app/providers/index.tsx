'use client';

import { FC, PropsWithChildren } from 'react';

//import { LightMode } from '@/components/ui/color-mode';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';

import { RecorderProvider } from '@/app/providers/Recorder';

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    //  <LightMode>
    <ChakraProvider value={defaultSystem}>
      <RecorderProvider>{children}</RecorderProvider>
    </ChakraProvider>
    //   </LightMode>
  );
};
