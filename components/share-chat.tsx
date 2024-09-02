"use client";

import { AlertCircle, Forward, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
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
import useChat from "@/lib/hooks/use-chat";
import { fetchJSON } from "@/lib/utils";

export default function ShareChat() {
  const [open, setOpen] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>();
  const [isCreateError, setIsCreateError] = useState<boolean>();
  const [isDeleteError, setIsDeleteError] = useState<boolean>();
  const [isCreating, startCreating] = useTransition();
  const [isDeleting, startDeleting] = useTransition();
  const { chatId, shareId, setShareId } = useChat();

  if (!chatId) return undefined;

  const endpoint = `/api/chat/${chatId}/share-id`;

  const handleCopyClick = async () => {
    if (!shareId) return;
    const shareLink = `${window.location.origin}/share/chat/${shareId}`;
    await navigator.clipboard.writeText(shareLink);
    setIsCopied(true);
  };

  const handleCreateClick = async () => {
    startCreating(async () => {
      const shareId = (await fetchJSON(endpoint, "POST")) as string;
      shareId ? setShareId(shareId) : setIsCreateError(true);
    });
  };

  const handleDeleteClick = async () => {
    startDeleting(async () => {
      (await fetchJSON(endpoint, "DELETE"))
        ? setShareId(undefined)
        : setIsDeleteError(true);
    });
  };

  const shareLink = shareId
    ? `${window.location.origin}/share/chat/${shareId}`
    : undefined;

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <TooltipIconButton
        icon={<Forward />}
        text="Share chat"
        onClick={() => setOpen(true)}
      />
      <AlertDialogContent className="flex flex-col">
        <AlertDialogHeader>
          <AlertDialogTitle>Share this chat</AlertDialogTitle>
          <AlertDialogDescription>
            All user who have this link can have a copy of this chat.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {shareLink && !isDeleting && (
          <div className="flex flex-row items-center w-full">
            <span className="truncate overflow-hidden">{shareLink}</span>
            <Button
              className="size-7"
              size={"icon"}
              variant={"ghost"}
              onClick={handleDeleteClick}
              disabled={isDeleting}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        )}
        {isCreateError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Can not create a share link. Please try later!
            </AlertDescription>
          </Alert>
        )}
        {isDeleteError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Can not delete this share link. Please try later!
            </AlertDescription>
          </Alert>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel>{isCopied ? "Close" : "Cancel"}</AlertDialogCancel>
          {shareLink ? (
            <Button onClick={handleCopyClick} disabled={isCopied}>
              {isCopied ? "Link Copied" : "Copy Link"}
            </Button>
          ) : (
            <Button
              onClick={handleCreateClick}
              disabled={isCreating || isCreateError}
            >
              {isCreating ? "Creating.." : "Create Link"}
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
