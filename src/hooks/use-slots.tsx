"use client";

import { createContext, ReactNode, useContext } from "react";

const SlotsContext = createContext<ReactNode[] | undefined>(undefined);

export function SlotsProvider({
  slots,
  children,
}: {
  slots: ReactNode[];
  children: ReactNode;
}) {
  return (
    <SlotsContext.Provider value={slots}>{children}</SlotsContext.Provider>
  );
}

export default function useSlots() {
  const context = useContext(SlotsContext);

  if (context === undefined)
    throw new Error("useSlots must be used within a SlotsProvider");

  return context;
}
