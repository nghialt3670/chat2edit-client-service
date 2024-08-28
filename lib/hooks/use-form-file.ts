import { create } from "zustand";

interface FormFileStore {
  fileIds: string[];
  setFileIds: (fileIds: string[]) => void;
  addFileId: (fileId: string) => void;
  removeFileId: (fileId: string) => void;
}

const useFormFile = create<FormFileStore>((set) => ({
  fileIds: [],

  setFileIds: (fileIds) => set({ fileIds }),

  addFileId: (fileId) =>
    set((state) => ({
      fileIds: [...state.fileIds, fileId],
    })),

  removeFileId: (fileId) =>
    set((state) => ({
      fileIds: state.fileIds.filter((id) => id !== fileId),
    })),
}));

export default useFormFile;
