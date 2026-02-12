
import React from 'react';

interface SolarWidgetProps {
    theme: 'light' | 'dark';
}

const SolarWidget: React.FC<SolarWidgetProps> = ({ theme }) => {
    // Mock data for solar info - in a real app these would be calculated based on location
    const sunrise = "06:03";
    const sunset = "18:14";
    const dayLength = "12 h 11 min";

    const isDark = theme === 'dark';

    return (
        <div className={`relative p-6 rounded-[2.5rem] flex flex-col justify-between h-48 w-full transition-all duration-500 hover:scale-[1.02] shadow-xl ${isDark ? 'bg-[#facc15] text-slate-900' : 'bg-[#fef08a] text-slate-900'
            }`}>
            <div className="flex justify-between items-start">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-4">Sun</span>
                    <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-slate-900 rounded-full"></div>
                        <span className="text-2xl font-black tracking-tighter">{sunrise}</span>
                    </div>
                </div>
                <div className="p-3 bg-white/40 rounded-full backdrop-blur-md">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></svg>
                </div>
            </div>

            <div className="flex justify-between items-end">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Duration</span>
                    <span className="text-xs font-bold">{dayLength}</span>
                </div>
                <span className="text-3xl font-black tracking-tighter">{sunset}</span>
            </div>
        </div>
    );
};

export default SolarWidget;
