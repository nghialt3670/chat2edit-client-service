import { create } from "zustand";
import Attachment from "../types/attachment";

interface AttachmentStore {
  attachments: Attachment[];
  setAttachments: (attachments: Attachment[]) => void;
  addAttachment: (attachment: Attachment) => void;
  removeAttachment: (attachment: Attachment) => void;
}

const useAttachment = create<AttachmentStore>((set) => ({
  attachments: [],
  setAttachments: (attachments) => set({ attachments }),
  addAttachment: (attachment) =>
    set((state) => ({
      attachments: [...state.attachments, attachment],
    })),
  removeAttachment: (attachmentToRemove) =>
    set((state) => ({
      attachments: state.attachments.filter(
        (attachment) => attachment.fileId !== attachmentToRemove.fileId,
      ),
    })),
}));

export default useAttachment;
