import { createContext, ReactNode, useContext } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createContextHook = <T extends (...args: any[]) => ReturnType<T>>(
  hook: T
) => {
  const Context = createContext<ReturnType<T> | undefined>(undefined);

  const useContextHook = (): ReturnType<T> => {
    const context = useContext(Context);
    if (context === undefined) {
      return hook();
    }
    return context;
  };

  // eslint-disable-next-line react/display-name
  useContextHook.Provider = ({ children }: { children: ReactNode }) => {
    const value = hook();
    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  return useContextHook;
};
