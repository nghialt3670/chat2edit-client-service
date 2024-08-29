"use client";

import ReactMarkdown from "react-markdown";
import { nanoid } from "nanoid";
import Message from "@/lib/types/message";
import ImageFile from "./image-file";

export default function UserMessage({
  message,
  isError,
}: {
  message: Message;
  isError?: boolean;
}) {
  return (
    <div className="flex flex-col space-y-2">
      <ReactMarkdown className="w-fit ml-auto rounded-md py-2 px-3 bg-accent">
        {message.text}
      </ReactMarkdown>
      <div className="ml-auto">
        {message.files.map((file) =>
          file ? (
            <ImageFile
              key={file.name + file.size}
              className="w-60 rounded-md"
              file={file}
            />
          ) : (
            <div key={nanoid()}>Error</div>
          ),
        )}
      </div>
    </div>
  );
}
