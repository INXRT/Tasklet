"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Calendar as CalendarIcon, List, Plus, Activity, Coins, CheckCircle, Circle } from "lucide-react";
import { format } from "date-fns";
import { TaskModal } from "@/components/ui/TaskModal";
import { CalendarView } from "@/components/ui/CalendarView";
import { toggleTaskCompletion } from "@/actions/task";
import { Companion3D } from "@/components/ui/Companion3D";

export function DashboardClient({ user }: { user: any }) {
  const [view, setView] = useState<"calendar" | "list">("list");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleToggleTask = (id: string, currentStatus: boolean) => {
    toggleTaskCompletion(id, currentStatus);
  };

  return (
    <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 h-full min-h-[85vh]">
      
      {/* Sidebar: Stats & Companion */}
      <div className="lg:col-span-4 flex flex-col gap-8">
        
        {/* Companion Viewer */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="rounded-[2rem] bg-white/[0.02] border border-white/[0.05] p-6 relative overflow-hidden flex flex-col items-center shadow-lg h-[450px]"
        >
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
          
          <div className="flex justify-between w-full mb-4 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-mono tracking-widest text-zinc-400 uppercase shadow-sm">
              <Activity className="w-3 h-3 text-emerald-400" />
              <span>Status: Stable</span>
            </div>
          </div>
          
          <div className="relative w-full flex-1 rounded-2xl overflow-hidden bg-black/20 border border-white/5 z-10 flex items-center justify-center shadow-inner">
            <Companion3D type={user.selectedCompanion || "DRAGON"} />
          </div>

          <div className="w-full flex justify-between items-end mt-6 z-10">
            <div>
              <h2 className="text-3xl font-serif text-white tracking-tight capitalize">{user.selectedCompanion?.toLowerCase() || "Dragon"}</h2>
              <p className="font-mono text-xs text-zinc-500 mt-1">LVL 1 • EXP: 0/100</p>
            </div>
            <div className="flex items-center gap-2 text-amber-400/90 bg-amber-400/10 px-3 py-1.5 rounded-xl border border-amber-400/20">
              <Coins className="w-4 h-4" />
              <span className="font-mono text-lg">{user.coins}</span>
            </div>
          </div>
        </motion.div>

        {/* Stats Bento */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="rounded-[2rem] bg-white/[0.02] border border-white/[0.05] p-8 relative overflow-hidden shadow-lg flex-1"
        >
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
          
          <h3 className="font-mono text-xs tracking-widest text-zinc-500 mb-6 uppercase">Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-zinc-500 text-sm mb-1 font-medium">Tasks Done</p>
              <p className="text-4xl font-serif text-white/90">
                {user.tasks.filter((t: any) => t.isCompleted).length}
              </p>
            </div>
            <div>
              <p className="text-zinc-500 text-sm mb-1 font-medium">Pending</p>
              <p className="text-4xl font-serif text-white/90">
                {user.tasks.filter((t: any) => !t.isCompleted).length}
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
        className="lg:col-span-8 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] p-8 relative overflow-hidden shadow-lg flex flex-col"
      >
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8 relative z-10 border-b border-white/5 pb-6">
          <div>
            <h1 className="text-4xl font-serif text-white tracking-tight mb-2">Schedule</h1>
            <p className="font-mono text-xs tracking-widest text-zinc-500 uppercase">
              {format(new Date(), "MMMM do, yyyy")}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center p-1 rounded-full bg-white/5 border border-white/5 hidden md:flex">
              <button 
                onClick={() => setView("calendar")}
                className={`p-2.5 rounded-full transition-colors ${view === "calendar" ? "bg-white/10 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                <CalendarIcon className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setView("list")}
                className={`p-2.5 rounded-full transition-colors ${view === "list" ? "bg-white/10 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-white/90 hover:bg-white text-black rounded-full shadow-lg transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span className="font-medium text-sm">New Task</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative z-10 overflow-y-auto pr-2 custom-scrollbar">
          {view === "list" ? (
            <div className="space-y-3">
              {user.tasks.length === 0 ? (
                <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-zinc-500 border border-white/5 border-dashed rounded-[1.5rem]">
                  <p className="font-serif text-xl mb-2 text-zinc-400">No tasks scheduled.</p>
                  <p className="font-mono text-[10px] uppercase tracking-widest">Awaiting input</p>
                </div>
              ) : (
                user.tasks.map((task: any) => (
                  <div 
                    key={task.id} 
                    className={`p-5 rounded-[1.25rem] border transition-all duration-300 flex justify-between items-center group hover:-translate-y-0.5 ${
                      task.isCompleted 
                        ? "border-emerald-500/10 bg-emerald-500/[0.02] opacity-70" 
                        : "border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 hover:shadow-lg"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => handleToggleTask(task.id, task.isCompleted)}
                        className={`transition-colors ${task.isCompleted ? "text-emerald-400" : "text-zinc-600 group-hover:text-zinc-300"}`}
                      >
                        {task.isCompleted ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                      </button>
                      <div>
                        <h4 className={`text-lg font-medium tracking-tight ${task.isCompleted ? "text-emerald-200/50 line-through" : "text-white/90"}`}>
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-3 mt-1.5">
                          <p className="text-[11px] text-zinc-500 font-medium tracking-wide">{format(new Date(task.dueDate), "MMM do, h:mm a")}</p>
                          <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
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
            <div className="h-full min-h-[400px] rounded-2xl overflow-hidden border border-white/5 bg-white/[0.01]">
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
    </div>
  );
}
