import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { consumeItem } from "@/actions/shop";
import { playPopSound } from "@/lib/audio";

export function QuickFeed({ inventory, userId, onFeed }: { inventory: any[], userId: string, onFeed?: (itemId: string, xpAmount: number) => void }) {
  const [floatingText, setFloatingText] = useState<{ id: number, text: string } | null>(null);

  const foodItems = inventory.filter(item => item.shopItem.type === "food" && item.quantity > 0);

  const handleFeed = async (userItemId: string, name: string) => {
    playPopSound();
    
    const id = Date.now();
    setFloatingText({ id, text: `+ XP (${name})` });
    
    // Auto-clear floating text rapidly
    setTimeout(() => {
      setFloatingText(prev => prev?.id === id ? null : prev);
    }, 800);

    let xpAmount = 10;
    if (name === "Rare Candy") xpAmount = 500;
    else if (name === "Oran Berry") xpAmount = 50;

    if (onFeed) {
      onFeed(userItemId, xpAmount);
    }

    try {
      await consumeItem(userId, userItemId);
    } catch (e) {
      console.error("Failed to feed", e);
    }
  };

  if (foodItems.length === 0) return null;

  return (
    <div className="absolute top-1/2 -translate-y-1/2 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence mode="wait">
        {floatingText && (
          <motion.div
            key={floatingText.id}
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: -20, scale: 1.1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm font-mono font-bold text-emerald-400 drop-shadow-lg"
          >
            {floatingText.text}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex flex-col gap-3 p-2 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl">
        {foodItems.map(item => (
          <button
            key={item.id}
            onClick={() => handleFeed(item.id, item.shopItem.name)}
            className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-transform duration-75 hover:scale-110 active:scale-90 group"
            title={`Feed ${item.shopItem.name}`}
          >
            {item.shopItem.imageUrl && (
              <img src={item.shopItem.imageUrl} alt={item.shopItem.name} className="w-8 h-8 object-contain drop-shadow-sm group-hover:drop-shadow-lg group-active:scale-90 transition-all" />
            )}
            <span className="absolute -top-2 -right-2 bg-indigo-500 text-white text-[10px] font-mono font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-zinc-900 shadow-md">
              {item.quantity}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
