"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

type GlobalLoaderContextType = {
  showLoader: () => void;
  hideLoader: () => void;
};

const GlobalLoaderContext = createContext<GlobalLoaderContextType | undefined>(undefined);

export function GlobalLoaderProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <GlobalLoaderContext.Provider value={{ showLoader: () => setIsLoading(true), hideLoader: () => setIsLoading(false) }}>
      {children}
      
      {typeof window !== "undefined" && createPortal(
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md"
            >
              <div className="flex flex-col items-center gap-6">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="relative w-16 h-16 rounded-full border-[5px] border-zinc-900 bg-white overflow-hidden shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                >
                  <div className="absolute top-0 w-full h-[50%] bg-red-500 border-b-[5px] border-zinc-900" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full border-[5px] border-zinc-900 z-10 shadow-sm" />
                </motion.div>
                
                <motion.p 
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  className="font-mono text-sm tracking-[0.2em] text-zinc-300 uppercase"
                >
                  Catching Data...
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </GlobalLoaderContext.Provider>
  );
}

export function useGlobalLoader() {
  const context = useContext(GlobalLoaderContext);
  if (context === undefined) {
    throw new Error("useGlobalLoader must be used within a GlobalLoaderProvider");
  }
  return context;
}
