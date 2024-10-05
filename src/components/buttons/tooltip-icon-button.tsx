"use client";

import { ButtonProps } from "react-day-picker";
import { ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import IconButton from "./icon-button";

interface TooltipIconButtonProps extends ButtonProps {
  text: string;
  children: ReactNode;
}

export default function TooltipIconButton({
  text,
  children,
  ...props
}: TooltipIconButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger type="button" className="size-8 flex justify-center items-center hover:bg-accent disabled:hover:bg-transparent disabled:opacity-30 rounded-md" {...props}>
          {children}
        </TooltipTrigger>
        <TooltipContent>
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
