"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Leaf, Flame, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { selectStarterPokemon } from "@/actions/user";
import { Pokemon2D } from "@/components/ui/Pokemon2D";
import { useSession } from "next-auth/react";

const STARTERS = [
  {
    id: "bulbasaur",
    name: "Bulbasaur",
    icon: Leaf,
    tag: "GRASS/POISON",
    description: "A steady and reliable companion. Perfect for building consistent, long-term habits.",
    glow: "from-green-500/20 to-transparent",
    border: "border-green-500/20",
  },
  {
    id: "charmander",
    name: "Charmander",
    icon: Flame,
    tag: "FIRE",
    description: "Fierce and passionate. Ideal for those who tackle their tasks with intense bursts of energy.",
    glow: "from-orange-500/20 to-transparent",
    border: "border-orange-500/20",
  },
  {
    id: "pichu",
    name: "Pichu",
    icon: Zap,
    tag: "ELECTRIC",
    description: "Quick and energetic. Great for users who want to speed through many small tasks quickly.",
    glow: "from-yellow-500/20 to-transparent",
    border: "border-yellow-500/20",
  },
];

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  if (status === "unauthenticated") {
    router.push("/login");
  }

  const handleSelect = (id: string) => {
    if (isPending || !session?.user?.id) return;
    
    startTransition(async () => {
      try {
        const result = await selectStarterPokemon(session.user.id, id);
        if (result && result.error) {
          alert("Database Error: " + result.error);
          return;
        }
        router.push("/dashboard");
      } catch (error) {
        alert("Unexpected error: " + String(error));
        console.error("Selection failed:", error);
      }
    });
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* The Desktop Window */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="glass-panel w-full max-w-6xl rounded-[2.5rem] p-8 md:p-12 flex flex-col shadow-[0_20px_80px_-20px_rgba(0,0,0,0.5)]"
      >
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 border border-white/10 mb-6 shadow-inner">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] font-mono tracking-widest uppercase text-white/70">OS Initialization</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif tracking-tight text-white mb-4">
            Select Your <span className="text-white/50 italic">Partner</span>
          </h1>
          <p className="text-zinc-400 max-w-lg mx-auto font-sans text-sm tracking-wide">
            Your environment will adapt to your workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {STARTERS.map((starter, idx) => (
            <motion.div
              key={starter.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: 0.1 + idx * 0.1 }}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              onClick={() => handleSelect(starter.id)}
              className={`relative group cursor-pointer rounded-[2rem] bg-black/20 transition-all duration-500 ease-out flex flex-col items-center p-3 overflow-hidden shadow-inner border ${
                hoveredIdx === idx ? starter.border : "border-white/5"
              } ${isPending ? "opacity-50 pointer-events-none cursor-wait" : ""}`}
            >
              <div 
                className={`absolute inset-0 bg-gradient-to-t ${starter.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none mix-blend-screen`}
              />
              
              <div className="w-full aspect-[4/3] rounded-[1.5rem] overflow-hidden relative mb-6 border border-white/5 bg-white/[0.02] transition-colors duration-500 flex items-center justify-center">
                <Pokemon2D speciesId={starter.id} mood={hoveredIdx === idx ? "happy" : "idle"} />
              </div>

              <div className="px-3 pb-3 relative z-10 w-full flex flex-col">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-2xl font-serif text-white tracking-tight">{starter.name}</h3>
                  <div className={`p-1.5 rounded-full bg-white/5 text-white/50 group-hover:text-white group-hover:bg-white/10 transition-colors duration-500`}>
                    <starter.icon className="w-4 h-4" />
                  </div>
                </div>
                
                <div className="inline-flex px-2 py-0.5 rounded border border-white/10 bg-white/5 mb-3 self-start">
                  <p className="text-[9px] font-mono tracking-widest text-zinc-400 uppercase">{starter.tag}</p>
                </div>
                
                <p className="text-zinc-500 text-xs leading-relaxed font-light mb-6 h-10">
                  {starter.description}
                </p>

                <button className="w-full skeumorphic-btn py-2.5 rounded-xl text-xs font-medium uppercase tracking-widest text-zinc-300 group-hover:text-white group-hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2">
                  <span>Deploy</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
