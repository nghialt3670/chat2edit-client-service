import { notFound, redirect } from "next/navigation";
import chatDetailsSchema, { ChatDetails } from "@/schemas/chat-details.schema";
import { ChatProvider } from "@/hooks/use-chat";
import Chat from "@/app/@chat/_components/chat";
import { auth } from "@/auth";
import ENV from "@/lib/env";

export default async function ChatPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const session = await auth();
  const accountId = session?.user?.id;

  if (!accountId) redirect("/sign-in");

  let chat: ChatDetails | null | undefined;

  try {
    const endpoint = `${ENV.BACKEND_API_BASE_URL}/api/chats/${id}?accountId=${accountId}`;
    const response = await fetch(endpoint);

    if (response.status === 404) notFound();
    else if (!response.ok) chat = null;

    const payload = await response.json();
    chat = chatDetailsSchema.parse(payload);
  } catch {
    chat = null;
  }

  return (
    <ChatProvider chat={chat}>
      <Chat />
    </ChatProvider>
  );
}
