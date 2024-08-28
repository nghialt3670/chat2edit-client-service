"use client";

import { ComponentProps, useEffect, useState } from "react";
import { createCanvasFromFile } from "@/lib/fabric";
import { readFileAsDataURL } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";

export default function ImageFile({
  className,
  file,
}: ComponentProps<"div"> & { file: File }) {
  const [dataURL, setDataURL] = useState<string | undefined | null>(undefined);

  useEffect(() => {
    const readAndSetDataURL = async () => {
      if (file.type.startsWith("image/")) {
        const dataURL = await readFileAsDataURL(file);
        setDataURL(dataURL?.toString());
      } else if (file.name.endsWith(".canvas")) {
        const canvas = await createCanvasFromFile(file);
        if (!canvas) setDataURL(null);
        else {
          const dataURL = canvas.toDataURL();
          setDataURL(dataURL);
        }
      }
    };
    readAndSetDataURL();
  }, [file]);

  return (
    <>
      {dataURL ? (
        <img className={className} src={dataURL} />
      ) : dataURL === undefined ? (
        <Skeleton className={className} />
      ) : (
        <div className={className}>ERROR</div>
      )}
    </>
  );
}
