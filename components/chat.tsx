"use client";

import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import { z } from "zod";
import { SHOW_RESPONDING_MESSAGE_DELAY_MS } from "@/lib/configs/timer";
import { TASK_TO_PROVIDER } from "@/lib/configs/provider";
import SendResponse from "@/lib/types/send-response";
import { formDataSchema } from "@/lib/configs/form";
import ChatStatus from "@/lib/types/chat-status";
import Attachment from "@/lib/types/attachment";
import LanguageSelect from "./language-select";
import useChats from "@/lib/hooks/use-chats";
import { MessageList } from "./message-list";
import useChat from "@/lib/hooks/use-chat";
import { ChatSelect } from "./chat-select";
import { TaskSelect } from "./task-select";
import Message from "@/lib/types/message";
import MessageForm from "./message-form";
import { fetchJSON } from "@/lib/utils";
import DeleteChat from "./delete-chat";
import ShareChat from "./share-chat";
import { Button } from "./ui/button";

export default function Chat() {
  const router = useRouter();
  const { updateChat } = useChats();
  const {
    chatId,
    setChatId,
    messages,
    setMessages,
    task,
    setTask,
    language,
    setLanguage,
    status,
    setStatus,
    resetChat,
  } = useChat();

  const handleSubmit = async (text: string, attachments: Attachment[]) => {
    const reqMessage: Message = {
      id: nanoid(),
      text,
      attachments,
      createdAt: new Date(),
    };

    const formValues = {
      chatId,
      text: reqMessage.text,
      files: attachments.map((att) => att.file),
      provider: TASK_TO_PROVIDER[task],
      language,
    };

    try {
      formDataSchema.parse(formValues);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors;
        console.error("Validation errors:", errors);
        return;
      }
    }

    setMessages((prev) => [...prev, reqMessage]);
    setStatus(ChatStatus.Sending);
    setTimeout(
      () => setStatus(ChatStatus.Responding),
      SHOW_RESPONDING_MESSAGE_DELAY_MS,
    );

    const formData = new FormData();
    if (chatId) formData.set("chatId", chatId);
    formData.set("provider", TASK_TO_PROVIDER[task]);
    formData.set("text", reqMessage.text);
    formData.set("language", language);
    attachments.forEach((att) => formData.append("files", att.file!));

    const result = (await fetchJSON(
      "/api/chat/send-message",
      "POST",
      formData,
    )) as SendResponse | null;

    if (!result) {
      setStatus(ChatStatus.RequestError);
      return;
    }

    const { currChat, savedReqMessage, resMessage } = result;

    if (currChat) {
      updateChat(currChat);
      if (currChat.id !== chatId) {
        setChatId(currChat.id);
        history.pushState({}, "", `/${currChat.id}`);
      }
    }

    if (!savedReqMessage) {
      setStatus(ChatStatus.RequestError);
      return;
    }

    if (!resMessage) {
      setStatus(ChatStatus.ResponseError);
      return;
    }

    setStatus(ChatStatus.Idle);
    setMessages((prev) => [...prev, resMessage]);
  };

  const handleNewChatClick = () => {
    resetChat();
    router.push("/");
  };

  return (
    <div className="size-full flex flex-col space-y-4">
      <div className="flex flex-row rounded-md border border-transparent">
        <div className="flex flex-row space-x-2">
          <ChatSelect />
          <TaskSelect task={task} onTaskChange={(task) => setTask(task)} />
          <LanguageSelect
            language={language}
            onLanguageChange={(language) => setLanguage(language)}
          />
          <Button
            variant={"secondary"}
            type="submit"
            onClick={handleNewChatClick}
          >
            New chat
          </Button>
        </div>
        {chatId && (
          <div className="flex flex-row ml-auto items-center">
            <DeleteChat />
            <ShareChat />
          </div>
        )}
      </div>
      <MessageList status={status} messages={messages} />
      <MessageForm status={status} task={task} onSubmit={handleSubmit} />
    </div>
  );
}
