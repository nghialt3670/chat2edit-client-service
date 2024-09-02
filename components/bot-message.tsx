"use client";

import { AlertCircle, BotMessageSquare } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import AttachmentPreview from "./attachment-preview";
import AttachmentOptions from "./attachment-options";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Message from "@/lib/types/message";

export default function BotMessage({
  message,
  onRetry,
}: {
  message: Message | null | undefined;
  onRetry?: () => void;
}) {
  const renderContent = () => {
    if (message)
      return (
        <>
          <ReactMarkdown>{message.text}</ReactMarkdown>
          {message.attachments.length !== 0 && (
            <div className="flex flex-col w-fit mt-4">
              {message.attachments.map((att) => (
                <div key={att.fileId!} className="relative">
                  <AttachmentOptions
                    className="absolute top-0 right-0"
                    attachment={att}
                  />
                  <AttachmentPreview className="w-60" attachment={att} />
                </div>
              ))}
            </div>
          )}
        </>
      );

    if (message === undefined)
      return (
        <div className="w-full space-y-3">
          <Skeleton className="w-full h-4 rounded" />
          <Skeleton className="w-full h-4 rounded" />
          <Skeleton className="w-full h-4 rounded" />
        </div>
      );

    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Something went wrong while processing your request.
        </AlertDescription>
        <div>
          <Button className="p-2" variant="outline" onClick={onRetry}>
            Try Again
          </Button>
        </div>
      </Alert>
    );
  };

  return (
    <div className="flex flex-row">
      <BotMessageSquare className="size-7" />
      <div className="w-full ml-4 mt-0.5">{renderContent()}</div>
    </div>
  );
}
