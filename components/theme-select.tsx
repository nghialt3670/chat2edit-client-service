"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Select, SelectContent, SelectItem } from "./ui/select";
import ButtonSelectTrigger from "./button-select-trigger";
import { ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ThemeSelect({ className }: ButtonProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [open, setOpen] = useState<boolean>(false);

  const icon =
    theme === "system" ? (
      resolvedTheme === "light" ? (
        <Sun size={20} />
      ) : (
        <Moon size={20} />
      )
    ) : theme === "light" ? (
      <Sun size={20} />
    ) : (
      <Moon size={20} />
    );

  return (
    <Select
      defaultValue={theme ? theme : "dark"}
      open={open}
      onOpenChange={setOpen}
      onValueChange={(theme) => setTheme(theme)}
    >
      <ButtonSelectTrigger
        className={cn(
          "w-fit px-2.5 hover:bg-accent rounded-md border-none",
          className,
        )}
      >
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
