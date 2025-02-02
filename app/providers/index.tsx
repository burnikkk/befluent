import { FC, PropsWithChildren } from 'react';

import { ChakraProvider } from '@chakra-ui/react';

import { VideoRecorderProvider } from '@/app/providers/Recorder';

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ChakraProvider>
      <VideoRecorderProvider>{children}</VideoRecorderProvider>
    </ChakraProvider>
  );
};
