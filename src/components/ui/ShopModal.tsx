"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Store, Coins } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { purchaseItem } from "@/actions/shop";
import { createPortal } from "react-dom";
import { ScaleWrapper } from "@/components/ui/ScaleWrapper";

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userCoins: number;
}

export function ShopModal({ isOpen, onClose, userId, userCoins }: ShopModalProps) {
  const [items, setItems] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Fetch shop items when opened
      fetch("/api/shop").then(r => r.json()).then(data => setItems(data));
    }
  }, [isOpen]);

  const handlePurchase = (itemId: string, price: number) => {
    if (userCoins < price) {
      alert("Not enough coins!");
      return;
    }

    startTransition(async () => {
      try {
        const res = await purchaseItem(userId, itemId);
        if ('gachaResult' in res && res.gachaResult) {
          alert(res.gachaResult.message);
        } else if ('message' in res) {
          alert(res.message);
        }
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
              <div className="p-3 rounded-full bg-emerald-500/20 text-emerald-400">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-3xl font-serif text-white tracking-tight drop-shadow-sm">Poké Mart</h2>
                <p className="text-zinc-400 text-sm">Spend your hard-earned task coins here.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.length === 0 ? (
                <div className="col-span-2 text-center py-8 text-zinc-500">Loading items...</div>
              ) : (
                items.map(item => (
                  <div key={item.id} className="flex flex-col p-4 rounded-2xl bg-black/40 border border-white/10 shadow-inner">
                    <div className="flex gap-4">
                      {item.imageUrl && (
                        <div className="w-16 h-16 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                          <img src={item.imageUrl} alt={item.name} className="w-12 h-12 object-contain filter drop-shadow-md" style={{ imageRendering: "pixelated" }} />
                        </div>
                      )}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-white font-medium drop-shadow-sm">{item.name}</h4>
                          <p className="text-xs text-zinc-400 leading-tight mt-1">{item.description}</p>
                        </div>
                        <div className="flex justify-between items-end mt-4">
                          <div className="flex items-center gap-1.5 text-amber-400">
                            <Coins className="w-4 h-4" />
                            <span className="font-mono text-sm">{item.price}</span>
                          </div>
                          <button 
                            onClick={() => handlePurchase(item.id, item.price)}
                            disabled={isPending || userCoins < item.price}
                            className={`px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider transition-all ${
                              userCoins >= item.price
                                ? "skeumorphic-btn text-black hover:brightness-110 active:scale-95"
                                : "bg-white/5 text-zinc-500 cursor-not-allowed"
                            }`}
                            style={userCoins >= item.price ? { background: 'linear-gradient(180deg, #ffffff 0%, #e0e0e0 100%)' } : {}}
                          >
                            {isPending ? "..." : "Buy"}
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
