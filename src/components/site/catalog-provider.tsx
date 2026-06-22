"use client";

import { createContext, useContext, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "motion/react";
import type { Dict } from "@/lib/dict";

// Katalog modalı yalnızca ihtiyaç anında (butona basınca) yüklenir → sayfa açılışı yavaşlamaz
const CatalogModal = dynamic(
  () => import("./catalog-modal").then((m) => m.CatalogModal),
  { ssr: false },
);

const CatalogContext = createContext<{ open: () => void }>({ open: () => {} });
export const useCatalog = () => useContext(CatalogContext);

export function CatalogProvider({
  dict,
  children,
}: {
  dict: Dict["catalog"];
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <CatalogContext.Provider value={{ open: () => setIsOpen(true) }}>
      {children}
      <AnimatePresence>
        {isOpen && <CatalogModal dict={dict} onClose={() => setIsOpen(false)} />}
      </AnimatePresence>
    </CatalogContext.Provider>
  );
}
