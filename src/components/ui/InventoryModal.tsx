"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useTransition } from "react";
import { consumeItem } from "@/actions/shop";
import { createPortal } from "react-dom";
import { ScaleWrapper } from "@/components/ui/ScaleWrapper";
import { X, Backpack } from "lucide-react";

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  inventory: any[];
}

export function InventoryModal({ isOpen, onClose, userId, inventory }: InventoryModalProps) {
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleConsume = (userItemId: string) => {
    startTransition(async () => {
      try {
        const res = await consumeItem(userId, userItemId);
        if (res.message) alert(res.message);
      } catch (err: any) {
        alert(err.message);
      }
    });
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100]">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <ScaleWrapper targetWidth={1280} targetHeight={800} padding={24}>
              <div className="w-full h-full flex items-center justify-center pointer-events-none">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.5 }}
                  className="relative w-full max-w-2xl glass-panel rounded-[2rem] p-8 shadow-2xl overflow-hidden pointer-events-auto"
                  onClick={e => e.stopPropagation()}
                >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-full bg-amber-500/20 text-amber-400">
                <Backpack className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-3xl font-serif text-white tracking-tight drop-shadow-sm">Backpack</h2>
                <p className="text-zinc-400 text-sm">Items you have purchased from the Poké Mart.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2">
              {inventory.length === 0 ? (
                <div className="col-span-2 text-center py-12 text-zinc-500">Your backpack is empty.</div>
              ) : (
                inventory.map(userItem => (
                  <div key={userItem.id} className="flex flex-col p-4 rounded-2xl bg-black/40 border border-white/10 shadow-inner">
                    <div className="flex gap-4">
                      {userItem.shopItem.imageUrl && (
                        <div className="w-16 h-16 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 relative">
                          <img src={userItem.shopItem.imageUrl} alt={userItem.shopItem.name} className="w-12 h-12 object-contain filter drop-shadow-md" style={{ imageRendering: "pixelated" }} />
                          <div className="absolute -bottom-2 -right-2 bg-indigo-500 text-white text-[10px] font-mono px-2 py-0.5 rounded-full border border-indigo-400">
                            x{userItem.quantity}
                          </div>
                        </div>
                      )}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-white font-medium drop-shadow-sm">{userItem.shopItem.name}</h4>
                          <p className="text-[10px] text-zinc-400 leading-tight mt-1">{userItem.shopItem.description}</p>
                        </div>
                        <div className="flex justify-end mt-4">
                          <button 
                            onClick={() => handleConsume(userItem.id)}
                            disabled={isPending}
                            className="skeumorphic-btn px-4 py-1.5 rounded-full text-xs font-medium text-black active:scale-95 transition-all bg-gradient-to-b from-white to-gray-300"
                          >
                            {isPending ? "..." : "Use"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

                </motion.div>
              </div>
            </ScaleWrapper>
          </div>
        </div>
      )}
    </AnimatePresence>
  );

  return mounted ? createPortal(modalContent, document.body) : null;
}
