"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import useSlots from "@/hooks/use-slots";

export default function ChatEditDesktop() {
  const [chat, edit] = useSlots();

  return (
    <ResizablePanelGroup direction="horizontal" className="flex p-10 pt-5">
      <ResizablePanel className="pr-3" defaultSize={40} minSize={30}>
        {chat}
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel
        id="editor-panel"
        className="pl-3 "
        defaultSize={60}
        minSize={30}
      >
        {edit}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
