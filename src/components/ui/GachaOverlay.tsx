"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Pokemon2D } from "./Pokemon2D";
import { createPortal } from "react-dom";

interface GachaResult {
  pokemonId: string;
  isShiny: boolean;
  isDuplicate: boolean;
  message: string;
  rarity: "COMMON" | "RARE" | "LEGENDARY";
}

interface GachaOverlayProps {
  result: GachaResult | null;
  onClose: () => void;
}

export function GachaOverlay({ result, onClose }: GachaOverlayProps) {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<"hidden" | "shaking" | "burst" | "reveal" | "dismantle">("hidden");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (result) {
      setPhase("shaking");
      
      // Sequence timing
      setTimeout(() => setPhase("burst"), 2000); // 2s shaking
      
      setTimeout(() => {
        if (result.isDuplicate) {
          setPhase("dismantle");
        } else {
          setPhase("reveal");
        }
      }, 2500); // 500ms burst
    } else {
      setPhase("hidden");
    }
  }, [result]);

  if (!result || !mounted) return null;

  // Determine glow color by rarity
  const glowColor = 
    result.rarity === "LEGENDARY" ? "bg-amber-400" :
    result.rarity === "RARE" ? "bg-purple-500" :
    "bg-emerald-400";

  const overlayContent = (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md"
        onClick={() => phase === "reveal" || phase === "dismantle" ? onClose() : null}
      >
        
        {/* Phase: Shaking Pokeball */}
        {phase === "shaking" && (
          <motion.div
            animate={{ 
              rotate: [0, -15, 15, -15, 15, 0], 
              scale: [1, 1.1, 1] 
            }}
            transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
            className="w-32 h-32 bg-[url('/items/pokeball.png')] bg-contain bg-center bg-no-repeat filter drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]"
          />
        )}

        {/* Phase: Burst Flash */}
        {phase === "burst" && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: [1, 5, 20], opacity: [1, 1, 0] }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-32 h-32 bg-white rounded-full mix-blend-screen"
          />
        )}

        {/* Phase: Reveal (New) */}
        {phase === "reveal" && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 12, stiffness: 100 }}
            className="flex flex-col items-center pointer-events-none"
          >
            <div className={`absolute inset-0 ${glowColor}/20 blur-[100px] rounded-full w-96 h-96 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 animate-pulse`} />
            
            <div className="relative mb-8">
               {result.rarity === "LEGENDARY" && (
                 <div className="absolute inset-0 animate-spin-slow bg-[url('https://assets.codepen.io/13471/sparkles.gif')] opacity-50 mix-blend-screen" />
               )}
               <Pokemon2D speciesId={result.pokemonId} mood="happy" className="scale-[2]" />
            </div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-5xl font-serif text-white capitalize drop-shadow-lg mb-2 mt-12"
            >
              {result.pokemonId}
            </motion.h2>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className={`px-4 py-1 rounded-full border text-xs font-mono tracking-widest uppercase mb-8
                ${result.rarity === "LEGENDARY" ? "border-amber-400 text-amber-400 bg-amber-400/10 shadow-[0_0_15px_rgba(251,191,36,0.3)]" : 
                  result.rarity === "RARE" ? "border-purple-400 text-purple-400 bg-purple-400/10 shadow-[0_0_15px_rgba(192,132,252,0.3)]" : 
                  "border-zinc-400 text-zinc-300 bg-white/5"}
              `}
            >
              {result.rarity}
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-zinc-400 text-sm animate-pulse"
            >
              Click anywhere to continue
            </motion.p>
          </motion.div>
        )}

        {/* Phase: Dismantle (Duplicate) */}
        {phase === "dismantle" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center text-center max-w-md pointer-events-none"
          >
            <motion.div
              animate={{ filter: ["brightness(0)", "brightness(2)", "brightness(1)"], opacity: [1, 0] }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="mb-8"
            >
              <Pokemon2D speciesId={result.pokemonId} mood="sad" className="scale-[1.5]" />
            </motion.div>

            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.2, type: "spring", bounce: 0.6 }}
              className="absolute flex flex-col items-center"
            >
              {/* Oran Berry Icon */}
              <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center border-2 border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.5)] mb-6">
                 <span className="text-4xl">🫐</span>
              </div>
              <h2 className="text-3xl font-serif text-white mb-2">Duplicate Dismantled!</h2>
              <p className="text-zinc-400 text-lg mb-8">You already owned {result.pokemonId}. It was converted into an Oran Berry.</p>
              
              <p className="text-zinc-500 text-sm animate-pulse">Click anywhere to continue</p>
            </motion.div>
          </motion.div>
        )}

      </motion.div>
    </AnimatePresence>
  );

  return createPortal(overlayContent, document.body);
}
