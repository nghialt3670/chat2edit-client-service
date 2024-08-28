interface DataURLStore {
  idToDataURL: Record<string, string>;
  addDataURL: (id: string, dataURL: string) => void;
  removeDataURL: (id: string) => void;
}
