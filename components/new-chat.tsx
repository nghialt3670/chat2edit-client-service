"use client";

import { usePathname, useRouter } from "next/navigation";
import ChatStatus from "@/lib/types/chat-status";
import useChat from "@/lib/hooks/use-chat";
import { Button } from "./ui/button";

export default function NewChat() {
  const { resetChat, setStatus } = useChat();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Button
      variant={"secondary"}
      type="submit"
      disabled={pathname === "/"}
      onClick={() => {
        resetChat();
        setStatus(ChatStatus.Initializing);
        router.push("/");
      }}
    >
      New chat
    </Button>
  );
}
