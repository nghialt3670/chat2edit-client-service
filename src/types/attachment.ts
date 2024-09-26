export interface FileThumbnail {
  width: number;
  height: number;
}

export interface UploadedFile {
  name: string;
  size: number;
  contentType: string;
  thumbnail?: FileThumbnail;
}

export interface Attachment {
  id: string;
  type: "file" | "link" | "ref";
  file?: UploadedFile;
  link?: string;
  ref?: string;
}
