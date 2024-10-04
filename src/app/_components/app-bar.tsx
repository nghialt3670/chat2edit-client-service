"use client";

import { signIn, useSession } from "next-auth/react";
import { LogIn } from "lucide-react";
import Link from "next/link";
import IconButton from "../../components/buttons/icon-button";
import ThemeSelect from "./theme-select";
import UserOptions from "./user-options";

export default function AppBar() {
  const session = useSession();

  return (
    <header className="flex flex-row items-center p-1 h-12">
      <Link className="ml-6 font-bold text-xl" href={"/"}>
        Chat2Edit
      </Link>
      <div className="flex flex-row ml-auto mr-1">
        <ThemeSelect className="border-none" />
        {session.status === "unauthenticated" && (
          <IconButton onClick={() => signIn()}>
            <LogIn size={20} />
          </IconButton>
        )}
        {session.status === "loading" && <div className="size-8" />}
        {session.status === "authenticated" && <UserOptions />}
      </div>
    </header>
  );
}
