"use client";

import { useRef, useState, useTransition } from "react";
import { AlertCircle, Trash2 } from "lucide-react";
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
import TooltipIconButton from "../../../components/buttons/tooltip-icon-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import TextButton from "../../../components/buttons/text-button";
import useHistory from "@/hooks/use-history";
import useChat from "@/hooks/use-chat";

export default function ChatDelete() {
  const [isPending, startTransition] = useTransition();
  const [isError, setIsError] = useState<boolean>(false);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  const { removeChat } = useHistory();
  const { chatId } = useChat();

  if (!chatId) return undefined;

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        const endpoint = `/api/chats/${chatId}`;
        const response = await fetch(endpoint, { method: "DELETE" });
        if (!response.ok) throw new Error();
        router.push("/");
        removeChat(chatId);
        if (cancelButtonRef.current) cancelButtonRef.current.click();
      } catch {
        setIsError(true);
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <TooltipIconButton text="Delete chat" onClick={() => setOpen(true)}>
        <Trash2 size={18} />
      </TooltipIconButton>
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
          <AlertDialogCancel className="h-8" ref={cancelButtonRef}>
            Cancel
          </AlertDialogCancel>
          <TextButton
            variant={"destructive"}
            onClick={handleDelete}
            disabled={isPending || isError}
          >
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
          </TextButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
