"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import useSlots from "@/lib/hooks/use-slots";

export default function ChatEditDesktop() {
  const [chat, edit] = useSlots();

  return (
    <ResizablePanelGroup direction="horizontal" className="flex p-4 pt-0">
      <ResizablePanel className="p-4" defaultSize={40} minSize={30}>
        {chat}
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel
        id="editor-panel"
        className="p-4"
        defaultSize={60}
        minSize={30}
      >
        {edit}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
