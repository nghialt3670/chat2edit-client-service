"use client";

import { AlertCircle, Forward, Trash2 } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { usePathname } from "next/navigation";
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
import { Button } from "@/components/ui/button";
import { fetchJSON } from "@/lib/utils";

export default function ShareChat({ chatId }: { chatId: string }) {
  const [shareLink, setShareLink] = useState<string>();
  const [isCopied, setIsCopied] = useState<boolean>();
  const [isCreateError, setIsCreateError] = useState<boolean>();
  const [isDeleteError, setIsDeleteError] = useState<boolean>();
  const [isCreating, startCreating] = useTransition();
  const [isDeleting, startDeleting] = useTransition();
  const pathname = usePathname();

  const endpoint = `/api/chat/${chatId}/share-id`;

  useEffect(() => {
    const updateShareLink = async () => {
      if (!pathname.startsWith("/chat/")) return;
      if (shareLink) return;
      const shareId = await fetchJSON(endpoint);
      if (!shareId) return;
      setShareLink(`${window.location.origin}/share/chat/${shareId}`);
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
      const shareId = await fetchJSON(endpoint, "POST");
      if (!shareId) {
        setIsCreateError(true);
        return;
      }
      setShareLink(`${window.location.origin}/share/chat/${shareId}`);
    });
  };

  const handleDeleteClick = async () => {
    startDeleting(async () => {
      if (await fetchJSON(endpoint, "DELETE")) setShareLink(undefined);
      else setIsDeleteError(true);
    });
  };

  const [open, setOpen] = useState(false);

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
              <Forward />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Share chat</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
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
