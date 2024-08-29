import { notFound } from "next/navigation";
import { nanoid } from "nanoid";
import { MessagesProvider } from "@/lib/hooks/use-messages";
import DatalessMessage from "@/lib/types/dataless-message";
import { ChatsProvider } from "@/lib/hooks/use-chats";
import ChatEdit from "@/components/chat-edit";
import Message from "@/lib/types/message";
import { fetchFile } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export default async function ChatPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) notFound();

  const chat = await prisma.chat.findFirst({
    where: {
      id: params.id,
      accountId: session.user.id,
    },
    include: {
      messages: true,
    },
  });

  if (!chat) notFound();

  const messages: DatalessMessage[] = await Promise.all(
    chat.messages.map(async (msg) => ({
      id: nanoid(),
      text: msg.text,
      fileIds: msg.fileIds,
    })),
  );

  return (
    <MessagesProvider messages={messages}>
      <main className="h-[calc(100%-3rem)] p-4">
        <ChatEdit />
      </main>
    </MessagesProvider>
  );
}
