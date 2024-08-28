"use client";

import { SessionProvider, SessionProviderProps } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";

interface ProvidersProps extends SessionProviderProps, ThemeProviderProps {}

export function Providers({ children, session, ...props }: ProvidersProps) {
  return (
    <SessionProvider session={session}>
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
    </SessionProvider>
  );
}
