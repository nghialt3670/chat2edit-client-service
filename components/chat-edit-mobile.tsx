import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageEditor from "./image-editor";
import Chat from "./chat";

export default function ChatEditMobile() {
  return (
    <Tabs defaultValue="chat" className="flex flex-col size-full">
      <TabsContent className="h-full" value="chat">
        <Chat />
      </TabsContent>
      <TabsContent className="h-full" value="edit">
        <ImageEditor
          maxWidth={window.innerWidth}
          maxHeight={window.innerHeight - 128}
        />
      </TabsContent>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="chat">Chat</TabsTrigger>
        <TabsTrigger value="edit">Edit</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
