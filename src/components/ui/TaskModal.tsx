"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { createTask } from "@/actions/task";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) return;

    const [year, month, day] = date.split("-");
    let hours = "12", minutes = "00";
    if (time) {
      [hours, minutes] = time.split(":");
    }

    const dueDate = new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes));

    startTransition(() => {
      createTask(userId, title, dueDate, Number(duration)).then(() => {
        onClose();
        setTitle("");
        setDate("");
        setTime("");
        setDuration("60");
      });
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 p-8 rounded-[2rem] bg-[#0c0c0e] border border-white/10 shadow-2xl"
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
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Date</label>
                  <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Time (Optional)</label>
                  <input 
                    type="time" 
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
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
        </>
      )}
    </AnimatePresence>
  );
}
