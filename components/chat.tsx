"use client";

import LanguageSelect from "./language-select";
import MessageList from "./message-list";
import useChat from "@/lib/hooks/use-chat";
import ChatSelect from "./chat-select";
import TaskSelect from "./task-select";
import MessageForm from "./message-form";
import DeleteChat from "./delete-chat";
import ShareChat from "./share-chat";
import NewChat from "./new-chat";

export default function Chat() {
  const { chatId } = useChat();

  return (
    <div className="size-full flex flex-col space-y-4">
      <div className="flex flex-row border border-transparent">
        <div className="flex flex-row space-x-2">
          <ChatSelect />
          <TaskSelect />
          <LanguageSelect />
          <NewChat />
        </div>
        {chatId && (
          <div className="flex flex-row ml-auto items-center">
            <DeleteChat />
            <ShareChat />
          </div>
        )}
      </div>
      <MessageList />
      <MessageForm />
    </div>
  );
}
