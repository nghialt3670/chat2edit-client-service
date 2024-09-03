"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import ChatStatus from "@/lib/types/chat-status";
import useChat from "@/lib/hooks/use-chat";
import { Button } from "./ui/button";

export default function NewChat() {
  const { resetChat, setStatus } = useChat();
  const pathname = usePathname();

  return (
    <Link href={"/"}>
      <Button
        variant={"secondary"}
        type="submit"
        disabled={pathname === "/"}
        onClick={() => {
          resetChat();
          setStatus(ChatStatus.Initializing);
        }}
      >
        New chat
      </Button>
    </Link>
  );
}
