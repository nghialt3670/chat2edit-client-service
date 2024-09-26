import { notFound } from "next/navigation";
import chatPreviewResponseSchema, {
  ChatDetails,
} from "@/schemas/chat-details.schema";
import { ChatProvider } from "@/hooks/use-chat";
import Chat from "@/components/chat";

export default async function ChatPage({ params }: { params: { id: string } }) {
  const { id } = params;

  let chat: ChatDetails | null | undefined;

  try {
    const response = await fetch(`/api/chats/${id}`);

    if (response.status === 404) notFound();
    else if (!response.ok) chat = null;

    const payload = await response.json();
    chat = chatPreviewResponseSchema.parse(payload);
  } catch {
    chat = null;
  }

  return (
    <ChatProvider chat={chat}>
      <Chat />
    </ChatProvider>
  );
}
