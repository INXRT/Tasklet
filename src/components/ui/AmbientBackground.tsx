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
      
      {/* Glow 1 */}
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
        className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-indigo-600/15 blur-[160px] mix-blend-screen"
      />

      {/* Glow 2 */}
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
        className="absolute bottom-[-20%] right-[-10%] w-[70vw] h-[70vw] rounded-full bg-orange-600/10 blur-[180px] mix-blend-screen"
      />
      
      {/* Glass overlay to smooth everything out */}
      <div className="absolute inset-0 bg-[#050505]/60 backdrop-blur-[80px] pointer-events-none" />
    </div>
  );
}
