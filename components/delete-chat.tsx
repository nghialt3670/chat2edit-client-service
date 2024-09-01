"use client";

import { useRef, useState, useTransition } from "react";

import { AlertCircle, Trash2 } from "lucide-react";

import { usePathname, useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import useChatHistoryStore from "@/stores/chat-history-store";
import { Button } from "@/components/ui/button";

export default function DeleteChat({ chatId }: { chatId: string }) {
  const [isPending, startTransition] = useTransition();
  const [isError, setIsError] = useState<boolean>(false);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleDelete = async () => {
    startTransition(async () => {
      const response = await fetch(`/api/chat/${chatId}`, { method: "DELETE" });
      if (response.ok) {
        // chatHistoryStore.removeChat(chatId);
        if (pathname.endsWith(chatId)) router.push("/");
        if (cancelButtonRef.current) cancelButtonRef.current.click();
      } else {
        setIsError(true);
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size={"icon"}
              variant={"ghost"}
              onClick={() => setOpen(true)}
            >
              <Trash2 size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Share chat</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your chat
            and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {isError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Can not delete the chat. Please try later!
            </AlertDescription>
          </Alert>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel ref={cancelButtonRef}>Cancel</AlertDialogCancel>
          <Button onClick={handleDelete} disabled={isPending || isError}>
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
