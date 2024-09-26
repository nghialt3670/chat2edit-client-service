"use client";

import { CreditCard, LogOut, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { ComponentProps } from "react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export default function UserOptions({ className }: ComponentProps<"img">) {
  const { data: session } = useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-8" size={"icon"} variant={"ghost"}>
          {session?.user?.image ? (
            <Image
              className={cn(
                "rounded-md size-6 hover:cursor-pointer",
                className,
              )}
              src={session.user.image}
              alt=""
              width={10}
              height={10}
            />
          ) : (
            <User />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit min-w-40 mr-3">
        <DropdownMenuLabel>
          {session?.user?.email || "My Account"}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="hover:cursor-pointer">
            <User className="mr-2 size-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:cursor-pointer">
            <CreditCard className="mr-2 size-4" />
            <span>Billing</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="hover:cursor-pointer"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="mr-2 size-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
