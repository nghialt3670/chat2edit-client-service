export default interface Attachment {
  type: string;
  name: string;
  size: number;
  width?: number;
  height?: number;
  dataURL?: string;
  fileId?: string;
  imageId?: string;
  file?: File;
}
