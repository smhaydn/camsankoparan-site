"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

// Site ilk açıldığında bir kez gösterilen markalı açılış perdesi
export function Intro() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("ck-intro")) return;
    sessionStorage.setItem("ck-intro", "1");
    setShow(true);
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => {
      setShow(false);
      document.body.style.overflow = "";
    }, 2100);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center font-display text-6xl font-extralight text-bronze"
            >
              <span>C</span>
              <motion.span
                initial={{ height: 0 }}
                animate={{ height: 56 }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="mx-2 w-px bg-bronze"
              />
              <span>K</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-4 font-display text-xs font-bold tracking-[0.4em] text-white"
            >
              CAMSAN KOPARAN
            </motion.div>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 h-px w-32 origin-left bg-gradient-to-r from-bronze to-transparent"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
