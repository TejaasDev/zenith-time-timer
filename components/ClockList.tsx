
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

// Map city names to assets if available
const CITY_ASSETS: Record<string, string> = {
    "Paris": "/assets/paris.png",
    "New York": "/assets/new_york.png",
    "Tokyo": "/assets/tokyo.png",
};

const ClockList: React.FC<ClockListProps> = ({ cities, onRemove, onAddClick, theme }) => {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const isDark = theme === 'dark';

    return (
        <div className={`flex flex-col space-y-4 h-full overflow-y-auto pr-2 custom-scrollbar`}>
            {cities.map((city) => {
                const timeString = formatInTimeZone(now, city.timezone, 'HH:mm');
                const utcOffset = formatInTimeZone(now, city.timezone, 'xxx');
                const hasAsset = !!CITY_ASSETS[city.name];

                return (
                    <div
                        key={city.name}
                        className={`group relative h-48 rounded-[2.5rem] transition-all duration-500 hover:scale-[1.02] overflow-hidden border ${isDark ? 'border-white/5 bg-slate-900' : 'border-slate-100 bg-white shadow-sm'
                            }`}
                    >
                        {/* Background Image/Fallback */}
                        {hasAsset ? (
                            <>
                                <img
                                    src={CITY_ASSETS[city.name]}
                                    alt={city.name}
                                    className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/60"></div>
                            </>
                        ) : (
                            <div className={`absolute inset-0 transition-colors duration-500 ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}></div>
                        )}

                        {/* Card Content */}
                        <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${hasAsset || isDark ? 'text-white/70' : 'text-slate-400'}`}>
                                        {city.name}
                                    </p>
                                    <div className="mt-1 flex items-center space-x-2">
                                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black tracking-widest uppercase border ${hasAsset || isDark ? 'bg-white/10 border-white/20 text-white' : 'bg-slate-100 border-slate-200 text-slate-500'
                                            }`}>
                                            UTC {utcOffset}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={(e) => { e.stopPropagation(); onRemove(city.name); }}
                                    className="p-1.5 rounded-xl bg-white/10 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 text-white"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                </button>
                            </div>

                            <div className="flex flex-col">
                                <span className={`text-5xl font-black tracking-tighter leading-none ${hasAsset || isDark ? 'text-white' : 'text-slate-900'}`}>
                                    {timeString}
                                </span>
                            </div>
                        </div>

                        {/* Favorite Star Overlay (Placeholder from design) */}
                        <div className="absolute top-6 right-12">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={city.name === "Paris" ? "#fbbf24" : "none"} stroke={city.name === "Paris" ? "#fbbf24" : "white"} strokeWidth="2" className="opacity-60"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                        </div>
                    </div>
                );
            })}

            {/* Add Button */}
            <button
                onClick={onAddClick}
                className={`w-full min-h-[80px] rounded-[2.5rem] border-2 border-dashed flex items-center justify-center transition-all ${isDark ? 'border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300' : 'border-slate-200 text-slate-400 hover:border-red-200 hover:text-red-500'
                    }`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
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
