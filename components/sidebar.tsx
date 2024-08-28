"use client";

import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "./ui/button";

export default function Sidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size={"icon"} variant={"ghost"}>
          <Menu size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent side={"left"}>
        <nav></nav>
      </SheetContent>
    </Sheet>
  );
}
