// contexts/MobileNavContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type MobileNavContextType = {
  isMobileNavOpen: boolean;
  setIsMobileNavOpen: (isOpen: boolean) => void;
};

const MobileNavContext = createContext<MobileNavContextType | undefined>(
  undefined,
);

export function MobileNavProvider({ children }: { children: ReactNode }) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <MobileNavContext.Provider value={{ isMobileNavOpen, setIsMobileNavOpen }}>
      {children}
    </MobileNavContext.Provider>
  );
}

export function useMobileNav() {
  const context = useContext(MobileNavContext);
  if (context === undefined) {
    throw new Error("useMobileNav must be used within a MobileNavProvider");
  }
  return context;
}
