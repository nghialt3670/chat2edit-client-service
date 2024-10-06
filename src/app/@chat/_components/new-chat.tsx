"use client";

import { usePathname, useRouter } from "next/navigation";
import { FabricImage, filters } from "fabric";
import { useRef } from "react";
import TextButton from "../../../components/buttons/text-button";
import useChat from "@/hooks/use-chat";

export default function NewChat() {
  const { resetChat, setStatus, isNew } = useChat();
  const pathname = usePathname();
  const router = useRouter();

  const ref = useRef(null);

  return (
    <TextButton
      variant={"secondary"}
      type="submit"
      disabled={pathname === "/"}
      onClick={async () => {
        resetChat();
        // If the current chat is new, it is not actually
        // navigated to the path with the chat id yet because
        // of history.pushState api. Hence intializing state
        // will remain if set
        if (!isNew) setStatus("initializing");
        router.push("/");
        const image = await FabricImage.fromElement(ref.current!);
        image?.filters.push(new filters.Grayscale());
        image?.filters.push(new filters.Invert());
        image?.filters.push(new filters.Brightness());
        image?.filters.push(new filters.Blur());
        image?.filters.push(new filters.Contrast());
        image?.filters.push(new filters.Noise());
        image?.filters.push(new filters.Pixelate());
        console.log(image?.toObject());
      }}
    >
      New chat
      <img ref={ref} src="" alt="" />
    </TextButton>
  );
}
