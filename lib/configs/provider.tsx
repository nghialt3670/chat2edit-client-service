import { Image, Sheet } from "lucide-react";
import { Provider } from "@prisma/client";
import { ReactNode } from "react";
import Task from "../types/task";

export const TASK_TO_PROVIDER: Record<Task, Provider> = {
  "image-editing": Provider.FABRIC,
  "sheet-editing": Provider.PANDAS,
};

export const PROVIDER_TO_TASK: Record<Provider, Task> = {
  FABRIC: Task.ImageEditing,
  PANDAS: Task.SheetEditing,
};

export const TASK_TO_ICON: Record<Task, ReactNode> = {
  "image-editing": <Image />,
  "sheet-editing": <Sheet />,
};
