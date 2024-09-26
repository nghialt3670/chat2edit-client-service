import { create } from "zustand";
import { Attachment } from "@/schemas/attachment.schema";

interface AttachmentsStore {
  uploadeds: Attachment[];
  uploadings: Attachment[];

  setUploadeds: (uploadeds: Attachment[]) => void;
  setUploadings: (uploadings: Attachment[]) => void;

  insertUploaded: (uploaded: Attachment) => void;
  insertUploading: (uploading: Attachment) => void;

  removeUploaded: (uploaded: Attachment) => void;
  removeUploading: (uploading: Attachment) => void;
}

const useAttachments = create<AttachmentsStore>((set) => ({
  uploadeds: [],
  uploadings: [],

  setUploadeds: (uploadeds: Attachment[]) => set({ uploadeds }),
  setUploadings: (uploadings: Attachment[]) => set({ uploadings }),

  insertUploaded: (uploaded: Attachment) =>
    set((state) => ({
      uploadeds: [...state.uploadeds, uploaded],
    })),

  insertUploading: (uploading: Attachment) =>
    set((state) => ({
      uploadings: [...state.uploadings, uploading],
    })),

  removeUploaded: (uploaded: Attachment) =>
    set((state) => ({
      uploadeds: state.uploadeds.filter((item) => item.id !== uploaded.id),
    })),

  removeUploading: (uploading: Attachment) =>
    set((state) => ({
      uploadings: state.uploadings.filter((item) => item.id !== uploading.id),
    })),
}));

export default useAttachments;
