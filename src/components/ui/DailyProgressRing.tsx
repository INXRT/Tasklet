import { motion } from "framer-motion";
import { Flame } from "lucide-react";

export function DailyProgressRing({ completed, total, streak }: { completed: number; total: number; streak: number }) {
  const percentage = total === 0 ? 0 : (completed / total) * 100;
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex items-center gap-4 bg-black/20 rounded-full py-1.5 px-3 border border-white/5 shadow-inner">
      {/* Streak */}
      <div className="flex items-center gap-1.5 px-2">
        <Flame className={`w-4 h-4 ${streak > 0 ? "text-orange-500" : "text-zinc-600"}`} />
        <span className="font-mono text-xs font-medium text-white">{streak} Day{streak !== 1 ? 's' : ''}</span>
      </div>

      <div className="w-px h-6 bg-white/10" />

      {/* Progress Ring */}
      <div className="flex items-center gap-3 px-2">
        <div className="relative w-10 h-10 flex items-center justify-center">
          <svg className="w-10 h-10 transform -rotate-90">
            <circle
              className="text-white/10"
              strokeWidth="3"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="20"
              cy="20"
            />
            <motion.circle
              className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]"
              strokeWidth="3"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="20"
              cy="20"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ type: "spring", stiffness: 60, damping: 20 }}
            />
          </svg>
          <span className="absolute text-[10px] font-mono font-bold text-white">{completed}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">Daily Quests</span>
          <span className="text-xs text-white/80">{completed} of {total} Done</span>
        </div>
      </div>
    </div>
  );
}
