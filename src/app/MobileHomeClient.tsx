"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Gamepad2, Trophy, User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { useGlobalLoader } from "@/components/GlobalLoader";

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
      const timeout = setTimeout(() => setIsDeleting(true), 2000);
      return () => clearTimeout(timeout);
    }

    if (subIndex === 0 && isDeleting) {
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % WORDS.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, isDeleting ? 40 : 120);

    return () => clearTimeout(timeout);
  }, [subIndex, index, isDeleting]);

  return (
    <span className="text-zinc-300 italic font-serif drop-shadow-[0_2px_12px_rgba(0,0,0,1)]">
      {WORDS[index].substring(0, subIndex)}
      <span className={blink ? "opacity-100 transition-opacity" : "opacity-0 transition-opacity"}>|</span>
    </span>
  );
}

export default function MobileHomeClient({ userProfile, urgentTask }: { userProfile: any, urgentTask: any }) {
  const { showLoader } = useGlobalLoader();

  return (
    <div className="flex-1 flex flex-col justify-start items-center p-4 pt-8 pb-32 min-h-[100dvh] relative overflow-y-auto overflow-x-hidden custom-scrollbar">
      
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md flex flex-col gap-6 relative z-10 mt-4">
        
        {/* Main Hero Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="rounded-[2.5rem] glass-panel p-8 flex flex-col justify-between relative overflow-hidden group shadow-lg min-h-[350px]"
        >
          <div className="absolute inset-0 opacity-[0.05] mix-blend-normal pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
          
          <div className="relative z-10 flex flex-col items-start text-left w-full">
            <div className="mb-6 w-full flex justify-center">
              <Link href={userProfile ? "/dashboard" : "/"}>
                <img src="/pokequest.png" alt="PokéQuest" className="h-14 max-w-full w-auto object-contain filter drop-shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95 transition-transform" />
              </Link>
            </div>
            
            <div className="mb-6">
              <h2 className="text-[3.5rem] font-normal tracking-tighter text-white leading-[0.9] drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
                Gamify <br />
                <TypewriterEffect />
              </h2>
            </div>
            
            <p className="text-base text-zinc-400 font-light leading-relaxed">
              PokéQuest connects your real-world consistency to your very own Pokémon journey.
            </p>
          </div>
        </motion.div>

        {userProfile ? (
          <>
            {/* Authenticated User Profile Box */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
              className="rounded-[2.5rem] glass-panel p-8 flex flex-col justify-center items-center relative overflow-hidden border-white/10 shadow-lg bg-black/40 text-center"
            >
              <div className="absolute top-4 right-4">
                <button 
                  onClick={() => {
                    showLoader();
                    signOut({ callbackUrl: "/login" });
                  }}
                  className="p-2.5 rounded-full bg-white/5 active:bg-white/10 text-zinc-400 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>

              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/10 shadow-inner mb-4">
                {userProfile.image ? (
                  <img src={userProfile.image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-4xl">
                    {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-3xl font-serif text-white tracking-tight mb-2">{userProfile.name || "Trainer"}</h3>
                <div className="flex justify-center items-center gap-3">
                  <span className="px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono tracking-widest uppercase text-emerald-400">
                    Lv {Math.floor((userProfile.karma || 0)/100) + 1}
                  </span>
                  <span className="text-xs text-zinc-400 font-mono tracking-wider">{userProfile.karma || 0} Karma</span>
                </div>
              </div>
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
          >
            {/* Sign In CTA Box for Mobile */}
            <Link href="/login?callbackUrl=%2F" className="block w-full">
              <div className="rounded-[2.5rem] glass-panel p-8 flex flex-col justify-between relative overflow-hidden active:scale-[0.98] transition-transform duration-300 shadow-lg border border-white/10">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/20 pointer-events-none" />
                
                <div className="flex justify-between items-start w-full relative z-10">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/20 mb-4 bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center text-white shadow-lg">
                    <User className="w-6 h-6" />
                  </div>
                  
                  <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
                
                <div className="relative z-10 mt-2">
                  <h3 className="text-3xl mb-1 text-white font-serif tracking-tight">Sign In</h3>
                  <p className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase">Begin Your Adventure</p>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Feature Grid: Side by side on mobile */}
        <div className="grid grid-cols-2 gap-4">
          {/* Feature 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: 0.15 }}
            className="rounded-[2rem] glass-panel p-6 flex flex-col justify-center items-center text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none" />
            <Gamepad2 className="w-8 h-8 text-emerald-400 mb-4 relative z-10 drop-shadow-md" />
            <span className="font-mono text-[10px] text-zinc-400 tracking-widest relative z-10">GAMIFIED</span>
          </motion.div>

          {/* Feature 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
            className="rounded-[2rem] glass-panel p-6 flex flex-col justify-center items-center text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-amber-500/5 pointer-events-none" />
            <Trophy className="w-8 h-8 text-amber-400 mb-4 relative z-10 drop-shadow-md" />
            <span className="font-mono text-[10px] text-zinc-400 tracking-widest relative z-10">EVOLUTIONS</span>
          </motion.div>
        </div>

      </div>

      {/* Fixed Sticky Action Bar at Bottom (Like Mobile Apps) */}
      <motion.div 
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: 0.3 }}
        className="fixed bottom-0 left-0 right-0 p-4 pb-6 bg-gradient-to-t from-black via-black/80 to-transparent z-50 flex justify-center"
      >
        <Link href={userProfile ? "/dashboard" : "/login?callbackUrl=%2Fdashboard"} className="w-full max-w-md">
          <button
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white text-black rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.1)] active:scale-[0.98] transition-transform"
          >
            <span className="font-sans font-semibold tracking-wide text-lg">
              {userProfile ? "Open Dashboard" : "Start Journey"}
            </span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </Link>
      </motion.div>

    </div>
  );
}
