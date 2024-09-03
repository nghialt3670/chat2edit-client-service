import { ChatProvider } from "@/lib/hooks/use-chat";
import Chat from "@/components/chat";

export default async function ChatPage() {
  return (
    <ChatProvider>
      <Chat />
    </ChatProvider>
  );
}
