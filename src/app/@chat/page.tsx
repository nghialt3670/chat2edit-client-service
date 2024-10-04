import { ChatProvider } from "@/hooks/use-chat";
import Chat from "@/app/@chat/_components/chat";

export default async function ChatPage() {
  return (
    <ChatProvider chat={undefined}>
      <Chat />
    </ChatProvider>
  );
}
