import Chat from "@/app/@chat/_components/chat";
import { ChatProvider } from "@/hooks/use-chat";

export default async function ChatPage() {
  return (
    <ChatProvider chat={undefined}>
      <Chat />
    </ChatProvider>
  );
}
