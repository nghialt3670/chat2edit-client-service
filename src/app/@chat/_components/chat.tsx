"use client";

import LanguageSelect from "./language-select";
import MessageForm from "./message-form";
import MessageList from "./message-list";
import useChat from "@/hooks/use-chat";
import ChatSelect from "./chat-select";
import ChatDelete from "./chat-delete";
import TaskSelect from "./task-select";
import ChatShare from "./chat-share";
import NewChat from "./new-chat";

export default function Chat() {
  const { chatId } = useChat();

  return (
    <div className="size-full flex flex-col space-y-4">
      <div className="flex flex-row border-transparent">
        <div className="flex flex-row space-x-2">
          <ChatSelect />
          <TaskSelect />
          <LanguageSelect />
          <NewChat />
        </div>
        {chatId && (
          <div className="flex flex-row ml-auto items-center">
            <ChatDelete />
            <ChatShare />
          </div>
        )}
      </div>
      <MessageList />
      <MessageForm />
    </div>
  );
}
