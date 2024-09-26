"use client";

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Select, SelectContent, SelectItem } from "./ui/select";
import ButtonSelectTrigger from "./button-select-trigger";
import { ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ThemeSelect({ className }: ButtonProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [open, setOpen] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const icon = mounted ? (
    resolvedTheme === "light" ? (
      <Sun size={20} />
    ) : (
      <Moon size={20} />
    )
  ) : null;

  return (
    <Select
      defaultValue={theme ? theme : "dark"}
      open={open}
      onOpenChange={setOpen}
      onValueChange={(theme) => setTheme(theme)}
    >
      <ButtonSelectTrigger className={cn("border-none", className)}>
        {icon}
      </ButtonSelectTrigger>
      <SelectContent className="mr-1">
        <SelectItem value="light">Light</SelectItem>
        <SelectItem value="dark">Dark</SelectItem>
        <SelectItem value="system">System</SelectItem>
      </SelectContent>
    </Select>
  );
}
