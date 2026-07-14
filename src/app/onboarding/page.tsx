"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Sparkles, Flame, Wind, Feather, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { selectCompanion } from "@/actions/user";
import { Companion3D } from "@/components/ui/Companion3D";

const COMPANIONS = [
  {
    id: "DRAGON",
    name: "Dragon",
    icon: Flame,
    tag: "SYS: AGGRESSIVE",
    description: "Evolves with fiery intensity. Perfect for those who thrive under pressure.",
    glow: "from-orange-500/20 to-transparent",
    border: "border-orange-500/20",
  },
  {
    id: "GRIFFIN",
    name: "Griffin",
    icon: Wind,
    tag: "SYS: STEADY",
    description: "Evolves with majestic pride. Ideal for steady, consistent high-achievers.",
    glow: "from-blue-500/20 to-transparent",
    border: "border-blue-500/20",
  },
  {
    id: "PHOENIX",
    name: "Phoenix",
    icon: Feather,
    tag: "SYS: RESILIENT",
    description: "Evolves through cycles of rebirth. Great for bouncing back from procrastination.",
    glow: "from-amber-500/20 to-transparent",
    border: "border-amber-500/20",
  },
];

export default function OnboardingPage() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSelect = (id: string) => {
    if (isPending) return;
    
    startTransition(async () => {
      try {
        await selectCompanion(id as any);
        router.push("/dashboard");
      } catch (error) {
        console.error("Selection failed:", error);
      }
    });
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20 overflow-hidden relative flex flex-col items-center justify-center p-6">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-white/5 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500/5 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
      </div>

      <div className="z-10 w-full max-w-6xl flex flex-col items-center">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-zinc-400" />
            <span className="text-xs font-mono tracking-widest uppercase text-zinc-300">Initialization Sequence</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif tracking-tight text-white mb-6 leading-tight">
            Select Your <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40 italic">Companion Core</span>
          </h1>
          <p className="text-zinc-400 max-w-lg mx-auto font-sans font-light tracking-wide text-lg">
            Choose the entity that aligns with your productivity style. 
            It will grow as you conquer your schedule.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {COMPANIONS.map((companion, idx) => (
            <motion.div
              key={companion.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: idx * 0.2, ease: "easeOut" }}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              onClick={() => handleSelect(companion.id)}
              className={`relative group cursor-pointer rounded-[2.5rem] bg-white/[0.02] border transition-all duration-700 ease-out flex flex-col items-center p-4 overflow-hidden backdrop-blur-3xl shadow-2xl ${
                hoveredIdx === idx ? companion.border : "border-white/5"
              } ${isPending ? "opacity-50 pointer-events-none cursor-wait" : ""}`}
            >
              <div 
                className={`absolute inset-0 bg-gradient-to-t ${companion.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`}
              />
              
              <div className="w-full aspect-[4/3] rounded-[2rem] overflow-hidden relative mb-8 border border-white/5 bg-black/20 transition-colors duration-500 shadow-inner">
                <Companion3D type={companion.id as any} />
              </div>

              <div className="px-4 pb-4 relative z-10 w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-3xl font-serif text-white tracking-tight">{companion.name}</h3>
                  <div className={`p-2 rounded-full bg-white/5 text-white/50 group-hover:text-white group-hover:bg-white/10 transition-colors duration-500`}>
                    <companion.icon className="w-5 h-5" />
                  </div>
                </div>
                
                <div className="inline-block px-2 py-1 rounded-sm bg-white/10 mb-3">
                  <p className="text-[10px] font-mono tracking-widest text-zinc-300 uppercase">{companion.tag}</p>
                </div>
                
                <p className="text-zinc-400 text-sm leading-relaxed font-light mb-8 h-12">
                  {companion.description}
                </p>

                <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-zinc-500 uppercase group-hover:text-white transition-colors duration-500">
                  <span>Initialize</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-500" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
