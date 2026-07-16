"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useOptimistic, useTransition } from "react";
import { Calendar as CalendarIcon, List, Plus, Activity, Coins, CheckCircle, Circle, Store, Backpack, Settings, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { format, addDays, subDays, isSameDay } from "date-fns";
import { TaskModal } from "@/components/ui/TaskModal";
import { CalendarView } from "@/components/ui/CalendarView";
import { toggleTaskCompletion, deleteTask } from "@/actions/task";
import { Pokemon2D } from "@/components/ui/Pokemon2D";
import { ExpBar } from "@/components/ui/ExpBar";
import { MoodIndicator } from "@/components/ui/MoodIndicator";
import { playPopSound, playChimeSound } from "@/lib/audio";
import { ShopModal } from "@/components/ui/ShopModal";
import { InventoryModal } from "@/components/ui/InventoryModal";
import { POKEMON_DATA, getPokemonLevel, checkEvolution } from "@/lib/pokemon-data";
import { signOut } from "next-auth/react";
import { PokemonRosterModal } from "@/components/ui/PokemonRosterModal";
import { DailyProgressRing } from "@/components/ui/DailyProgressRing";
import { QuickFeed } from "@/components/ui/QuickFeed";

const containerVariants: any = {
  hidden: (dir: number) => ({ opacity: 0, x: dir > 0 ? 50 : -50 }),
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 400, damping: 30 } },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -50 : 50, transition: { duration: 0.2, ease: "easeIn" } })
};

