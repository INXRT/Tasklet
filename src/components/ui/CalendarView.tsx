import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, startOfMonth, endOfMonth, isSameMonth } from "date-fns";

export function CalendarView({ tasks, selectedDate = new Date() }: { tasks: any[], selectedDate?: Date }) {
  const today = new Date();
  const start = startOfWeek(startOfMonth(selectedDate));
  const end = endOfWeek(endOfMonth(selectedDate));
  
  const days = eachDayOfInterval({ start, end });

  return (
    <div className="w-full h-full flex flex-col">
      <div className="grid grid-cols-7 gap-px bg-white/5 border-b border-white/5">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <div key={day} className="px-2 py-3 text-center text-xs font-mono tracking-widest text-zinc-500 uppercase">
            {day}
          </div>
        ))}
      </div>
      
      <div className="flex-1 grid grid-cols-7 grid-rows-5 gap-px bg-white/5">
        {days.map((day, i) => {
          const dayTasks = tasks.filter(t => isSameDay(new Date(t.dueDate), day));
          const isCurrentMonth = isSameMonth(day, selectedDate);
          const isToday = isSameDay(day, today);
          
          return (
            <div 
              key={i} 
              className={`min-h-[100px] p-2 bg-[#0c0c0e] hover:bg-white/[0.02] transition-colors relative ${!isCurrentMonth ? "opacity-30" : ""}`}
            >
              <span className={`text-sm font-serif ${isToday ? "flex h-7 w-7 items-center justify-center rounded-full bg-white text-black" : "text-zinc-500"}`}>
                {format(day, "d")}
              </span>
              
              <div className="mt-2 space-y-1">
                {dayTasks.slice(0, 3).map(task => (
                  <div 
                    key={task.id} 
                    className={`text-[10px] font-mono truncate px-1.5 py-1 rounded-sm border ${
                      task.isCompleted 
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                        : "bg-white/5 border-white/10 text-zinc-300"
                    }`}
                  >
                    {format(new Date(task.dueDate), "HH:mm")} - {task.title}
                  </div>
                ))}
                {dayTasks.length > 3 && (
                  <div className="text-[10px] font-mono text-zinc-500 px-1">
                    +{dayTasks.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
