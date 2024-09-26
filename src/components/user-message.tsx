"use client";

import ReactMarkdown from "react-markdown";
import AttachmentPreview from "./attachment-preview";
import AttachmentOptions from "./attachment-options";
import { Message } from "@/schemas/message.schema";

export default function UserMessage({ message }: { message: Message }) {
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
