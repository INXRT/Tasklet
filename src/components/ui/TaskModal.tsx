"use client";

import { useState, useTransition, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { createTask, createRecurringTasks } from "@/actions/task";
import { MultiDatePicker } from "@/components/ui/MultiDatePicker";
import { createPortal } from "react-dom";
import { ScaleWrapper } from "@/components/ui/ScaleWrapper";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export function TaskModal({ isOpen, onClose, userId }: TaskModalProps) {
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("60");
  const [repeatMode, setRepeatMode] = useState<"NONE" | "DAILY" | "WEEKLY" | "CUSTOM">("NONE");
  const [occurrences, setOccurrences] = useState("7");
  const [customDates, setCustomDates] = useState<Date[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    
    let hours = "12", minutes = "00";
    if (time) {
      [hours, minutes] = time.split(":");
    }

    let targetDates: Date[] = [];
    
    if (repeatMode === "CUSTOM") {
      if (customDates.length === 0) return;
      targetDates = customDates.map(d => {
        const clone = new Date(d);
        clone.setHours(Number(hours), Number(minutes));
        return clone;
      });
    } else {
      if (!date) return;
      const [year, month, day] = date.split("-");
      const baseDate = new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes));
      
      if (repeatMode === "NONE") {
        targetDates = [baseDate];
      } else if (repeatMode === "DAILY") {
        for (let i = 0; i < Number(occurrences); i++) {
          targetDates.push(new Date(baseDate.getTime() + i * 24 * 60 * 60 * 1000));
        }
      } else if (repeatMode === "WEEKLY") {
        for (let i = 0; i < Number(occurrences); i++) {
          targetDates.push(new Date(baseDate.getTime() + i * 7 * 24 * 60 * 60 * 1000));
        }
      }
    }

    startTransition(() => {
      if (targetDates.length === 1 && repeatMode === "NONE") {
        createTask(userId, title, targetDates[0], Number(duration)).then(() => resetForm());
      } else {
        createRecurringTasks(userId, title, targetDates, Number(duration), repeatMode).then(() => resetForm());
      }
    });
  };

  const resetForm = () => {
    onClose();
    setTitle("");
    setDate("");
    setTime("");
    setDuration("60");
    setRepeatMode("NONE");
    setOccurrences("7");
    setCustomDates([]);
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <ScaleWrapper targetWidth={1280} targetHeight={800} padding={24}>
              <div className="w-full h-full flex items-center justify-center pointer-events-none">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.5 }}
                  className="w-full max-w-md p-8 rounded-[2rem] bg-[#0c0c0e] border border-white/10 shadow-2xl pointer-events-auto"
                >
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-serif text-white tracking-tight">New Schedule</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Directive</label>
                      <input 
                        type="text" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                        placeholder="e.g. Study algorithms"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Repeat Mode</label>
                      <div className="flex bg-white/5 rounded-xl p-1 border border-white/10 mb-4">
                        {["NONE", "DAILY", "WEEKLY", "CUSTOM"].map((mode) => (
                          <button
                            key={mode}
                            type="button"
                            onClick={() => setRepeatMode(mode as any)}
                            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
                              repeatMode === mode ? "bg-white text-black shadow-sm" : "text-zinc-400 hover:text-white hover:bg-white/5"
                            }`}
                          >
                            {mode.charAt(0) + mode.slice(1).toLowerCase()}
                          </button>
                        ))}
                      </div>
                    </div>

                    {repeatMode === "CUSTOM" ? (
                      <div>
                        <label className="block font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Select Dates</label>
                        <MultiDatePicker selectedDates={customDates} onChange={setCustomDates} />
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-2">
                            {repeatMode === "NONE" ? "Date" : "Start Date"}
                          </label>
                          <input 
                            type="date" 
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                            required
                          />
                        </div>
                        {repeatMode !== "NONE" && (
                          <div>
                            <label className="block font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Occurrences</label>
                            <input 
                              type="number" 
                              value={occurrences}
                              onChange={(e) => setOccurrences(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                              min="1"
                              max="365"
                              required
                            />
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Time (Optional)</label>
                        <input 
                          type="time" 
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Duration (Minutes)</label>
                        <input 
                          type="number" 
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                          min="1"
                        />
                      </div>
                    </div>

                    <button 
                      type="submit"
                      disabled={isPending}
                      className={`w-full py-4 rounded-xl font-medium tracking-wide transition-all ${
                        isPending ? "bg-white/20 text-white/50 cursor-not-allowed" : "bg-white text-black hover:bg-zinc-200 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                      }`}
                    >
                      {isPending ? "Initializing..." : "Commit Directive"}
                    </button>
                  </form>
                </motion.div>
              </div>
            </ScaleWrapper>
          </div>
        </div>
      )}
    </AnimatePresence>
  );

  return mounted ? createPortal(modalContent, document.body) : null;
}
