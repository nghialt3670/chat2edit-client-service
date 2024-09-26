import { ReactNode } from "react";
import { Button, ButtonProps } from "../ui/button";
import { cn } from "@/lib/utils";

export default function TextButton({
  className,
  children,
  ...props
}: ButtonProps & { children: ReactNode }) {
  return (
    <Button
      className={cn("h-8 px-2.5", className)}
      variant={"ghost"}
      type={"button"}
      {...props}
    >
      {children}
    </Button>
  );
}
