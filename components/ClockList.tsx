
import React, { useEffect, useState } from 'react';
import { formatInTimeZone } from 'date-fns-tz';

interface City {
    name: string;
    timezone: string;
    country: string;
}

interface ClockListProps {
    cities: City[];
    onRemove: (name: string) => void;
    onAddClick: () => void;
    theme: 'light' | 'dark';
}

const ClockList: React.FC<ClockListProps> = ({ cities, onRemove, onAddClick, theme }) => {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const isDark = theme === 'dark';

    return (
        <div className={`flex flex-col space-y-3 h-full overflow-y-auto pr-2 custom-scrollbar`}>
            {cities.map((city) => {
                const timeString = formatInTimeZone(now, city.timezone, 'HH:mm');
                const utcOffset = formatInTimeZone(now, city.timezone, 'xxx');

                return (
                    <div
                        key={city.name}
                        className={`group relative p-6 rounded-3xl transition-all duration-300 border ${isDark ? 'border-white/5 bg-slate-900/50 hover:bg-slate-900' : 'border-slate-100 bg-white hover:border-slate-200 shadow-sm'
                            }`}
                    >
                        <div className="flex justify-between items-center">
                            <div className="flex flex-col">
                                <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    {city.name}
                                </p>
                                <span className={`text-3xl font-black tracking-tighter mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    {timeString}
                                </span>
                            </div>

                            <div className="flex items-center space-x-4">
                                <span className={`px-2 py-1 rounded-lg text-[9px] font-black tracking-widest uppercase border ${isDark ? 'bg-white/5 border-white/10 text-white/50' : 'bg-slate-50 border-slate-200 text-slate-400'
                                    }`}>
                                    UTC {utcOffset}
                                </span>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onRemove(city.name); }}
                                    className="p-2 rounded-xl bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Add Button */}
            <button
                onClick={onAddClick}
                className={`w-full py-4 rounded-3xl border-2 border-dashed flex items-center justify-center transition-all ${isDark ? 'border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300' : 'border-slate-200 text-slate-400 hover:border-red-200 hover:text-red-500 shadow-sm'
                    }`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
                <span className="font-black text-[10px] uppercase tracking-widest">Add City</span>
            </button>

            <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: ${isDark ? '#334155' : '#cbd5e1'}; border-radius: 10px; }
      `}</style>
        </div>
    );
};

export default ClockList;
