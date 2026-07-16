"use client";

import { useState } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, startOfWeek, endOfWeek, isBefore, startOfDay } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MultiDatePickerProps {
  selectedDates: Date[];
  onChange: (dates: Date[]) => void;
}

export function MultiDatePicker({ selectedDates, onChange }: MultiDatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const daysInMonth = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth))
  });

  const toggleDate = (date: Date) => {
    const isSelected = selectedDates.some(d => isSameDay(d, date));
    if (isSelected) {
      onChange(selectedDates.filter(d => !isSameDay(d, date)));
    } else {
      onChange([...selectedDates, date].sort((a, b) => a.getTime() - b.getTime()));
    }
  };

  const today = startOfDay(new Date());

  return (
    <div className="bg-black/40 border border-white/10 p-4 rounded-xl shadow-inner select-none">
      <div className="flex justify-between items-center mb-4">
        <button type="button" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1 hover:bg-white/10 rounded-full transition-colors text-zinc-400">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-sm font-semibold text-white tracking-wide">
          {format(currentMonth, "MMMM yyyy")}
        </span>
        <button type="button" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1 hover:bg-white/10 rounded-full transition-colors text-zinc-400">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2 text-center">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {daysInMonth.map((day, i) => {
          const isSelected = selectedDates.some(d => isSameDay(d, day));
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isPast = isBefore(day, today);
          
          return (
            <button
              key={i}
              type="button"
              disabled={isPast}
              onClick={() => toggleDate(day)}
              className={`
                aspect-square rounded-full flex items-center justify-center text-xs font-medium transition-all
                ${!isCurrentMonth ? 'opacity-30' : ''}
                ${isPast ? 'opacity-20 cursor-not-allowed text-zinc-600' : 'hover:bg-white/10 cursor-pointer'}
                ${isSelected ? 'bg-emerald-500 text-black shadow-[0_0_10px_rgba(16,185,129,0.3)] hover:bg-emerald-400 opacity-100' : 'text-zinc-300'}
              `}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
      
      {selectedDates.length > 0 && (
        <div className="mt-4 pt-3 border-t border-white/10 text-xs text-zinc-400 flex justify-between items-center">
          <span>{selectedDates.length} date{selectedDates.length !== 1 ? 's' : ''} selected</span>
          <button type="button" onClick={() => onChange([])} className="text-emerald-400 hover:text-emerald-300 underline">Clear</button>
        </div>
      )}
    </div>
  );
}
