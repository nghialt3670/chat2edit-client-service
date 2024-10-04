"use client";

import { usePathname, useRouter } from "next/navigation";
import TextButton from "../../../components/buttons/text-button";
import useChat from "@/hooks/use-chat";

export default function NewChat() {
  const { resetChat, setStatus, isNew } = useChat();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <TextButton
      variant={"secondary"}
      type="submit"
      disabled={pathname === "/"}
      onClick={() => {
        resetChat();
        // If the current chat is new, it is not actually
        // navigated to the path with the chat id yet because
        // of history.pushState api. Hence intializing state
        // will remain if set
        if (!isNew) setStatus("initializing");
        router.push("/");
      }}
    >
      New chat
    </TextButton>
  );
}
