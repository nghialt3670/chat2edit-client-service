"use client";

import { ComponentProps, useEffect, useState } from "react";
import Attachment from "@/lib/types/attachment";
import { AspectRatio } from "./ui/aspect-ratio";
import { getDataURL } from "@/lib/localforage";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";

export default function AttachmentPreview({
  className,
  attachment,
  onError,
}: ComponentProps<"div"> & {
  attachment: Attachment;
  onError?: (attachment: Attachment) => void;
}) {
  const { type, name, width, height } = attachment;
  const [dataURL, setDataURL] = useState<string | null>();

  useEffect(() => {
    const updateDataURL = async () => {
      const dataURL = await getDataURL(attachment);
      setDataURL(dataURL);
    };
    if (type.startsWith("image/") || name.endsWith(".canvas")) updateDataURL();
  }, [attachment, name, type]);

  const renderImage = () => {
    switch (dataURL) {
      case undefined:
        return (
          <AspectRatio ratio={width! / height!}>
            <Skeleton className="size-full" />
          </AspectRatio>
        );

      case null:
        if (onError) onError(attachment);
        return (
          <div
            className={cn(
              "w-full h-40 flex justify-center items-center bg-accent object-cover",
            )}
          >
            Error
          </div>
        );

      default:
        return <img className="size-full object-cover" src={dataURL} alt="" />;
    }
  };

  const renderMetadata = () => {
    return <div>Metadata</div>;
  };

  const isImageType = type.startsWith("image/") || name.endsWith(".canvas");

  return (
    <div className={cn("flex rounded-md overflow-hidden", className)}>
      {isImageType ? renderImage() : renderMetadata()}
    </div>
  );
}
