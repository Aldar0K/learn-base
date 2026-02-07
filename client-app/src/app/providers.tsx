"use client";

import type React from "react";

import { StoreProvider } from "@/providers/StoreProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        storageKey="learnbase-client-theme"
        enableSystem={false}
      >
        {children}
      </ThemeProvider>
    </StoreProvider>
  );
}
