"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImageEditor from "./image-editor";

export default function Edit() {
  const [editor, setEditor] = useState<"image-editor" | "tabular-editor">(
    "image-editor",
  );

  const renderEditor = () => {
    switch (editor) {
      case "image-editor":
        return <ImageEditor />;
      case "tabular-editor":
        return <TabularEditor />;
    }
  };

  return (
    <div className="size-full flex flex-col space-y-4">
      {/* {renderEditor()} */}
      <div className="border border-transparent">
        <Select
          onValueChange={(editor) =>
            setEditor(editor as "image-editor" | "tabular-editor")
          }
          defaultValue="image-editor"
        >
          <SelectTrigger className="max-w-40">
            <SelectValue placeholder="Image editor" />
          </SelectTrigger>
          <SelectContent className="max-w-xl">
            <SelectItem value="image-editor">
              <span className="truncate">Image editor</span>
            </SelectItem>
            <SelectItem value="tabular-editor">
              <span className="truncate">Tabular editor</span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
