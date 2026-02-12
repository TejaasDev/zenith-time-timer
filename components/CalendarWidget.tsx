
import React from 'react';
import { format, getWeek } from 'date-fns';

interface CalendarWidgetProps {
    theme: 'light' | 'dark';
}

const CalendarWidget: React.FC<CalendarWidgetProps> = ({ theme }) => {
    const now = new Date();
    const dayName = format(now, 'EEE');
    const monthDay = format(now, 'MMMM d');
    const year = format(now, 'yyyy');
    const weekNumber = getWeek(now);

    const isDark = theme === 'dark';

    return (
        <div className={`relative p-6 rounded-[2.5rem] flex flex-col justify-between h-48 w-full transition-all duration-500 hover:scale-[1.02] shadow-xl ${isDark ? 'bg-[#f47b49] text-white' : 'bg-[#fe805c] text-white'
            }`}>
            <div className="flex justify-between items-start">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">Today</span>
                <button className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                </button>
            </div>

            <div className="flex flex-col">
                <h2 className="text-3xl font-black tracking-tight leading-none">
                    {dayName}, {monthDay}
                </h2>
            </div>

            <div className="flex justify-between items-end">
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Week {weekNumber}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">{year}</span>
            </div>
        </div>
    );
};

export default CalendarWidget;
