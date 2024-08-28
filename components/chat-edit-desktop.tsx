"use client";

import { useEffect, useRef, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import ImageEditor from "./image-editor";
import Chat from "./chat";

export default function ChatEditDesktop() {
  const [editorMaxWidth, setEditorMaxWidth] = useState<number>(60);
  const [editorMaxHeight, setEditorMaxHeight] = useState<number>(0);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      resizeTimeoutRef.current = setTimeout(() => {
        for (let entry of entries) {
          const newWidth = entry.contentRect.width;
          const newHeight = entry.contentRect.height;
          console.log(
            "Resizing stopped. Final width:",
            newWidth,
            "Final height:",
            newHeight,
          );
          setEditorMaxWidth(newWidth);
          setEditorMaxHeight(newHeight);
        }
      }, 200);
    });

    const resizablePanel = document.querySelector(".image-editor-panel");
    if (resizablePanel) {
      resizeObserver.observe(resizablePanel);
    }

    return () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="size-full rounded-md border"
    >
      <ResizablePanel defaultSize={50} minSize={30}>
        <Chat />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel
        defaultSize={50}
        minSize={30}
        className="image-editor-panel"
      >
        <ImageEditor maxWidth={editorMaxWidth} maxHeight={editorMaxHeight} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
