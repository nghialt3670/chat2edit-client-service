"use client";

import { usePathname, useRouter } from "next/navigation";
import ChatStatus from "@/lib/types/chat-status";
import useChat from "@/lib/hooks/use-chat";
import { Button } from "./ui/button";

export default function NewChat() {
  const { resetChat, setStatus, isNew } = useChat();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Button
      variant={"secondary"}
      type="submit"
      disabled={pathname === "/"}
      onClick={() => {
        resetChat();
        // If the current chat is new, it is not actually
        // navigated to the path with the chat id yet because
        // of history.pushState api. Hence intializing state
        // will remain if set
        if (!isNew) setStatus(ChatStatus.Initializing);
        router.push("/");
      }}
    >
      New chat
    </Button>
  );
}
