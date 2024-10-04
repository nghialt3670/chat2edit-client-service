import React, {
  ComponentProps,
  createContext,
  Suspense,
  use,
  useContext,
  useTransition,
} from "react";
import { Download, Edit, Ellipsis, Reply, XSquare } from "lucide-react";
import { CircularProgress } from "@mui/material";
import Image from "next/image";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import attachmentSchema, {
  Attachment as IAttachment,
} from "@/schemas/attachment.schema";
import useAttachments from "@/hooks/use-attachments";
import useEditFile from "@/hooks/use-edit-file";
import IconButton from "../../../components/buttons/icon-button";
import { Skeleton } from "../../../components/ui/skeleton";
import { Button } from "../../../components/ui/button";
import { cn } from "@/lib/utils";

const AttachmentContext = createContext<IAttachment | undefined>(undefined);

function useAttachment() {
  const attachment = useContext(AttachmentContext);

  if (!attachment)
    throw new Error("useAttachment must be used within an AttachmentContext");

  return attachment;
}

export function FileWithThumbnailAttachment() {
  const { id, file } = useAttachment();

  return (
    <Image
      className="size-full object-cover"
      src={`/api/attachments/${id}/file/thumbnail`}
      width={file?.thumbnail?.width}
      height={file?.thumbnail?.height}
      alt=""
    />
  );
}

export function FileWithoutThumbnailAttachment() {
  const { file } = useAttachment();

  return <div>{file?.name}</div>;
}

export function LinkAttachment() {
  const { link } = useAttachment();
  return <div></div>;
}

export function RefAttachment({ className }: ComponentProps<"div">) {
  const { ref } = useAttachment();

  const response = use(fetch(`/api/attachments/${ref}`));
  const payload = response.ok ? use(response.json()) : null;
  const attachment = payload ? attachmentSchema.parse(payload) : null;

  return (
    <>
      {attachment ? (
        <Attachment className={className} attachment={attachment} />
      ) : (
        <div>error</div>
      )}
    </>
  );
}

export default function Attachment({
  children,
  className,
  attachment,
}: ComponentProps<"div"> & {
  attachment: IAttachment;
}) {
  const renderAttachment = () => {
    switch (attachment.type) {
      case "file":
        return attachment.file?.thumbnail ? (
          <FileWithThumbnailAttachment />
        ) : (
          <FileWithoutThumbnailAttachment />
        );

      case "link":
        return <LinkAttachment />;

      case "ref":
        return (
          <Suspense fallback={<Skeleton className="size-full" />}>
            <RefAttachment className={className} />
          </Suspense>
        );
    }
  };

  return (
    <AttachmentContext.Provider value={attachment}>
      <div
        className={cn("relative group rounded-lg overflow-hidden", className)}
      >
        {renderAttachment()}
        {children}
      </div>
    </AttachmentContext.Provider>
  );
}

Attachment.Remove = function AttachmentRemove() {
  const attachment = useAttachment();
  const { removeUploaded } = useAttachments();

  const handleRemoveClick = () => {
    removeUploaded(attachment);
    fetch(`/api/attachments/${attachment.id}`, { method: "DELETE" });
  };

  return (
    <IconButton
      className="absolute flex justify-center items-center size-7 top-0 -right-0.5 z-10 group-hover:opacity-60 md:opacity-0 hover:bg-transparent opacity-60"
      type={"button"}
      onClick={handleRemoveClick}
    >
      <XSquare />
    </IconButton>
  );
};

Attachment.Options = function AttachmentOptions() {
  const { id, file } = useAttachment();
  const { setEditFile } = useEditFile();
  const { uploadeds, insertUploaded } = useAttachments();
  const [isFetchingFile, startFetchingFile] = useTransition();
  const [isDownloading, startDownloading] = useTransition();
  const [isCreatingRef, startCreatingRef] = useTransition();

  const handleEditClick = (e: Event) => {
    e.preventDefault();
    startFetchingFile(async () => {
      try {
        if (!file) return;
        const response = await fetch(`/api/attachments/${id}/file`);
        if (!response.ok) throw new Error();
        const blob = await response.blob();
        setEditFile(new File([blob], file.name, {type: file.contentType}))
      } catch {
        toast("Failed to fetch file");
      }
    });
  }

  const handleDownloadSelect = (e: Event) => {
    e.preventDefault();
    startDownloading(async () => {
      try {
        if (!file) return;
        const response = await fetch(`/api/attachments/${id}/file`);
        if (!response.ok) throw new Error();
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = file.name;
        link.click();
        URL.revokeObjectURL(url);
      } catch {
        toast("Failed to download");
      }
    });
  };

  const handleReplySelect = (e: Event) => {
    e.preventDefault();
    startCreatingRef(async () => {
      try {
        const response = await fetch(`/api/attachments/${id}/refs`, {
          method: "POST",
        });
        if (!response.ok) throw new Error();
        const payload = await response.json();
        const refAttachment = attachmentSchema.parse(payload);
        insertUploaded(refAttachment);
      } catch (error) {
        toast("Failed to reply");
      }
    });
  };

  const disableReply = uploadeds.map((att) => att.ref).includes(id);
  const disableAll = isFetchingFile || isDownloading || isCreatingRef

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="absolute m-1 size-6 top-0 right-0"
          size={"icon"}
          variant={"secondary"}
        >
          <Ellipsis size={15} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit mr-4">
        <DropdownMenuItem
          className="hover:cursor-pointer"
          onSelect={handleEditClick}
          disabled={!file || disableAll}
        >
          {isFetchingFile ? (
            <CircularProgress color="inherit" size={16} className="mr-2" />
          ) : (
            <Edit className="mr-2 size-4" />
          )}
          <span>Edit</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="hover:cursor-pointer"
          onSelect={handleDownloadSelect}
          disabled={disableAll}
        >
          {isDownloading ? (
            <CircularProgress color="inherit" size={16} className="mr-2" />
          ) : (
            <Download className="mr-2 size-4" />
          )}
          <span>Download</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="hover:cursor-pointer"
          onSelect={handleReplySelect}
          disabled={disableReply || disableAll}
        >
          {isCreatingRef ? (
            <CircularProgress color="inherit" size={16} className="mr-2" />
          ) : (
            <Reply className="mr-2 size-4" />
          )}
          <span>Reply</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
