"use client";

import { useEffect, useState } from "react";
import ChatEditDesktop from "@/components/chat-edit-desktop";
import ChatEditMobile from "@/components/chat-edit-mobile";

export default function ChatEdit() {
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

  const isMobile = width && width <= 768;
  return <>{width && (isMobile ? <ChatEditMobile /> : <ChatEditDesktop />)}</>;
}
