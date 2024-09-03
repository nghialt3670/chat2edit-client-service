"use client";

import Link from "next/link";
import useChat from "@/lib/hooks/use-chat";
import { Button } from "./ui/button";

export default function NewChat() {
  const { resetChat } = useChat();
  return (
    <Link href={"/"}>
      <Button variant={"secondary"} type="submit" onClick={() => resetChat()}>
        New chat
      </Button>
    </Link>
  );
}
