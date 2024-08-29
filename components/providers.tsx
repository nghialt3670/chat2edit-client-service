"use client";

import { SessionProvider, SessionProviderProps } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { ChatsProvider } from "@/lib/hooks/use-chats";
import Chat from "@/lib/types/chat";

interface ProvidersProps extends SessionProviderProps, ThemeProviderProps {}

export function Providers({
  children,
  session,
  chats,
  ...props
}: ProvidersProps & { chats: Chat[] }) {
  return (
    <SessionProvider session={session}>
      <NextThemesProvider {...props}>
        <ChatsProvider chats={chats}>{children}</ChatsProvider>
      </NextThemesProvider>
    </SessionProvider>
  );
}
