import { Inter as FontSans } from "next/font/google";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { ChatProvider } from "@/lib/hooks/use-chat";
import { Providers } from "@/components/providers";
import Chat2Edit from "@/components/chat2edit";
import AppBar from "@/components/app-bar";
import { cn } from "@/lib/utils";
import "./globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
  chat,
  edit,
}: Readonly<{
  children: ReactNode;
  chat: ReactNode;
  edit: ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "flex flex-col h-[100vh] min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
        suppressHydrationWarning
      >
        <Providers
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppBar />
          <ChatProvider>
            <Chat2Edit chat={chat} edit={edit} />
          </ChatProvider>
        </Providers>
      </body>
    </html>
  );
}
