import { notFound } from "next/navigation";
import { nanoid } from "nanoid";
import { MessagesProvider } from "@/lib/hooks/use-messages";
import DatalessMessage from "@/lib/types/dataless-message";
import Message from "@/lib/types/message";
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
    include: { messages: { include: { attachments: true } } },
  });

  if (!chat) notFound();

  const messages: Message[] = await Promise.all(
    chat.messages.map(async (msg) => ({
      id: nanoid(),
      text: msg.text,
      attachments: msg.attachments.map((att) => ({
        type: att.type,
        name: att.name,
        size: att.size,
        fileId: att.fileId,
        width: att.width ?? undefined,
        height: att.height ?? undefined,
      })),
    })),
  );

  return (
    <MessagesProvider messages={messages}>
      <Chat id={id} />
    </MessagesProvider>
  );
}
