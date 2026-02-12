
import React, { useState, useEffect } from 'react';
import WorldMap from './WorldMap';
import ClockList from './ClockList';
import AddCityModal from './AddCityModal';
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

            {/* Sidebar: City List */}
            <div className="w-full md:w-1/3 flex flex-col h-full overflow-hidden">
                <div className="mb-8 flex flex-col">
                    <h2 className={`text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>World Clock</h2>
                    <p className={`text-sm mt-2 font-bold opacity-60 uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Current time across the globe
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

            {/* Main Area: Large Display & Map */}
            <div className="w-full md:w-2/3 flex flex-col h-full relative">
                <div className="flex-1 relative flex items-center justify-center p-8">
                    <div className="absolute inset-0 z-0 opacity-40">
                        <WorldMap cities={cities} theme={theme} />
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                        <p className={`text-[12px] font-black uppercase tracking-[0.5em] mb-4 ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                            {format(now, 'EEEE, MMMM d')}
                        </p>
                        <h1 className={`text-[12vw] md:text-[8vw] font-black tracking-tighter tabular-nums leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {format(now, 'HH:mm:ss')}
                        </h1>
                        <div className="mt-8 flex items-center space-x-6">
                            <div className="flex flex-col items-center text-center">
                                <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-white/30' : 'text-slate-400'}`}>Global Dashboard</span>
                                <span className={`text-sm font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{cities.length} Active Clocks</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorldClockView;
