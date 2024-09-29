export type ChatTask = "image-editing" | "sheet-editing";
export type ChatStatus =
  | "idling"
  | "initializing"
  | "uploading"
  | "sending"
  | "responding"
  | "no-response";
