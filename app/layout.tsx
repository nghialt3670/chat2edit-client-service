import { Inter as FontSans } from "next/font/google";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { Providers } from "@/components/providers";
import Chat2Edit from "@/components/chat2edit";
import AppBar from "@/components/app-bar";
import prisma from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { auth } from "@/auth";
import "./globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Chat2Edit - AI-Powered Collaborative File Editor",
  description:
    "Chat2Edit is an advanced file editor that leverages a chatbot for seamless collaboration. Powered by Next.js, it enables users to manage and edit files efficiently with real-time AI assistance, enhancing productivity and user experience.",
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
  const session = await auth();
  const accountId = session?.user?.id;

  const chats = accountId
    ? await prisma.chat.findMany({
        where: { accountId },
        orderBy: { updatedAt: "desc" },
      })
    : [];

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
          chats={chats}
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppBar />
          <Chat2Edit chat={chat} edit={edit} />
        </Providers>
      </body>
    </html>
  );
}
