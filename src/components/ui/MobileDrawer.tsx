"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  direction?: "left" | "right";
  children: React.ReactNode;
  title?: string;
}

export function MobileDrawer({ isOpen, onClose, direction = "left", children, title }: MobileDrawerProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent scrolling on body when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const xOffset = direction === "left" ? "-100%" : "100%";

  const drawerContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden"
            onClick={onClose}
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: xOffset }}
            animate={{ x: 0 }}
            exit={{ x: xOffset }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed top-0 bottom-0 ${direction === "left" ? "left-0" : "right-0"} w-[85vw] max-w-[400px] z-[101] glass-panel bg-black/90 flex flex-col shadow-2xl lg:hidden border-white/10`}
            style={{ 
              borderLeft: direction === "right" ? '1px solid rgba(255,255,255,0.1)' : 'none',
              borderRight: direction === "left" ? '1px solid rgba(255,255,255,0.1)' : 'none',
              borderTop: 'none',
              borderBottom: 'none',
              borderRadius: 0
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 shrink-0 bg-white/5">
              <h2 className="text-xl font-serif text-white">{title || "Menu"}</h2>
              <button 
                onClick={onClose}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 flex flex-col gap-6">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  if (!mounted || typeof document === "undefined") return null;
  return createPortal(drawerContent, document.body);
}


