"use client";

import { useState, useTransition, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { createTask, createRecurringTasks, updateTask } from "@/actions/task";
import { MultiDatePicker } from "@/components/ui/MultiDatePicker";
import { createPortal } from "react-dom";
import { ScaleWrapper } from "@/components/ui/ScaleWrapper";

import { format } from "date-fns";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  initialData?: any;
  defaultDate?: Date;
}

export function TaskModal({ isOpen, onClose, userId, initialData, defaultDate }: TaskModalProps) {
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

  // Pre-fill form when editing
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title);
        setDuration(initialData.duration.toString());
        
        const d = new Date(initialData.dueDate);
        setDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
        setTime(`${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`);
        
        setRepeatMode("NONE"); // Only edit single instance as discussed
        setCustomDates([]);
      } else {
        const d = defaultDate || new Date();
        setDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
      }
    }
  }, [initialData, isOpen, defaultDate]);

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
      if (initialData) {
        // Edit mode
        updateTask(initialData.id, {
          title,
          dueDate: targetDates[0],
          duration: Number(duration)
        }).then(() => resetForm());
      } else {
        // Create mode
        if (targetDates.length === 1 && repeatMode === "NONE") {
          createTask(userId, title, targetDates[0], Number(duration)).then(() => resetForm());
        } else {
          createRecurringTasks(userId, title, targetDates, Number(duration), repeatMode).then(() => resetForm());
        }
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
              <div className="w-full h-full flex items-center justify-center pointer-events-none p-4 md:p-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  className="w-full max-w-md p-8 rounded-[2rem] bg-[#0c0c0e] border border-white/10 shadow-2xl pointer-events-auto"
                >
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h2 className="text-3xl font-serif text-white tracking-tight drop-shadow-sm">
                        {initialData ? "Edit Task" : "New Task"}
                      </h2>
                      <p className="text-zinc-400 text-sm">
                        {initialData ? "Make changes to your task." : "What do you need to get done?"}
                      </p>
                    </div>
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
                    <div className="space-y-4">
                    {!initialData && (
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">Repeat Mode</label>
                        <div className="flex gap-2">
                          {["NONE", "DAILY", "WEEKLY", "CUSTOM"].map((mode) => (
                            <button
                              key={mode}
                              type="button"
                              onClick={() => setRepeatMode(mode as any)}
                              className={`flex-1 py-2 text-xs font-medium rounded-xl border transition-colors ${
                                repeatMode === mode 
                                  ? "bg-white/10 border-white/20 text-white" 
                                  : "bg-transparent border-white/5 text-zinc-500 hover:text-zinc-300 hover:border-white/10"
                              }`}
                            >
                              {mode}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {repeatMode === "CUSTOM" && !initialData ? (
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
                        {repeatMode !== "NONE" && !initialData && (
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
                    </div>
                    
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
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 text-black rounded-xl transition-all active:scale-95 skeumorphic-btn hover:brightness-110 font-medium disabled:opacity-50"
                      style={{ background: 'linear-gradient(180deg, #ffffff 0%, #e0e0e0 100%)' }}
                    >
                      {isPending ? "Saving..." : (initialData ? "Save Changes" : "Create Task")}
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
