"use client";

import { useEffect, useState } from "react";
import ChatEditDesktop from "@/components/chat-edit-desktop";
import ChatEditMobile from "@/components/chat-edit-mobile";

export default function Home() {
  const [width, setWidth] = useState<number>(window.innerWidth);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const isMobile = width <= 768;
  return (
    <main className="h-[calc(100%-3rem)] p-4">
      {isMobile ? <ChatEditMobile /> : <ChatEditDesktop />}
    </main>
  );
}
