import { ComponentProps, useEffect, useState } from "react";
import localforage from "localforage";
import Image from "next/image";
import getFileFromAttachment, {
  canvasFileToDataURL,
  cn,
  fetchFile,
} from "@/lib/utils";
import { createCanvasFromFile } from "@/lib/fabric";
import Attachment from "@/lib/types/attachment";
import { AspectRatio } from "./ui/aspect-ratio";
import { Skeleton } from "./ui/skeleton";

export default function AttachmentPreview({
  className,
  attachment,
  onError,
}: ComponentProps<"div"> & {
  attachment: Attachment;
  onError?: (attachment: Attachment) => void;
}) {
  const [canvasDataURL, setCanvasDataURL] = useState<string | null>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { fileId, type, name, width, height, dataURL, imageId } = attachment;

  useEffect(() => {
    const updateCanvasDataURL = async () => {
      const file = await getFileFromAttachment(attachment);
      if (!file) {
        setCanvasDataURL(null);
        return;
      }
      const canvasDataURL = await canvasFileToDataURL(file);
      if (!canvasDataURL) {
        setCanvasDataURL(null);
        return;
      }
      setCanvasDataURL(canvasDataURL);
      setIsLoading(false);
    };
    if (name.endsWith(".canvas") && canvasDataURL === undefined)
      updateCanvasDataURL();
  }, [attachment]);

  const renderImage = () => {
    const imgSrc = dataURL || canvasDataURL;
    if (imgSrc)
      return <img className="size-full object-cover" src={imgSrc} alt="" />;
    let imageURL;
    if (type.startsWith("image/") && fileId && width && height)
      imageURL = `/api/file/${fileId}`;
    if (imageId) imageURL = `/api/file/${imageId}`;
    if (imageURL)
      return (
        <Image
          className={cn("size-full bg-accent", isLoading && "w-0")}
          src={imageURL}
          alt={name}
          width={width}
          height={height}
          onLoad={() => setIsLoading(false)}
        />
      );

    if (name.endsWith(".canvas") && canvasDataURL === undefined) {
      return undefined;
    }

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
  };

  const renderMetadata = () => {
    return <div>Metadata</div>;
  };

  return (
    <div className={cn("flex rounded-md overflow-hidden", className)}>
      {type.startsWith("image/") || name.endsWith(".canvas") ? (
        <>
          {isLoading && (
            <AspectRatio ratio={width! / height!}>
              <Skeleton className="size-full" />
            </AspectRatio>
          )}
          {renderImage()}
        </>
      ) : (
        renderMetadata()
      )}
    </div>
  );
}
