"use client";

import { CirclePlus, Loader2, Share, SquarePlus, Trash2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SHOW_RESPONDING_MESSAGE_DELAY_MS } from "@/lib/configs/timer";
import SendMessageResponse from "@/lib/types/send-message-response";
import useMessages from "@/lib/hooks/use-messages";
import { fetchFile, fetchJSON } from "@/lib/utils";
import ChatStatus from "@/lib/types/chat-status";
import useChats from "@/lib/hooks/use-chats";
import { MessageList } from "./message-list";
import { ChatSelect } from "./chat-select";
import Message from "@/lib/types/message";
import MessageForm from "./message-form";
import IChat from "@/lib/types/chat";
import ShareChat from "./share-chat";
import { Button } from "./ui/button";
import DeleteChat from "./delete-chat";

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<IChat[]>([]);
  const initMessages = useMessages();
  const initChats = useChats();
  const [status, setStatus] = useState<ChatStatus>(ChatStatus.Idle);
  const pathname = usePathname();

  useEffect(() => {
    const updateMessages = async () => {
      const filledMessages: Message[] = await Promise.all(
        initMessages.map(async (msg) => ({
          ...msg,
          files: await Promise.all(
            msg.fileIds.map(async (id) => await fetchFile(`/api/file/${id}`)),
          ),
        })),
      );
      console.log(filledMessages);
      setMessages(filledMessages);
    };
    updateMessages();
  }, [initMessages]);

  useEffect(() => {
    setChats(initChats);
  }, [initChats]);

  const handleSubmit = async (text: string, files: File[]) => {
    const reqMessage = { id: nanoid(), text, files };
    setMessages((prev) => [...prev, reqMessage]);
    setStatus(ChatStatus.Sending)
    setTimeout(
      () => setStatus(ChatStatus.Responding),
      SHOW_RESPONDING_MESSAGE_DELAY_MS,
    );

    const formData = new FormData();
    if (pathname.startsWith("/chat/"))
      formData.set("chatId", pathname.split("/").pop()!);
    formData.set("text", reqMessage.text);
    files.forEach((file) => formData.append("files", file!));

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
      history.pushState({}, "", `/chat/${newChatId}`);
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

    const resMessage = {
      id: nanoid(),
      text: response.text,
      files: await Promise.all(
        response.fileIds.map(async (id) => await fetchFile(`/api/file/${id}`)),
      ),
    };

    setStatus(ChatStatus.Idle);
    setMessages((prev) => [...prev, resMessage]);
    setChats((prev) => [
      ...prev.slice(0, prev.length - 1),
      { ...prev[prev.length - 1], title: resMessage.text },
    ]);
  };

  return (
    <div className="size-full flex flex-col p-4 space-y-4">
      <div className="flex flex-row rounded-md border border-transparent">
        <ChatSelect chats={chats} />
        <Button variant={"ghost"} type="submit">
          <Link href={"/"}>New chat</Link>
        </Button>
        <div className="flex flex-row ml-auto items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DeleteChat chatId={pathname.split("/").pop()!} />
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete chat</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size={"icon"} variant={"ghost"} type="submit">
                  <ShareChat chatId={pathname.split("/").pop()!} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share chat</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <MessageList status={status} messages={messages} />
      <MessageForm onSubmit={handleSubmit} />
    </div>
  );
}
