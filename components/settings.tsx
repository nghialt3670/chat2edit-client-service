"use client";

import { Settings as SettingsIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ThemeSelect } from "./theme-select";

export default function Settings() {
  return (
    <Dialog>
      <DialogTrigger className="flex flex-row w-full">
        <SettingsIcon className="mr-2 size-4" size={20} />
        <span>Settings</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="flex flex-row items-center space-x-2">
          <span>Select theme:</span>
          <ThemeSelect />
        </div>
      </DialogContent>
    </Dialog>
  );
}
