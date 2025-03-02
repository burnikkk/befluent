'use client';

import { FC, PropsWithChildren } from 'react';

import { RecorderProvider } from '@/app/providers/Recorder';
import { Provider } from '@/components/ui/provider';

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Provider>
      <RecorderProvider>{children}</RecorderProvider>
    </Provider>
  );
};
