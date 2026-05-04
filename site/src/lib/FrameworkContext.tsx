import { createContext, useContext, useState, type ReactNode } from "react";

export type Fw = "react" | "vanilla";

const Ctx = createContext<{ fw: Fw; setFw: (f: Fw) => void }>({
  fw: "react",
  setFw: () => {},
});

export function FrameworkProvider({ children }: { children: ReactNode }) {
  const [fw, setFw] = useState<Fw>("react");
  return <Ctx.Provider value={{ fw, setFw }}>{children}</Ctx.Provider>;
}

export const useFramework = () => useContext(Ctx);
