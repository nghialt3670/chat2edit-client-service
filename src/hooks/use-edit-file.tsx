import { create } from "zustand";
import { UploadedFile } from "@/schemas/attachment.schema";

interface EditFileStore {
  editFile: UploadedFile | undefined;
  setEditFile: (editFile: UploadedFile) => void;
}

const useEditFile = create<EditFileStore>((set) => ({
  editFile: undefined,
  setEditFile: (editFile) => set({ editFile }),
}));

export default useEditFile;
