"use client";

import { useRef, type ReactNode } from "react";
import { Provider } from "react-redux";

import type { AppStore } from "../app/store-config";
import { makeStore } from "../app/store-config";

type StoreProviderProps = {
  children: ReactNode;
  preloadedState?: Parameters<typeof makeStore>[0];
};

export const StoreProvider = ({
  children,
  preloadedState,
}: StoreProviderProps) => {
  const storeRef = useRef<AppStore | undefined>(undefined);
  if (!storeRef.current) {
    storeRef.current = makeStore(preloadedState);
  }
  return <Provider store={storeRef.current}>{children}</Provider>;
};
