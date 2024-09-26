import { ReactNode } from "react";
import { Button, ButtonProps } from "../ui/button";
import { cn } from "@/lib/utils";

export default function IconButton({
  className,
  children,
  ...props
}: ButtonProps & { children: ReactNode }) {
  return (
    <Button
      className={cn("size-8", className)}
      size={"icon"}
      variant={"ghost"}
      type={"button"}
      {...props}
    >
      {children}
    </Button>
  );
}
