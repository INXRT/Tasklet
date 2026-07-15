"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Clock, Target, BrainCircuit } from "lucide-react";

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

export default function HomeClient({ userProfile, urgentTask }: { userProfile: any, urgentTask: any }) {
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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono tracking-widest text-zinc-400 mb-10 uppercase">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>System Initialization / Productivity</span>
            </div>
            
            <h1 className="text-7xl md:text-[9rem] font-normal tracking-tighter mb-4 text-white leading-[0.85] drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
              Gamify <br/>
              <TypewriterEffect />
            </h1>
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8 mt-16">
            <p className="text-lg md:text-xl text-zinc-400 max-w-sm font-light leading-relaxed">
              Familiar connects your real-world consistency to a living digital companion. Your actions have physical consequences.
            </p>
            <Link href={userProfile ? "/dashboard" : "/login"}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-4 px-10 py-5 bg-white text-black rounded-[2rem] shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_80px_rgba(255,255,255,0.3)] transition-all duration-500"
              >
                <span className="font-sans font-medium tracking-wide text-lg">{userProfile ? "Enter Console" : "Commence"}</span>
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
                  onClick={() => signOut({ callbackUrl: "/login" })}
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
              <Target className="w-12 h-12 text-zinc-400 mb-6 group-hover:scale-110 transition-transform duration-700 ease-out" />
              <span className="font-mono text-xs text-zinc-500 tracking-widest">PRECISION</span>
            </motion.div>

            {/* Small Feature Bento 3 */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.5, delay: 0.2 }}
              className="md:col-span-2 md:row-span-1 rounded-[2.5rem] glass-panel p-10 flex flex-col justify-center items-center text-center relative overflow-hidden group"
            >
              <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
              <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <BrainCircuit className="w-12 h-12 text-zinc-400 mb-6 group-hover:text-indigo-400 transition-colors duration-500 relative z-10" />
              <span className="font-mono text-xs text-zinc-500 tracking-widest relative z-10">AI DRIVEN</span>
            </motion.div>
          </>
        ) : (
          <>
            {/* Small Feature Bento 1 */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.5, delay: 0.1 }}
              className="md:col-span-4 md:row-span-1 rounded-[2.5rem] glass-panel p-10 flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
              <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              <Clock className="w-10 h-10 text-zinc-400 mb-4 group-hover:text-white transition-colors duration-500" />
              <div className="relative z-10">
                <h3 className="text-4xl md:text-5xl mb-2 text-white font-serif tracking-tight">Urgency</h3>
                <p className="text-xs text-zinc-500 font-mono tracking-widest">DEADLINE APPROACHING</p>
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
              <Target className="w-12 h-12 text-zinc-400 mb-6 group-hover:scale-110 transition-transform duration-700 ease-out" />
              <span className="font-mono text-xs text-zinc-500 tracking-widest">PRECISION</span>
            </motion.div>

            {/* Small Feature Bento 3 */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.5, delay: 0.2 }}
              className="md:col-span-2 md:row-span-1 rounded-[2.5rem] glass-panel p-10 flex flex-col justify-center items-center text-center relative overflow-hidden group"
            >
              <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
              <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <BrainCircuit className="w-12 h-12 text-zinc-400 mb-6 group-hover:text-indigo-400 transition-colors duration-500 relative z-10" />
              <span className="font-mono text-xs text-zinc-500 tracking-widest relative z-10">AI DRIVEN</span>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
