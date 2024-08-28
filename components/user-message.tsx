"use client";

import ReactMarkdown from "react-markdown";
import Message from "@/lib/types/Message";
import ImageFile from "./image-file";

export default function UserMessage({ message }: { message: Message }) {
  console.log(message.files);
  return (
    <div className="flex flex-col space-y-2">
      <ReactMarkdown className="w-fit ml-auto rounded-md py-2 px-3 bg-accent">
        {message.text}
      </ReactMarkdown>
      <div className="ml-auto">
        {message.files.map((file) => (
          <ImageFile key={file.name} className="w-60 rounded-md" file={file} />
        ))}
      </div>
    </div>
  );
}
