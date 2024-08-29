import { MessagesProvider } from "@/lib/hooks/use-messages";
import ChatEdit from "@/components/chat-edit";

export default function Home() {
  return (
    <MessagesProvider messages={[]}>
      <main className="h-[calc(100%-3rem)] p-4">
        <ChatEdit />
      </main>
    </MessagesProvider>
  );
}
