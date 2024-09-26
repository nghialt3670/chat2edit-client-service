export type ChatTask = "image-editing" | "sheet-editing";
export type ChatStatus =
  | "idling"
  | "initializing"
  | "attachment-uploading"
  | "message-creating"
  | "message-sending"
  | "responding"
  | "error-response";
