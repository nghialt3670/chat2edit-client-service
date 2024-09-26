"use client";

import { SessionProvider, SessionProviderProps } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { HistoryProvider } from "@/hooks/use-history";
import { Chat } from "@/schemas/chat-preview.schema";

interface ProvidersProps
  extends Omit<SessionProviderProps, "children">,
    Omit<ThemeProviderProps, "children"> {
  children: React.ReactNode;
  chats: Chat[] | null | undefined;
}

export function Providers({
  children,
  session,
  chats,
  ...props
}: ProvidersProps) {
  return (
    <SessionProvider session={session}>
      <NextThemesProvider {...props}>
        <HistoryProvider chats={chats}>{children}</HistoryProvider>
      </NextThemesProvider>
    </SessionProvider>
  );
}
