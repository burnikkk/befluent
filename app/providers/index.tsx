import { FC, PropsWithChildren } from 'react';

import { ChakraProvider, defaultSystem } from '@chakra-ui/react';

import { RecorderProvider } from '@/app/providers/Recorder_svoi';

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ChakraProvider value={defaultSystem}>
      <RecorderProvider>{children}</RecorderProvider>
    </ChakraProvider>
  );
};
