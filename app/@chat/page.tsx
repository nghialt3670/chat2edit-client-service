import { MessagesProvider } from "@/lib/hooks/use-messages";
import { ChatProvider } from "@/lib/hooks/use-chat";
import Chat from "@/components/chat";

export default async function ChatPage() {
  return <Chat />;
}