export function DashboardClient({ user, activePokemon }: { user: any; activePokemon: any }) {
  const [view, setView] = useState<"calendar" | "list">("list");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<any>(null);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isRosterOpen, setIsRosterOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [direction, setDirection] = useState(0);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [optimisticTasks, addOptimisticTask] = useOptimistic(
    user.tasks || [],
    (state: any[], update: { action: "toggle" | "delete"; id: string; currentStatus?: boolean }) => {
      if (update.action === "delete") {
        return state.filter(t => t.id !== update.id);
      }
      if (update.action === "toggle") {
        return state.map(t => t.id === update.id ? { ...t, isCompleted: !update.currentStatus } : t);
      }
      return state;
    }
  );

  const [optimisticXp, addOptimisticXp] = useOptimistic(
    activePokemon.xp,
    (state: number, amount: number) => state + amount
  );

  const [optimisticInventory, addOptimisticInventory] = useOptimistic(
    user.inventory,
    (state: any[], itemId: string) => {
      return state.map(item => 
        item.id === itemId 
          ? { ...item, quantity: item.quantity - 1 } 
          : item
      ).filter(item => item.quantity > 0);
    }
  );

  const handleDateChange = (newDate: Date) => {
    setDirection(newDate > selectedDate ? 1 : -1);
    setSelectedDate(newDate);
  };

  const pokemonMeta = POKEMON_DATA[activePokemon.pokemonId];
  const level = getPokemonLevel(optimisticXp);

  const handleToggleTask = (id: string, currentStatus: boolean) => {
    // If completing the task, trigger juice
    if (!currentStatus) {
      playPopSound();
    }

    startTransition(() => {
      addOptimisticTask({ action: "toggle", id, currentStatus });
      toggleTaskCompletion(id, currentStatus);
    });
  };

  const handleDeleteTask = (id: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      startTransition(() => {
        addOptimisticTask({ action: "delete", id });
        deleteTask(id);
      });
    }
  };

  const handleEditTask = (task: any) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

  const todaysTasks = optimisticTasks.filter((t: any) => isSameDay(new Date(t.dueDate), selectedDate));

  return (
    <div className="w-full h-full grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* Sidebar: Stats & Companion */}
      <div className="lg:col-span-4 flex flex-col gap-8">
        
        {/* Companion Viewer */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.5 }}
          className="rounded-[2rem] glass-panel p-6 relative flex flex-col items-center h-[420px]"
        >
          <div className="flex justify-start w-full mb-4 z-10">
            <MoodIndicator mood={activePokemon.mood} />
          </div>
          
          <div className="relative w-full flex-1 rounded-2xl overflow-hidden bg-black/40 border border-white/10 z-10 flex items-center justify-center shadow-inner mb-6">
            <Pokemon2D 
              speciesId={activePokemon.pokemonId} 
              mood={activePokemon.mood} 
              level={level} 
            />
            <QuickFeed 
              inventory={optimisticInventory} 
              userId={user.id} 
              onFeed={(itemId, xpAmount) => {
                startTransition(() => {
                  addOptimisticInventory(itemId);
                  addOptimisticXp(xpAmount);
                });
              }}
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
                <div className="flex items-center gap-2 bg-white/[0.03] backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-sm">
                  <Coins className="w-4 h-4 text-amber-400 drop-shadow-sm" />
                  <span className="font-semibold text-sm text-white/90 tracking-wide">{user.coins}</span>
                </div>
              </div>
            </div>
            
            <ExpBar xp={optimisticXp} evolution={pokemonMeta?.evolution} />
          </div>
        </motion.div>

        {/* Stats Bento */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.5, delay: 0.1 }}
          className="rounded-[2rem] glass-panel p-6 relative"
        >
          <h3 className="font-mono text-xs tracking-widest text-zinc-400 mb-6 uppercase">Activity Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-zinc-400 text-sm mb-1 font-medium">Tasks Done</p>
              <p className="text-4xl font-mono font-medium text-white shadow-sm drop-shadow-md tracking-tight">
                {user.tasks.filter((t: any) => t.isCompleted).length}
              </p>
            </div>
            <div>
              <p className="text-zinc-400 text-sm mb-1 font-medium">Karma</p>
              <p className="text-4xl font-mono font-medium text-emerald-400 shadow-sm drop-shadow-md tracking-tight">
                {user.karma}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Scratchpad Widget */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.5, delay: 0.2 }}
          className="rounded-[2rem] glass-panel p-5 relative flex-1 flex flex-col min-h-[120px]"
        >
          <h3 className="font-mono text-xs tracking-widest text-zinc-400 mb-3 uppercase">Quick Scratchpad</h3>
          <textarea 
            className="w-full flex-1 bg-transparent border-none outline-none resize-none text-zinc-300 placeholder:text-zinc-600 font-sans text-sm custom-scrollbar"
            placeholder="Jot down quick thoughts here..."
            defaultValue=""
          />
        </motion.div>
      </div>

      {/* Main Area: Calendar/Tasks */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.5, delay: 0.15 }}
        className="lg:col-span-8 rounded-[2rem] glass-panel p-6 relative flex flex-col"
      >
        {/* Header */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 relative z-10 border-b border-white/10 pb-6 gap-6">
          <div className="flex flex-wrap items-center gap-6">
            <h1 className="text-4xl font-serif text-white tracking-tight drop-shadow-md">Schedule</h1>
            
            {/* Daily Progress & Streak Ring */}
            <DailyProgressRing 
              completed={todaysTasks.filter(t => t.isCompleted).length} 
              total={todaysTasks.length} 
              streak={user.streak} 
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto justify-between xl:justify-end">
            {/* Date Changer Bar */}
            <div className="flex items-center gap-2 bg-black/40 rounded-full p-1.5 border border-white/5 shadow-inner overflow-hidden order-last xl:order-none">
              <AnimatePresence mode="popLayout">
                {[subDays(selectedDate, 2), subDays(selectedDate, 1), selectedDate, addDays(selectedDate, 1), addDays(selectedDate, 2)].map((date, i) => {
                  const isSelected = i === 2; // the center one is always selectedDate
                  return (
                    <motion.button
                      layout
                      initial={{ opacity: 0, scale: 0.8, x: 20 }}
                      animate={{ opacity: 1, scale: isSelected ? 1.1 : 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.8, x: -20 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      key={date.toISOString()}
                      onClick={() => handleDateChange(date)}
                      className={`flex flex-col items-center justify-center w-12 h-14 rounded-full transition-colors duration-300 shrink-0 ${
                        isSelected 
                          ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)] text-black" 
                          : "text-zinc-400 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <span className={`text-[9px] uppercase tracking-widest ${isSelected ? "text-black/70 font-bold" : "text-zinc-500 font-medium"}`}>
                        {format(date, "EEE")}
                      </span>
                      <span className={`text-lg mt-0.5 ${isSelected ? "font-bold" : "font-semibold"}`}>{format(date, "d")}</span>
                    </motion.button>
                  );
                })}
              </AnimatePresence>
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
                onClick={() => { setTaskToEdit(null); setIsModalOpen(true); }}
                className="flex items-center gap-2 px-6 py-2.5 text-black rounded-full transition-all active:scale-95 skeumorphic-btn hover:brightness-110 font-medium text-sm"
                style={{ background: 'linear-gradient(180deg, #ffffff 0%, #e0e0e0 100%)' }}
              >
                <Plus className="w-4 h-4" />
                New Task
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative z-10 overflow-y-auto px-4 custom-scrollbar pb-24 overflow-x-hidden -mx-4">
          {view === "list" ? (
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div 
                key={selectedDate.toISOString()}
                custom={direction}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-3 w-full pt-4"
              >
                {todaysTasks.length === 0 ? (
                  <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-zinc-500 border border-white/10 border-dashed rounded-[1.5rem] bg-black/20">
                    <p className="font-serif text-xl mb-2 text-zinc-400">No tasks scheduled.</p>
                    <p className="font-mono text-[10px] uppercase tracking-widest">For {format(selectedDate, "MMM do, yyyy")}</p>
                  </div>
                ) : (
                  todaysTasks
                    .sort((a: any, b: any) => {
                      if (a.isCompleted !== b.isCompleted) {
                        return a.isCompleted ? 1 : -1;
                      }
                      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
                    })
                    .map((task: any) => (
                    <motion.div 
                      layout
                      key={task.id} 
                      className={`relative p-5 rounded-2xl transition-all duration-300 flex justify-between items-center group active:scale-[0.98] overflow-hidden hover:z-20 ${
                        task.isCompleted 
                          ? "bg-white/[0.02] border border-white/[0.02] opacity-50 shadow-none" 
                          : "bg-gradient-to-br from-white/[0.05] to-transparent backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.3)] hover:shadow-[0_16px_48px_-12px_rgba(0,0,0,0.5)] hover:border-white/20 hover:-translate-y-0.5"
                      }`}
                    >
                      {/* Optional Highlight Glow when uncompleted */}
                      {!task.isCompleted && (
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/[0.02] to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      )}

                      <div className="flex items-center gap-4 relative z-10">
                        <button 
                          onClick={() => handleToggleTask(task.id, task.isCompleted)}
                          className={`relative flex items-center justify-center w-7 h-7 rounded-full transition-all duration-300 shrink-0 ${
                            task.isCompleted 
                              ? "text-emerald-400 bg-emerald-400/10 shadow-[0_0_12px_rgba(52,211,153,0.3)]" 
                              : "text-zinc-500 bg-black/40 border border-white/10 group-hover:border-emerald-400/30 group-hover:text-emerald-400/80"
                          }`}
                        >
                          {task.isCompleted ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5 opacity-50" />}
                        </button>
                        <div>
                          <h4 className={`text-lg font-medium tracking-tight transition-colors duration-300 ${task.isCompleted ? "text-white/40 line-through" : "text-white/90 drop-shadow-sm group-hover:text-white"}`}>
                            {task.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1 opacity-80">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-widest uppercase bg-black/30 text-zinc-300 border border-white/5">
                              {format(new Date(task.dueDate), "MMM do")}
                            </span>
                            <span className="text-zinc-500 text-[10px]">•</span>
                            <span className="text-[11px] text-zinc-400 font-medium tracking-wide">
                              {format(new Date(task.dueDate), "h:mm a")}
                            </span>
                            <span className="text-zinc-500 text-[10px]">•</span>
                            <span className="text-[10px] font-mono tracking-widest text-emerald-400/70 uppercase">
                              {task.duration}m
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="relative z-10">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === task.id ? null : task.id)}
                          className="p-2 rounded-full text-zinc-500 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                        
                        {openMenuId === task.id && (
                          <div className="absolute right-0 mt-2 w-36 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50 py-1">
                            <button
                              onClick={() => handleEditTask(task)}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="h-full min-h-[400px] rounded-2xl overflow-hidden border border-white/10 bg-black/40 shadow-inner mb-24">
              <CalendarView tasks={user.tasks} />
            </div>
          )}
        </div>
      </motion.div>

      {/* MacOS Style Glass Dock */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.5, delay: 0.3 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 p-3 glass-panel rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)] border border-white/10"
      >
        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="relative group w-14 h-14 rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center overflow-hidden border border-white/5"
          >
            {user.image ? (
              <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
            )}
            {!isProfileOpen && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-[10px] font-mono px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md whitespace-nowrap z-50">
                {user.name || "Profile"}
              </div>
            )}
          </button>
        </div>



        <div className="w-px h-8 bg-white/10 mx-1 rounded-full"></div>

        <button 
          onClick={() => setIsShopOpen(true)}
          className="relative group p-4 rounded-full hover:bg-white/10 transition-all duration-300 text-amber-400 hover:scale-110 active:scale-95"
        >
          <Store className="w-6 h-6 drop-shadow-md" />
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-[10px] font-mono px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md whitespace-nowrap">
            Poké Mart
          </div>
        </button>

        <button 
          onClick={() => setIsInventoryOpen(true)}
          className="relative group p-4 rounded-full hover:bg-white/10 transition-all duration-300 text-indigo-400 hover:scale-110 active:scale-95"
        >
          <Backpack className="w-6 h-6 drop-shadow-md" />
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-[10px] font-mono px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md whitespace-nowrap">
            Backpack ({user.inventory?.length || 0})
          </div>
        </button>

        <div className="w-px h-8 bg-white/10 mx-1 rounded-full"></div>

        <button 
          onClick={() => setIsRosterOpen(true)}
          className="relative group p-4 rounded-full hover:bg-white/10 transition-all duration-300 text-emerald-400 hover:scale-110 active:scale-95"
        >
          <svg className="w-6 h-6 drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
            <path d="M2 12h8" />
            <path d="M14 12h8" />
          </svg>
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-[10px] font-mono px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md whitespace-nowrap">
            My Pokémon
          </div>
        </button>

        {/* Profile Popup Menu (Centered over the entire dock) */}
        {isProfileOpen && (
          <>
            {/* Invisible backdrop to close when clicking outside */}
            <div className="fixed inset-0 z-40 cursor-default" onClick={() => setIsProfileOpen(false)} />
            
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95, x: "-50%" }}
              animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
              exit={{ opacity: 0, y: 10, scale: 0.95, x: "-50%" }}
              className="absolute bottom-[calc(100%+16px)] left-1/2 w-64 glass-panel rounded-3xl p-5 shadow-[0_20px_40px_rgba(0,0,0,0.5)] border border-white/10 z-50 flex flex-col items-center"
            >
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/10 shadow-inner mb-3">
                {user.image ? (
                  <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-3xl">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
              </div>
              
              <h3 className="text-xl font-serif text-white tracking-tight text-center mb-1">{user.name || "Trainer"}</h3>
              {user.email && <p className="text-xs text-zinc-400 font-sans text-center mb-4 truncate w-full px-2">{user.email}</p>}
              
              <div className="flex w-full gap-2 mb-5">
                <div className="flex-1 bg-black/30 rounded-xl p-2 border border-white/5 flex flex-col items-center justify-center shadow-inner">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-1">Karma</span>
                  <span className="font-serif text-emerald-400">{user.karma || 0}</span>
                </div>
                <div className="flex-1 bg-black/30 rounded-xl p-2 border border-white/5 flex flex-col items-center justify-center shadow-inner">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-1">Level</span>
                  <span className="font-serif text-amber-400">{Math.floor((user.karma || 0)/100) + 1}</span>
                </div>
              </div>

              <button 
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="w-full skeumorphic-btn py-2.5 rounded-xl text-xs font-medium uppercase tracking-widest text-zinc-300 hover:text-white transition-all active:scale-95 flex items-center justify-center"
              >
                Sign Out
              </button>
            </motion.div>
          </>
        )}
      </motion.div>

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setTaskToEdit(null); }} 
        userId={user.id} 
        initialData={taskToEdit}
      />

      <ShopModal
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
        userId={user.id}
        userCoins={user.coins}
      />

      <InventoryModal
        isOpen={isInventoryOpen}
        onClose={() => setIsInventoryOpen(false)}
        userId={user.id}
        inventory={user.inventory || []}
      />

      <PokemonRosterModal
        isOpen={isRosterOpen}
        onClose={() => setIsRosterOpen(false)}
        userId={user.id}
        pokemons={user.pokemons || []}
        activePokemonId={user.activePokemonId}
      />
    </div>
  );
}
