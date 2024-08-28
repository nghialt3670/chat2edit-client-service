import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Chat from "./chat";

export default function ChatEditMobile() {
  return (
    <Tabs defaultValue="account" className="size-full">
      <TabsList>
        <TabsTrigger value="Chat">Chat</TabsTrigger>
        <TabsTrigger value="Edit">Edit</TabsTrigger>
      </TabsList>
      <TabsContent value="chat">
        <Chat />
      </TabsContent>
      <TabsContent value="edit">Change your password here.</TabsContent>
    </Tabs>
  );
}
