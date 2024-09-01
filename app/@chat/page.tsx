import { MessagesProvider } from "@/lib/hooks/use-messages";
import Chat from "@/components/chat";

export default async function ChatPage() {
  return (
    <MessagesProvider messages={[]}>
      <Chat id={undefined} />
    </MessagesProvider>
  );
}
