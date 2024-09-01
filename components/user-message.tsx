"use client";

import ReactMarkdown from "react-markdown";
import { nanoid } from "nanoid";
import Image from "next/image";
import AttachmentPreview from "./attachment-preview";
import AttachmentOptions from "./attachment-options";
import Message from "@/lib/types/message";
import ImageFile from "./image-file";

export default function UserMessage({
  message,
  isError,
}: {
  message: Message;
  isError?: boolean;
}) {
  const renderImages = () => {
    if (message.attachments)
      return message.attachments.map((att) => (
        <div key={att.name + att.size} className="relative">
          <AttachmentOptions
            className="absolute top-0 right-0"
            attachment={att}
          />
          <AttachmentPreview className="w-60" attachment={att} />
        </div>
      ));
  };

  return (
    <div className="flex flex-col space-y-2">
      <ReactMarkdown className="w-fit ml-auto rounded-md py-2 px-3 bg-accent">
        {message.text}
      </ReactMarkdown>
      <div className="ml-auto">{renderImages()}</div>
    </div>
  );
}
