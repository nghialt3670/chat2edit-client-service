import { createContext, ReactNode } from "react";

const SlotsContext = createContext<ReactNode[] | undefined>(undefined);

export default SlotsContext;
