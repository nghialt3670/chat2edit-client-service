"use client";

import { signIn, useSession } from "next-auth/react";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
      {session.status === "unauthenticated" && (
        <Button className="ml-auto" size={"icon"} variant={"ghost"}>
          <LogIn size={20} onClick={() => signIn()} />
        </Button>
      )}
      {session.status === "loading" && (
        <Skeleton className="size-6 ml-auto mr-3" />
      )}
      {session.status === "authenticated" && (
        <UserOptions className="ml-auto mr-3" />
      )}
    </header>
  );
}
