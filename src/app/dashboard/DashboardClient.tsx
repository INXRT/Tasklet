"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Calendar as CalendarIcon, List, Plus, Activity, Coins, CheckCircle, Circle, Store } from "lucide-react";
import { format } from "date-fns";
import { TaskModal } from "@/components/ui/TaskModal";
import { CalendarView } from "@/components/ui/CalendarView";
import { toggleTaskCompletion } from "@/actions/task";
import { Pokemon2D } from "@/components/ui/Pokemon2D";
import { ExpBar } from "@/components/ui/ExpBar";
import { MoodIndicator } from "@/components/ui/MoodIndicator";
import { ShopModal } from "@/components/ui/ShopModal";
import { POKEMON_DATA, getPokemonLevel, checkEvolution } from "@/lib/pokemon-data";

export function DashboardClient({ user, activePokemon }: { user: any; activePokemon: any }) {
  const [view, setView] = useState<"calendar" | "list">("list");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);

  const pokemonMeta = POKEMON_DATA[activePokemon.pokemonId];
  const level = getPokemonLevel(activePokemon.xp);

  const handleToggleTask = (id: string, currentStatus: boolean) => {
    toggleTaskCompletion(id, currentStatus);
  };

  return (
    <div className="w-full h-full grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* Sidebar: Stats & Companion */}
      <div className="lg:col-span-4 flex flex-col gap-8">
        
        {/* Companion Viewer */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="rounded-[2rem] glass-panel p-6 relative flex flex-col items-center h-[480px]"
        >
          <div className="flex justify-between w-full mb-4 z-10">
            <MoodIndicator mood={activePokemon.mood} />
            <button onClick={() => setIsShopOpen(true)} className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/70 hover:text-white">
              <Store className="w-5 h-5" />
            </button>
          </div>
          
          <div className="relative w-full flex-1 rounded-2xl overflow-hidden bg-black/40 border border-white/10 z-10 flex items-center justify-center shadow-inner mb-6">
            <Pokemon2D 
              speciesId={activePokemon.pokemonId} 
              mood={activePokemon.mood} 
              level={level} 
            />
          </div>

          <div className="w-full flex flex-col gap-4 z-10">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-serif text-white tracking-tight capitalize">
                  {pokemonMeta?.name || "Pokémon"}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-mono tracking-widest uppercase text-white/70">
                    {pokemonMeta?.type || "Unknown"}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-1.5 text-amber-400 bg-amber-400/10 px-3 py-1 rounded-xl border border-amber-400/20 shadow-[0_0_10px_rgba(251,191,36,0.2)]">
                  <Coins className="w-3.5 h-3.5" />
                  <span className="font-mono text-sm">{user.coins}</span>
                </div>
              </div>
            </div>
            
            <ExpBar xp={activePokemon.xp} />
          </div>
        </motion.div>

        {/* Stats Bento */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="rounded-[2rem] glass-panel p-8 relative flex-1"
        >
          <h3 className="font-mono text-xs tracking-widest text-zinc-400 mb-6 uppercase">Activity Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-zinc-400 text-sm mb-1 font-medium">Tasks Done</p>
              <p className="text-4xl font-serif text-white shadow-sm drop-shadow-md">
                {user.tasks.filter((t: any) => t.isCompleted).length}
              </p>
            </div>
            <div>
              <p className="text-zinc-400 text-sm mb-1 font-medium">Karma</p>
              <p className="text-4xl font-serif text-emerald-400 shadow-sm drop-shadow-md">
                {user.karma}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Area: Calendar/Tasks */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
        className="lg:col-span-8 rounded-[2rem] glass-panel p-8 relative flex flex-col"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8 relative z-10 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-4xl font-serif text-white tracking-tight mb-2 drop-shadow-md">Schedule</h1>
            <p className="font-mono text-xs tracking-widest text-zinc-400 uppercase">
              {format(new Date(), "MMMM do, yyyy")}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center p-1 rounded-full bg-black/40 border border-white/10 hidden md:flex shadow-inner">
              <button 
                onClick={() => setView("calendar")}
                className={`p-2.5 rounded-full transition-all ${view === "calendar" ? "skeumorphic-btn-active text-white" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                <CalendarIcon className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setView("list")}
                className={`p-2.5 rounded-full transition-all ${view === "list" ? "skeumorphic-btn-active text-white" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-6 py-2.5 text-black rounded-full transition-all active:scale-95 skeumorphic-btn hover:brightness-110 font-medium text-sm"
              style={{ background: 'linear-gradient(180deg, #ffffff 0%, #e0e0e0 100%)' }}
            >
              <Plus className="w-4 h-4" />
              New Task
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative z-10 overflow-y-auto pr-2 custom-scrollbar">
          {view === "list" ? (
            <div className="space-y-3">
              {user.tasks.length === 0 ? (
                <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-zinc-500 border border-white/10 border-dashed rounded-[1.5rem] bg-black/20">
                  <p className="font-serif text-xl mb-2 text-zinc-400">No tasks scheduled.</p>
                  <p className="font-mono text-[10px] uppercase tracking-widest">Awaiting input</p>
                </div>
              ) : (
                user.tasks.map((task: any) => (
                  <div 
                    key={task.id} 
                    className={`relative p-5 rounded-[1.25rem] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] flex justify-between items-center group hover:scale-[1.01] active:scale-[0.98] ${
                      task.isCompleted 
                        ? "bg-white/5 border border-white/5 opacity-60 shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]" 
                        : "bg-white/[0.03] border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.1),inset_0.5px_0.5px_1px_rgba(255,255,255,0.2)]"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => handleToggleTask(task.id, task.isCompleted)}
                        className={`transition-colors p-1 rounded-full ${task.isCompleted ? "text-emerald-400 bg-emerald-400/10" : "text-zinc-400 group-hover:text-white"}`}
                      >
                        {task.isCompleted ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                      </button>
                      <div>
                        <h4 className={`text-lg font-medium tracking-tight drop-shadow-sm transition-colors duration-300 ${task.isCompleted ? "text-white/40 line-through" : "text-white/90 group-hover:text-white"}`}>
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-3 mt-1.5 opacity-70">
                          <p className="text-[11px] text-zinc-300 font-medium tracking-wide">{format(new Date(task.dueDate), "MMM do, h:mm a")}</p>
                          <span className="w-1 h-1 rounded-full bg-zinc-500"></span>
                          <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
                            {task.duration} MIN
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="h-full min-h-[400px] rounded-2xl overflow-hidden border border-white/10 bg-black/40 shadow-inner">
              <CalendarView tasks={user.tasks} />
            </div>
          )}
        </div>
      </motion.div>

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        userId={user.id} 
      />

      <ShopModal
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
        userId={user.id}
        userCoins={user.coins}
      />
    </div>
  );
}
