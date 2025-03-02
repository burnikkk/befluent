'use client';

import React, { createContext, useContext, useState } from 'react';

interface RecorderContext {
  isActive: boolean;
  start: () => void;
  stop: () => void;
}

const RecorderProviderContext = createContext<RecorderContext | undefined>(undefined);

export const RecorderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isActive, setIsActive] = useState(false);

  const start = () => {
    console.log('start from RecorderProvider');
  };
  const stop = () => {
    console.log('stop from RecorderProvider');
  };

  return (
    <RecorderProviderContext.Provider value={{ isActive, start, stop }}>
      {children}
    </RecorderProviderContext.Provider>
  );
};

export const useRecorder = () => {
  const context = useContext(RecorderProviderContext);
  if (!context) {
    throw new Error('useRecorder must be used within a RecorderProvider');
  }
  return context;
};
