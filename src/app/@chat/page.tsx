import { ChatProvider } from "@/hooks/use-chat";
import Chat from "@/components/chat";

export default async function ChatPage() {
  return (
    <ChatProvider chat={undefined}>
      <Chat />
    </ChatProvider>
  );
}
