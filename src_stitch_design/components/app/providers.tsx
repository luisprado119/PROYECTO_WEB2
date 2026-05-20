"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { AuthProvider } from "@/components/app/AuthContext";
import { CurrencyProvider } from "@/components/app/CurrencyContext";
import { Toaster } from "@/components/ui/toaster";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AuthProvider>
        <CurrencyProvider>
          {children}
          <Toaster />
        </CurrencyProvider>
      </AuthProvider>
    </NextThemesProvider>
  );
}
