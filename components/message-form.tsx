"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { Forward, Upload, XSquare } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useFormFile from "@/lib/hooks/use-form-file";
import { addFile, openDB } from "@/lib/indexed-db";
import ImageFile from "./image-file";
import { Button } from "./ui/button";

export default function MessageForm({
  onSubmit,
}: {
  onSubmit: (text: string, files: File[]) => void;
}) {
  const [text, setText] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const { fileIds, setFileIds } = useFormFile();
  const [db, setDb] = useState<IDBDatabase | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    openDB("chat2edit", "fileStore")
      .then((dbInstance) => {
        setDb(dbInstance);
      })
      .catch((error) => {
        console.error("Failed to open DB", error);
      });
  }, []);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(text, files);
    setFiles([]);
    setText("");
    setFileIds([]);
  };

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !db) return;
    const files = Array.from(event.target.files);
    const fileIdPromises = files.map(
      async (file) => await addFile(db, "fileStore", file),
    );
    const fileIds = await Promise.all(fileIdPromises);
    setFiles(files);
    setFileIds(fileIds);
    event.target.value = "";
  };

  return (
    <form className="border rounded-md" onSubmit={handleSubmit}>
      <input
        type="file"
        accept="image/*"
        multiple
        hidden
        ref={fileInputRef}
        onChange={handleChange}
      />
      {files.length > 0 && (
        <ul className="m-2 p-2 flex flex-wrap gap-6 max-h-32 scroll-m-11 justify-between after:flex-auto overflow-y-auto">
          {files.map((file, idx) => (
            <li className="size-fit relative group" key={file.name}>
              <Button
                className="absolute flex justify-center items-center size-7 top-0 -right-0.5 z-10 group-hover:opacity-60 md:opacity-0 hover:bg-transparent opacity-60"
                size={"icon"}
                variant={"ghost"}
                type={"button"}
                onClick={() =>
                  setFiles(files.filter((_, fileIdx) => idx !== fileIdx))
                }
              >
                <XSquare />
              </Button>
              <ImageFile
                className="size-20 rounded-md object-cover"
                file={file}
              />
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-row justify-between">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type={"button"}
                size={"icon"}
                variant={"ghost"}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Upload</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <input
          className="mx-2 bg-transparent outline-none w-[calc(100%-6rem)]"
          type="text"
          spellCheck="false"
          placeholder="Type your message..."
          maxLength={60}
          required
          value={text}
          ref={textInputRef}
          onChange={(e) => setText(e.target.value)}
        />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size={"icon"} variant={"ghost"} type="submit">
                <Forward />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Send Message</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </form>
  );
}
