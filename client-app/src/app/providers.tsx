"use client";

import type React from "react";

import { AuthProvider } from "@/entities/auth";
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
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </StoreProvider>
  );
}
