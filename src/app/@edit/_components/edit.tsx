"use client";

import { useState } from "react";
import SheetEditor from "./sheet-editor/sheet-editor";
import EditorSelect from "../editor-select";
import ImageEditor from "./image-editor";

export default function Edit() {
  const [editor, setEditor] = useState<"image-editor" | "sheet-editor">(
    "image-editor",
  );

  const renderEditor = () => {
    switch (editor) {
      case "image-editor":
        return <ImageEditor />;
      case "sheet-editor":
        return <SheetEditor />;
    }
  };

  return (
    <div className="size-full flex flex-col space-y-4">
      {renderEditor()}
      <EditorSelect onSelect={setEditor} />
    </div>
  );
}
