"use client";

import { ReactNode, useEffect, useState } from "react";
import ChatEditDesktop from "@/components/chat2edit-desktop";
import ChatEditMobile from "@/components/chat2edit-mobile";
import { SlotsProvider } from "@/lib/hooks/use-slots";

export default function Chat2Edit({
  chat,
  edit,
}: {
  chat: ReactNode;
  edit: ReactNode;
}) {
  const [width, setWidth] = useState<number>();

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    setWidth(window.innerWidth);
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const isMobile = width && width <= 1024;
  return (
    <SlotsProvider slots={[chat, edit]}>
      {width && (isMobile ? <ChatEditMobile /> : <ChatEditDesktop />)}
    </SlotsProvider>
  );
}
