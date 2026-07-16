import { Heart, Moon, CloudRain, ShieldAlert } from "lucide-react";

interface MoodIndicatorProps {
  mood: string;
}

export function MoodIndicator({ mood }: MoodIndicatorProps) {
  const getMoodConfig = () => {
    switch (mood) {
      case "happy":
        return { icon: Heart, label: "Happy", color: "text-rose-400", bg: "bg-rose-400/10", border: "border-rose-400/20" };
      case "sad":
        return { icon: CloudRain, label: "Sad", color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" };
      case "sick":
        return { icon: ShieldAlert, label: "Sick", color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/20" };
      case "idle":
      default:
        return { icon: Moon, label: "Idle", color: "text-zinc-400", bg: "bg-white/5", border: "border-white/10" };
    }
  };

  const config = getMoodConfig();
  const Icon = config.icon;

  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md shadow-sm">
      <Icon className={`w-3.5 h-3.5 ${config.color}`} />
      <span className="text-[11px] font-medium tracking-wide text-white/80">
        {config.label}
      </span>
    </div>
  );
}
