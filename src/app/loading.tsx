"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function Loading() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const content = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="flex flex-col items-center gap-6">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="relative w-16 h-16 rounded-full border-[5px] border-zinc-900 bg-white overflow-hidden shadow-[0_0_30px_rgba(255,255,255,0.1)]"
        >
          {/* Top red half */}
          <div className="absolute top-0 w-full h-[50%] bg-red-500 border-b-[5px] border-zinc-900" />
          {/* Center button */}
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
    </div>
  );

  if (!mounted) return null;

  return createPortal(content, document.body);
}
