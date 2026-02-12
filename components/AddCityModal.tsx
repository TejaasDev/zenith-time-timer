import React, { useState, useMemo } from 'react';
import { POPULAR_CITIES, CityData } from '../utils/cities';

interface AddCityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectCity: (city: CityData) => void;
    existingCityNames: string[];
    theme: 'light' | 'dark';
}

const AddCityModal: React.FC<AddCityModalProps> = ({ isOpen, onClose, onSelectCity, existingCityNames, theme }) => {
    const [search, setSearch] = useState('');

    const filteredCities = useMemo(() => {
        const term = search.toLowerCase();
        return POPULAR_CITIES.filter(
            city =>
                (city.name.toLowerCase().includes(term) || city.country.toLowerCase().includes(term)) &&
                !existingCityNames.includes(city.name)
        );
    }, [search, existingCityNames]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
            <div className={`relative w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-200 ${theme === 'dark' ? 'bg-slate-900 border border-white/10' : 'bg-white'}`}>

                {/* Header */}
                <div className={`p-6 border-b ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Add City</h2>
                        <button onClick={onClose} className={`p-2 rounded-full hover:bg-slate-500/10 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                        </button>
                    </div>

                    <div className={`flex items-center px-4 py-3 rounded-xl border transition-colors ${theme === 'dark' ? 'bg-slate-800 border-transparent focus-within:border-blue-500' : 'bg-slate-50 border-slate-200 focus-within:border-blue-500'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`mr-3 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                        <input
                            type="text"
                            placeholder="Search city or country..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            autoFocus
                            className={`bg-transparent w-full outline-none text-sm font-medium ${theme === 'dark' ? 'text-white placeholder:text-slate-500' : 'text-slate-900 placeholder:text-slate-400'}`}
                        />
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-2">
                    {filteredCities.length > 0 ? (
                        <div className="space-y-1">
                            {filteredCities.map((city) => (
                                <button
                                    key={city.name}
                                    onClick={() => onSelectCity(city)}
                                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-all text-left group ${theme === 'dark'
                                            ? 'hover:bg-slate-800 text-slate-300 hover:text-white'
                                            : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'
                                        }`}
                                >
                                    <div>
                                        <div className="font-bold">{city.name}</div>
                                        <div className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{city.country}</div>
                                    </div>
                                    <div className={`opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold px-3 py-1.5 rounded-lg ${theme === 'dark' ? 'bg-white/10 text-white' : 'bg-slate-200 text-slate-700'}`}>
                                        Add
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-40 text-center px-6">
                            <p className={`text-sm ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                                No matching cities found. Try searching for a major city name.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddCityModal;
