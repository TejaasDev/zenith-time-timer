
import React, { useState, useEffect } from 'react';
import WorldMap from './WorldMap';
import ClockList from './ClockList';
import AddCityModal from './AddCityModal';
import CalendarWidget from './CalendarWidget';
import SolarWidget from './SolarWidget';
import { CityData } from '../utils/cities';
import { format } from 'date-fns';

interface WorldClockViewProps {
    theme: 'light' | 'dark';
}

const INITIAL_CITIES: CityData[] = [
    { name: "Paris", timezone: "Europe/Paris", country: "France", coordinates: [2.3522, 48.8566] },
    { name: "New York", timezone: "America/New_York", country: "USA", coordinates: [-74.006, 40.7128] },
    { name: "Dubai", timezone: "Asia/Dubai", country: "UAE", coordinates: [55.2708, 25.2048] },
    { name: "Tokyo", timezone: "Asia/Tokyo", country: "Japan", coordinates: [139.6917, 35.6895] },
];

const WorldClockView: React.FC<WorldClockViewProps> = ({ theme }) => {
    const [cities, setCities] = useState<CityData[]>(INITIAL_CITIES);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const removeCity = (name: string) => {
        setCities(prev => prev.filter(c => c.name !== name));
    };

    const addCity = (city: CityData) => {
        setCities(prev => [...prev, city]);
        setIsAddModalOpen(false);
    };

    const isDark = theme === 'dark';

    return (
        <div className={`w-full h-full flex flex-col md:flex-row gap-6 p-6 md:p-10 animate-fade-in transition-all duration-700 ${isDark ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
            <AddCityModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSelectCity={addCity}
                existingCityNames={cities.map(c => c.name)}
                theme={theme}
            />

            {/* Left Sidebar: City Cards - 1/3 width */}
            <div className="w-full md:w-1/3 flex flex-col h-full overflow-hidden">
                <div className="mb-8 flex flex-col">
                    <h2 className={`text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Planet Clock</h2>
                    <p className={`text-sm mt-2 font-bold opacity-60 uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Keep track of time around the world
                    </p>
                </div>
                <div className="flex-1 min-h-0">
                    <ClockList
                        cities={cities}
                        onRemove={removeCity}
                        onAddClick={() => setIsAddModalOpen(true)}
                        theme={theme}
                    />
                </div>
            </div>

            {/* Center & Right: Dashboard Main Area - 2/3 width */}
            <div className="w-full md:w-2/3 flex flex-col h-full gap-6">

                {/* Top Header / Search Placeholder */}
                <div className="flex justify-between items-center px-4">
                    <div className={`flex items-center space-x-2 px-6 py-3 rounded-2xl border ${isDark ? 'bg-slate-800 border-white/5 text-white/50' : 'bg-white border-slate-200 text-slate-400'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                        <span className="text-xs font-bold uppercase tracking-widest">Dashboard</span>
                    </div>

                    <div className="flex items-center space-x-3">
                        <button className={`p-3 rounded-2xl border transition-all ${isDark ? 'bg-slate-800 border-white/5 text-white hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-900 hover:bg-slate-50 shadow-sm'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>
                        </button>
                        <button className={`p-3 rounded-2xl border transition-all ${isDark ? 'bg-slate-800 border-white/5 text-white hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-900 hover:bg-slate-50 shadow-sm'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>
                        </button>
                    </div>
                </div>

                {/* Main Large Clock Section */}
                <div className="flex-1 relative flex items-center justify-center p-8">
                    <div className="absolute inset-0 z-0">
                        <WorldMap cities={cities} theme={theme} />
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                        <p className={`text-[12px] font-black uppercase tracking-[0.5em] mb-4 ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                            United Kingdom <span className="ml-2 font-bold">⌄</span>
                        </p>
                        <h1 className={`text-[12vw] md:text-[10vw] font-black tracking-tighter tabular-nums leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {format(now, 'HH:mm:ss')}
                        </h1>
                        <div className="mt-8 flex items-center space-x-6">
                            <div className="flex flex-col items-center">
                                <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-white/30' : 'text-slate-400'}`}>Time Zone</span>
                                <span className={`text-sm font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>UTC +0</span>
                            </div>
                            <div className="h-8 w-px bg-slate-500/20"></div>
                            <div className="flex flex-col items-center">
                                <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-white/30' : 'text-slate-400'}`}>Current Local Time</span>
                                <span className={`text-sm font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{format(now, 'EEE, HH:mm')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Widgets */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-auto">
                    <CalendarWidget theme={theme} />
                    <SolarWidget theme={theme} />
                </div>
            </div>
        </div>
    );
};

export default WorldClockView;
