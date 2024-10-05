import { MutableRefObject } from "react";
import { create } from "zustand";
import { Canvas } from "fabric";

interface CanvasStore {
  canvasRef: MutableRefObject<Canvas | undefined>;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const useCanvas = create<CanvasStore>((set) => ({
  canvasRef: { current: undefined },
  isLoading: false,
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
}));

export default useCanvas;
