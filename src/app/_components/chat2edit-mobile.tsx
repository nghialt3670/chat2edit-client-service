"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useSlots from "@/hooks/use-slots";

export default function ChatEditMobile() {
  const [chat, edit] = useSlots();
  return (
    <Tabs defaultValue="chat" className="flex flex-col size-full p-4">
      <TabsContent className="h-full m-0" value="chat">
        {chat}
      </TabsContent>
      <TabsContent className="h-full m-0" value="edit">
        {edit}
      </TabsContent>
      <TabsList className="grid w-full grid-cols-2 mt-4">
        <TabsTrigger value="chat">Chat</TabsTrigger>
        <TabsTrigger value="edit">Edit</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
