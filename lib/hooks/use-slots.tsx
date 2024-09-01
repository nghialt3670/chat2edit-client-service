"use client";

import { ReactNode, useContext } from "react";
import SlotsContext from "../contexts/slots-context";

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
