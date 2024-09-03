"use client";

import { AlertCircle, Trash, Trash2 } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import TooltipIconButton from "./tooltip-icon-button";
import { Button } from "@/components/ui/button";
import useChats from "@/lib/hooks/use-chats";
import useChat from "@/lib/hooks/use-chat";

export default function DeleteChat() {
  const [isPending, startTransition] = useTransition();
  const [isError, setIsError] = useState<boolean>(false);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  const { removeChat } = useChats();
  const { chatId } = useChat();

  if (!chatId) return undefined;

  const handleDelete = async () => {
    startTransition(async () => {
      const response = await fetch(`/api/chat/${chatId}`, { method: "DELETE" });
      if (response.ok) {
        router.push("/");
        removeChat(chatId);
        if (cancelButtonRef.current) cancelButtonRef.current.click();
      } else {
        setIsError(true);
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <TooltipIconButton
        icon={<Trash2 size={16} />}
        text="Delete chat"
        onClick={() => setOpen(true)}
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action is irreversible. Deleting this chat will permanently
            remove all associated data from our servers.
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
            {isPending ? (
              <CircularProgress
                className="mr-2 mb-0.5"
                color="inherit"
                size={15}
              />
            ) : (
              <Trash2 className="mr-2" size={15} />
            )}
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
