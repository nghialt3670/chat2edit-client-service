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
import TooltipIconButton from "../../../components/buttons/tooltip-icon-button";
import objectIdSchema from "@/schemas/object-id.schema";
import { Button } from "@/components/ui/button";
import TextButton from "../../../components/buttons/text-button";
import useChat from "@/hooks/use-chat";

export default function ChatShare() {
  const [open, setOpen] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>();
  const [isCreateError, setIsCreateError] = useState<boolean>();
  const [isDeleteError, setIsDeleteError] = useState<boolean>();
  const [isCreating, startCreating] = useTransition();
  const [isDeleting, startDeleting] = useTransition();
  const { chatId, shareId, setShareId } = useChat();

  if (!chatId) return undefined;

  const endpoint = `/api/chats/${chatId}/shareId`;

  const handleCopyClick = async () => {
    if (!shareId) return;
    const shareLink = `${window.location.origin}/share/chat/${shareId}`;
    await navigator.clipboard.writeText(shareLink);
    setIsCopied(true);
  };

  const handleCreateClick = async () => {
    startCreating(async () => {
      try {
        const response = await fetch(endpoint, { method: "POST" });
        if (!response.ok) throw new Error();
        const payload = await response.json();
        const shareId = objectIdSchema.parse(payload);
        setShareId(shareId);
      } catch {
        setIsCreateError(true);
      }
    });
  };

  const handleDeleteClick = async () => {
    startDeleting(async () => {
      try {
        const response = await fetch(endpoint, { method: "DELETE" });
        if (!response.ok) throw new Error();
        setShareId(undefined);
      } catch {
        setIsDeleteError(true);
      }
    });
  };

  const shareLink = shareId
    ? `${window.location.origin}/chats/shared/${shareId}`
    : undefined;

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <TooltipIconButton text="Share chat" onClick={() => setOpen(true)}>
        <Forward />
      </TooltipIconButton>
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
          <AlertDialogCancel className="h-8">
            {isCopied ? "Close" : "Cancel"}
          </AlertDialogCancel>
          {shareLink ? (
            <TextButton
              variant={"default"}
              onClick={handleCopyClick}
              disabled={isCopied}
            >
              {isCopied ? "Link Copied" : "Copy Link"}
            </TextButton>
          ) : (
            <TextButton
              variant={"secondary"}
              onClick={handleCreateClick}
              disabled={isCreating || isCreateError}
            >
              {isCreating ? "Creating..." : "Create Link"}
            </TextButton>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
