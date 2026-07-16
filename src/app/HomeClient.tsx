"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Clock, Gamepad2, Trophy, User } from "lucide-react";

import { useState, useEffect } from "react";

const WORDS = ["tasks.", "goals.", "missions."];

function TypewriterEffect() {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const timeout = setInterval(() => setBlink((prev) => !prev), 500);
    return () => clearInterval(timeout);
  }, []);

  useEffect(() => {
    if (subIndex === WORDS[index].length && !isDeleting) {
      const timeout = setTimeout(() => setIsDeleting(true), 2000); // 2 second pause
      return () => clearTimeout(timeout);
    }

    if (subIndex === 0 && isDeleting) {
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % WORDS.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, isDeleting ? 40 : 120); // Faster delete, natural typing speed

    return () => clearTimeout(timeout);
  }, [subIndex, index, isDeleting]);

  return (
    <span className="text-zinc-300 italic font-serif drop-shadow-[0_2px_12px_rgba(0,0,0,1)]">
      {WORDS[index].substring(0, subIndex)}
      <span className={blink ? "opacity-100 transition-opacity" : "opacity-0 transition-opacity"}>|</span>
    </span>
  );
}

import { format } from "date-fns";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useGlobalLoader } from "@/components/GlobalLoader";

export default function HomeClient({ userProfile, urgentTask }: { userProfile: any, urgentTask: any }) {
  const { showLoader } = useGlobalLoader();
  return (
    <div className="flex-1 flex flex-col justify-center items-center p-4 md:p-8 z-10 relative min-h-[90vh]">
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 auto-rows-[minmax(220px,auto)]">
        
        {/* Main Hero Bento Box */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.5 }}
          className="md:col-span-8 md:row-span-2 rounded-[2.5rem] glass-panel p-10 md:p-16 flex flex-col justify-between relative overflow-hidden group shadow-lg"
        >
          {/* Card Noise Overlay */}
          <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
          
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
          
          <div className="relative z-10">
            <div className="mb-4 md:mb-8 mt-2">
              <Link href={userProfile ? "/dashboard" : "/"}>
                <img src="/pokequest.png" alt="PokéQuest" className="h-20 md:h-32 max-w-full w-auto object-contain object-left filter drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:scale-[1.02] active:scale-[0.98] transition-transform cursor-pointer" />
              </Link>
            </div>
            
            <div className="mb-4">
              <h2 className="text-6xl md:text-[8rem] font-normal tracking-tighter text-white leading-[0.85] drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
                Gamify <br />
                <TypewriterEffect />
              </h2>
            </div>
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8 mt-16">
            <p className="text-lg md:text-xl text-zinc-400 max-w-sm font-light leading-relaxed">
              PokéQuest connects your real-world consistency to your very own Pokémon journey. Every task you complete helps your partner grow and evolve.
            </p>
            <Link href={userProfile ? "/dashboard" : "/login?callbackUrl=%2Fdashboard"}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-4 px-10 py-5 bg-white text-black rounded-[2rem] shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_80px_rgba(255,255,255,0.3)] transition-all duration-500"
              >
                <span className="font-sans font-medium tracking-wide text-lg">{userProfile ? "Continue" : "Start Journey"}</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {userProfile ? (
          <>
            {/* Authenticated User Profile Box */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.5, delay: 0.1 }}
              className="md:col-span-4 md:row-span-1 rounded-[2.5rem] glass-panel p-10 flex flex-col justify-center items-center relative overflow-hidden group border-white/10 shadow-lg bg-black/40 text-center"
            >
              <div className="absolute top-6 right-6">
                <button 
                  onClick={() => {
                    showLoader();
                    signOut({ callbackUrl: "/login" });
                  }}
                  className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>

              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/10 shadow-inner mb-6">
                {userProfile.image ? (
                  <img src={userProfile.image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-5xl">
                    {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-4xl font-serif text-white tracking-tight mb-3">{userProfile.name || "Trainer"}</h3>
                <div className="flex justify-center items-center gap-4">
                  <span className="px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono tracking-widest uppercase text-emerald-400">
                    Lv {Math.floor((userProfile.karma || 0)/100) + 1}
                  </span>
                  <span className="text-sm text-zinc-400 font-mono tracking-wider">{userProfile.karma || 0} Karma</span>
                </div>
              </div>
            </motion.div>

            {/* Small Feature Bento 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.5, delay: 0.15 }}
              className="md:col-span-2 md:row-span-1 rounded-[2.5rem] glass-panel p-10 flex flex-col justify-center items-center text-center relative overflow-hidden group"
            >
              <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
              <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <Gamepad2 className="w-12 h-12 text-zinc-400 mb-6 group-hover:scale-110 group-hover:text-emerald-400 transition-all duration-500 ease-out relative z-10" />
              <span className="font-mono text-xs text-zinc-500 tracking-widest relative z-10">GAMIFIED</span>
            </motion.div>

            {/* Small Feature Bento 3 */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.5, delay: 0.2 }}
              className="md:col-span-2 md:row-span-1 rounded-[2.5rem] glass-panel p-10 flex flex-col justify-center items-center text-center relative overflow-hidden group"
            >
              <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
              <div className="absolute inset-0 bg-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              <Trophy className="w-12 h-12 text-zinc-400 mb-6 group-hover:scale-110 group-hover:text-amber-400 transition-all duration-500 relative z-10" />
              <span className="font-mono text-xs text-zinc-500 tracking-widest relative z-10">EVOLUTIONS</span>
            </motion.div>
          </>
        ) : (
          <>
            {/* Small Feature Bento 1 (Sign In) */}
            <Link href="/login?callbackUrl=%2F" className="md:col-span-4 md:row-span-1 block h-full">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.5, delay: 0.1 }}
                className="h-full rounded-[2.5rem] glass-panel p-10 flex flex-col justify-between relative overflow-hidden group text-left cursor-pointer border border-white/5 hover:border-white/20 transition-all duration-500"
              >
                <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                
                <div className="flex justify-between items-start w-full relative z-10">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-white/30 mb-4 transition-all duration-500 bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center text-zinc-500 group-hover:text-white shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]">
                    <User className="w-7 h-7 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white group-hover:text-black transition-colors duration-500 opacity-50 group-hover:opacity-100">
                    <ArrowRight className="w-5 h-5 -translate-x-0.5 group-hover:translate-x-0 transition-transform duration-500" />
                  </div>
                </div>
                
                <div className="relative z-10">
                  <h3 className="text-4xl md:text-5xl mb-2 text-zinc-300 group-hover:text-white font-serif tracking-tight transition-colors duration-500">Sign In</h3>
                  <p className="text-xs text-zinc-500 group-hover:text-zinc-400 font-mono tracking-widest uppercase transition-colors duration-500">Begin Your Adventure</p>
                </div>
              </motion.div>
            </Link>

            {/* Small Feature Bento 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.5, delay: 0.15 }}
              className="md:col-span-2 md:row-span-1 rounded-[2.5rem] glass-panel p-10 flex flex-col justify-center items-center text-center relative overflow-hidden group"
            >
              <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
              <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <Gamepad2 className="w-12 h-12 text-zinc-400 mb-6 group-hover:scale-110 group-hover:text-emerald-400 transition-all duration-500 ease-out relative z-10" />
              <span className="font-mono text-xs text-zinc-500 tracking-widest relative z-10">GAMIFIED</span>
            </motion.div>

            {/* Small Feature Bento 3 */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.5, delay: 0.2 }}
              className="md:col-span-2 md:row-span-1 rounded-[2.5rem] glass-panel p-10 flex flex-col justify-center items-center text-center relative overflow-hidden group"
            >
              <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
              <div className="absolute inset-0 bg-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              <Trophy className="w-12 h-12 text-zinc-400 mb-6 group-hover:scale-110 group-hover:text-amber-400 transition-all duration-500 relative z-10" />
              <span className="font-mono text-xs text-zinc-500 tracking-widest relative z-10">EVOLUTIONS</span>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
