"use client";

import { useEffect, useState } from "react";
import ChatEditDesktop from "@/app/_components/chat2edit-desktop";
import ChatEditMobile from "@/app/_components/chat2edit-mobile";

export default function Chat2Edit() {
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
  return <>{width && (isMobile ? <ChatEditMobile /> : <ChatEditDesktop />)}</>;
}
