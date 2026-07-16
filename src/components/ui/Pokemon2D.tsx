"use client";

import { motion, Variants } from "framer-motion";
import { getSpriteUrl } from "@/lib/pokemon-data";

interface Pokemon2DProps {
  speciesId: string;
  mood?: string;
  level?: number;
  className?: string;
}

export function Pokemon2D({ speciesId, mood = "happy", level = 1, className = "" }: Pokemon2DProps) {
  const spriteUrl = getSpriteUrl(speciesId);

  // Different animation variants based on mood
  const variants: Variants = {
    happy: {
      y: [0, -10, 0],
      transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
    },
    idle: {
      y: [0, -4, 0],
      transition: { repeat: Infinity, duration: 3, ease: "easeInOut" }
    },
    sad: {
      y: [0, 2, 0],
      opacity: [1, 0.8, 1],
      transition: { repeat: Infinity, duration: 4, ease: "easeInOut" }
    },
    sick: {
      x: [-2, 2, -2],
      filter: ["hue-rotate(0deg)", "hue-rotate(90deg)", "hue-rotate(0deg)"],
      transition: { repeat: Infinity, duration: 0.5, ease: "linear" }
    }
  };

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Mood specific effects (shadows/auras) */}
      {mood === "happy" && (
        <div className="absolute inset-0 bg-amber-400/20 blur-2xl rounded-full mix-blend-screen -z-10 animate-pulse" />
      )}
      {mood === "sick" && (
        <div className="absolute inset-0 bg-green-500/10 blur-xl rounded-full mix-blend-normal -z-10" />
      )}
      
      <motion.img
        src={spriteUrl}
        alt={speciesId}
        className="w-48 h-48 object-contain filter drop-shadow-2xl"
        variants={variants}
        animate={mood as any}
        style={{ imageRendering: "pixelated" }}
      />
    </div>
  );
}
