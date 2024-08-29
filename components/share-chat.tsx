"use client";

import { useEffect, useState, useTransition } from "react";

import { AlertCircle, Forward, Trash2 } from "lucide-react";

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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function ShareChat({ chatId }: { chatId: string }) {
  const [shareLink, setShareLink] = useState<string>();
  const [isCopied, setIsCopied] = useState<boolean>();
  const [isCreateError, setIsCreateError] = useState<boolean>();
  const [isDeleteError, setIsDeleteError] = useState<boolean>();
  const [isCreating, startCreating] = useTransition();
  const [isDeleting, startDeleting] = useTransition();

  useEffect(() => {
    const updateShareLink = async () => {
      if (shareLink) return;
      try {
        const response = await fetch(`/api/chat/${chatId}/shareId`);
        if (!response.ok) return;
        const shareId = await response.json();
        if (!shareId) return;
        setShareLink(`${window.location.origin}/share/chat/${shareId}`);
      } catch (error) {
        console.error(error instanceof Error ? error.message : error);
      }
    };
    updateShareLink();
  }, [chatId]);

  const handleCopyClick = async () => {
    if (!shareLink) return;
    await navigator.clipboard.writeText(shareLink);
    setIsCopied(true);
  };

  const handleCreateClick = async () => {
    startCreating(async () => {
      try {
        const response = await fetch(`/api/chat/${chatId}/shareId`, {
          method: "POST",
        });
        if (!response.ok) throw new Error("Error while creating share ID");
        const { shareId } = await response.json();
        setShareLink(`${window.location.origin}/share/chat/${shareId}`);
      } catch (error) {
        console.error(error instanceof Error ? error.message : error);
        setIsCreateError(true);
      }
    });
  };

  const handleDeleteClick = async () => {
    startDeleting(async () => {
      try {
        const response = await fetch(`/api/chat/${chatId}/shareId`, {
          method: "POST",
        });
        if (!response.ok) throw new Error("Error while deleting share ID");
        setShareLink(undefined);
      } catch (error) {
        console.error(error instanceof Error ? error.message : error);
        setIsDeleteError(true);
      }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size={"icon"} variant={"ghost"}>
          <Forward />
        </Button>
      </AlertDialogTrigger>
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
