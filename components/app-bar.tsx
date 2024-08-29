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
      <div className="flex flex-row h-full ml-auto items-center space-x-2 mr-2">
        <ThemeSelect className="size-fit p-1" />
        {session.status === "unauthenticated" && (
          <Button size={"icon"} variant={"ghost"}>
            <LogIn size={20} onClick={() => signIn()} />
          </Button>
        )}
        {session.status === "loading" && <Skeleton className="size-6" />}
        {session.status === "authenticated" && <UserOptions />}
      </div>
    </header>
  );
}
