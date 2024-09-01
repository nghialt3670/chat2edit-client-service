"use client";

import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import Link from "next/link";
import { canvasFileToDataURL, fetchFile, fetchJSON } from "@/lib/utils";
import { SHOW_RESPONDING_MESSAGE_DELAY_MS } from "@/lib/configs/timer";
import SendMessageResponse from "@/lib/types/send-message-response";
import useMessages from "@/lib/hooks/use-messages";
import ChatStatus from "@/lib/types/chat-status";
import Attachment from "@/lib/types/attachment";
import useChats from "@/lib/hooks/use-chats";
import ChatTask from "@/lib/types/chat-task";
import { MessageList } from "./message-list";
import { ChatSelect } from "./chat-select";
import { TaskSelect } from "./task-select";
import Message from "@/lib/types/message";
import MessageForm from "./message-form";
import DeleteChat from "./delete-chat";
import IChat from "@/lib/types/chat";
import ShareChat from "./share-chat";
import { Button } from "./ui/button";

export default function Chat({ id }: { id: string | undefined }) {
  const [chatId, setChatId] = useState<string | undefined>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<IChat[]>([]);
  const initMessages = useMessages();
  const initChats = useChats();
  const [status, setStatus] = useState<ChatStatus>(ChatStatus.Initializing);
  const [task, setTask] = useState<ChatTask>(ChatTask.ImageEditing);

  useEffect(() => {
    setChatId(id);
  }, [id]);

  useEffect(() => {
    setMessages(initMessages);
    if (initMessages.length % 2 === 0) setStatus(ChatStatus.Idle);
    else setStatus(ChatStatus.ResponseError);
  }, [initMessages]);

  useEffect(() => {
    setChats(initChats);
  }, [initChats]);

  const handleSubmit = async (text: string, attachments: Attachment[]) => {
    const reqMessage = { id: nanoid(), text, attachments };
    setMessages((prev) => [...prev, reqMessage]);
    setStatus(ChatStatus.Sending);
    setTimeout(
      () => setStatus(ChatStatus.Responding),
      SHOW_RESPONDING_MESSAGE_DELAY_MS,
    );

    const formData = new FormData();
    if (chatId) formData.set("chatId", chatId);
    formData.set("task", task);
    formData.set("text", reqMessage.text);
    attachments.forEach((att) => formData.append("files", att.file!));

    const result = (await fetchJSON(
      "/api/chat/send-message",
      "POST",
      formData,
    )) as SendMessageResponse | null;

    if (!result) {
      setStatus(ChatStatus.RequestError);
      return;
    }

    const { newChatId, savedRequest, response } = result;

    if (newChatId) {
      setChatId(newChatId);
      history.pushState({}, "", `/${newChatId}`);
      setChats((prev) => [
        ...prev,
        { id: newChatId, title: "", updatedAt: new Date() },
      ]);
    }

    if (!savedRequest) {
      setStatus(ChatStatus.RequestError);
      return;
    }

    if (!response) {
      setStatus(ChatStatus.ResponseError);
      setChats((prev) => [
        ...prev.slice(0, prev.length - 1),
        { ...prev[prev.length - 1], title: reqMessage.text },
      ]);
      return;
    }

    const resAttachments = await Promise.all(
      response.attachments.map(async (att) => {
        if (!att.name.endsWith(".canvas")) return att;
        const file = await fetchFile(`/api/file/${att.fileId}`);
        if (!file) return att;
        const dataURL = await canvasFileToDataURL(file);
        if (!dataURL) return att;
        att.dataURL = dataURL;
        return att;
      }),
    );

    const resMessage = {
      id: nanoid(),
      text: response.text,
      attachments: resAttachments,
    };

    setStatus(ChatStatus.Idle);
    setMessages((prev) => [...prev, resMessage]);
    setChats((prev) => [
      ...prev.slice(0, prev.length - 1),
      { ...prev[prev.length - 1], title: resMessage.text },
    ]);
  };

  const handleTaskChange = (task: ChatTask) => {
    setTask(task);
  };

  return (
    <div className="size-full flex flex-col space-y-4">
      <div className="flex flex-row rounded-md border border-transparent">
        <div className="flex flex-row space-x-2">
          <TaskSelect onChange={handleTaskChange} />
          <ChatSelect chats={chats} />
          <Link href={"/"}>
            <Button variant={"ghost"} type="submit">
              New chat
            </Button>
          </Link>
        </div>
        {chatId && (
          <div className="flex flex-row ml-auto items-center">
            <DeleteChat chatId={chatId} />
            <ShareChat chatId={chatId} />
          </div>
        )}
      </div>
      <MessageList status={status} messages={messages} />
      <MessageForm status={status} onSubmit={handleSubmit} />
    </div>
  );
}
