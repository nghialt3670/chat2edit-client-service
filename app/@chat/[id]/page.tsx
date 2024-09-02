import { notFound } from "next/navigation";
import { ChatProvider } from "@/lib/hooks/use-chat";
import Chat from "@/components/chat";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export default async function ChatPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const session = await auth();
  const accountId = session?.user?.id;

  if (!accountId) notFound();

  const chat = await prisma.chat.findFirst({
    where: { id, accountId },
    include: {
      messages: {
        include: {
          attachments: { omit: { id: true, accountId: true, messageId: true } },
        },
        omit: { chatId: true },
      },
    },
    omit: { accountId: true },
  });

  if (!chat) notFound();

  return (
    <ChatProvider value={chat}>
      <Chat />
    </ChatProvider>
  );
}
