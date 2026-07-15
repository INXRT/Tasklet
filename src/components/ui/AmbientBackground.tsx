"use client";

import { motion } from "framer-motion";

export function AmbientBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#050505]">
      {/* Background noise texture for matte finish */}
      <div 
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none z-10" 
        style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}
      />
      
      {/* Tech Grid */}
      <div 
        className="absolute inset-0 opacity-[0.15] pointer-events-none"
        style={{ 
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '100px 100px'
        }}
      />
      
      {/* Glow 1 — uses a pre-blurred radial gradient instead of animating blur */}
      <motion.div
        animate={{
          x: [0, 150, 0, -150, 0],
          y: [0, -100, 150, 100, 0],
          scale: [1, 1.3, 1, 0.8, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full mix-blend-screen pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.12) 0%, transparent 70%)' }}
      />

      {/* Glow 2 — uses a pre-blurred radial gradient instead of animating blur */}
      <motion.div
        animate={{
          x: [0, -150, 100, 150, 0],
          y: [0, 150, -100, -150, 0],
          scale: [1, 0.7, 1.2, 1, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-[-20%] right-[-10%] w-[70vw] h-[70vw] rounded-full mix-blend-screen pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(234,88,12,0.08) 0%, transparent 70%)' }}
      />
      
      {/* Matte overlay — solid dark tint, no blur needed */}
      <div className="absolute inset-0 bg-[#050505]/50 pointer-events-none" />
    </div>
  );
}
