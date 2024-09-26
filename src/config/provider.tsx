import { Image, Sheet } from "lucide-react";
import { ReactNode } from "react";
import { Provider } from "@/schemas/chat-settings.schema";

export const PROVIDER_TO_TASK: Record<Provider, string> = {
  fabric: "image-editing",
  pandas: "sheet-editing",
};

export const PROVIDER_TO_ICON: Record<Provider, ReactNode> = {
  fabric: <Image />,
  pandas: <Sheet />,
};

export const PROVIDER_TO_FILE_ACCEPT: Record<Provider, string> = {
  fabric: "image/*",
  pandas: ".csv, .xls, .xlsx",
};
