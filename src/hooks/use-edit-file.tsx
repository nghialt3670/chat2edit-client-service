import { create } from "zustand";

interface EditFileStore {
  editFile: File | undefined;
  setEditFile: (editFile: File) => void;
}

const useEditFile = create<EditFileStore>((set) => ({
  editFile: undefined,
  setEditFile: (editFile) => set({ editFile }),
}));

export default useEditFile;
