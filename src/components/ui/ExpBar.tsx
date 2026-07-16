"use client";

import { motion } from "framer-motion";
import { getPokemonLevel, Evolution } from "@/lib/pokemon-data";

interface ExpBarProps {
  xp: number;
  evolution?: Evolution;
}

export function ExpBar({ xp, evolution }: ExpBarProps) {
  const currentLevel = getPokemonLevel(xp);
  const xpForCurrentLevel = (currentLevel - 1) * 100;
  
  const xpInLevel = xp - xpForCurrentLevel;
  const percentage = (xpInLevel / 100) * 100;

  return (
    <div className="w-full flex flex-col gap-1.5">
      <div className="flex justify-between items-center text-[10px] font-mono tracking-widest uppercase text-white/70">
        <div className="flex gap-3">
          <span>Level {currentLevel}</span>
          {evolution && (
            <span className="text-emerald-400/80">Evolves at Lv.{evolution.level}</span>
          )}
        </div>
        <span>{xpInLevel} / 100 XP</span>
      </div>
      
      <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden shadow-inner border border-white/5 relative">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.5 }}
          className="h-full bg-gradient-to-r from-emerald-400 to-emerald-300 rounded-full relative shadow-[0_0_10px_rgba(52,211,153,0.5)]"
        >
          <div className="absolute inset-0 bg-white/20 w-full h-1/2 rounded-t-full" />
        </motion.div>
      </div>
    </div>
  );
}
