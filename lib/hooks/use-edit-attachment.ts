import { create } from "zustand";
import Attachment from "../types/attachment";

interface EditAttachmentStore {
  editAttachment: Attachment | undefined;
  setEditAttachment: (editAttachment: Attachment) => void;
}

const useEditAttachment = create<EditAttachmentStore>((set) => ({
  editAttachment: undefined,
  setEditAttachment: (editAttachment) => set({ editAttachment }),
}));

export default useEditAttachment;
