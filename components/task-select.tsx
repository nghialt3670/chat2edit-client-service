"use client";

import { Select, SelectContent, SelectItem } from "@/components/ui/select";
import ButtonSelectTrigger from "./button-select-trigger";
import { TASK_TO_ICON } from "@/lib/configs/provider";
import TooltipIconButton from "./tooltip-icon-button";
import { ButtonProps } from "@/components/ui/button";
import useChat from "@/lib/hooks/use-chat";
import Task from "@/lib/types/task";
import { cn } from "@/lib/utils";

export function TaskSelect({ className }: ButtonProps) {
  const { task, setTask } = useChat();

  return (
    <Select value={task} onValueChange={(task: Task) => setTask(task)}>
      <ButtonSelectTrigger className={cn(className)}>
        <TooltipIconButton icon={TASK_TO_ICON[task]} text="Select task" />
      </ButtonSelectTrigger>
      <SelectContent className="w-full">
        <SelectItem value={Task.ImageEditing}>
          <span className="truncate">Image editing</span>
        </SelectItem>
        <SelectItem value={Task.SheetEditing}>
          <span className="truncate">Sheet editing</span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
