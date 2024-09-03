"use client";

import { signIn, useSession } from "next-auth/react";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeSelect } from "./theme-select";
import UserOptions from "./user-options";
import { Skeleton } from "./ui/skeleton";
import Sidebar from "./sidebar";

export default function AppBar() {
  const session = useSession();

  return (
    <header className="flex flex-row items-center p-1 h-12">
      <Sidebar />
      <Link className="ml-6 font-extrabold text-xl" href={"/"}>
        Chat2Edit
      </Link>
      <div className="flex flex-row h-full w-fit ml-auto items-center">
        <ThemeSelect className="border-none" />
        {session.status === "unauthenticated" && (
          <Button size={"icon"} variant={"ghost"} onClick={() => signIn()}>
            <LogIn size={20} />
          </Button>
        )}
        {session.status === "loading" && <div className="size-10" />}
        {session.status === "authenticated" && <UserOptions />}
      </div>
    </header>
  );
}
