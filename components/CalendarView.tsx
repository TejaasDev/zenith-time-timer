
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { CalendarEvent } from '../types';

interface CalendarViewProps {
  isDark: boolean;
}

// Helper for consistent local date string YYYY-MM-DD
const getLocalDateString = (date: Date) => {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const CalendarView: React.FC<CalendarViewProps> = ({ isDark }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [liveTime, setLiveTime] = useState(new Date());
  const addEventInputRef = useRef<HTMLInputElement>(null);

  // Persistent Events State
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('zenith_calendar_events');
    const today = getLocalDateString(new Date());

    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    } else {
      return [
        { id: '1', title: 'Deep Work Session', time: '08:00 AM - 10:00 AM', date: today, color: '#ef4444' },
        { id: '2', title: 'Creative Focus', time: '02:00 PM - 04:00 PM', date: today, color: '#3b82f6' }
      ];
    }
  });

  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', time: '' });

  useEffect(() => {
    localStorage.setItem('zenith_calendar_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    const timer = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (showAddEvent && addEventInputRef.current) {
      addEventInputRef.current.focus();
    }
  }, [showAddEvent]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handleDayClick = (day: number) => {
    const newDate = new Date(year, month, day);
    setSelectedDate(newDate);
  };

  const handleDayKeyDown = (e: React.KeyboardEvent, day: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleDayClick(day);
    }
  };

  const selectedDateStr = useMemo(() => {
    return getLocalDateString(selectedDate);
  }, [selectedDate]);

  const filteredEvents = useMemo(() => {
    return events.filter(e => e.date === selectedDateStr);
  }, [events, selectedDateStr]);

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(year, month + offset, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(today);
  };

  const handleAddEvent = () => {
    if (!newEvent.title) return;
    const event: CalendarEvent = {
      id: Date.now().toString(),
      title: newEvent.title,
      time: newEvent.time || 'All Day',
      date: selectedDateStr,
      color: ['#ef4444', '#3b82f6', '#10b981', '#f59e0b'][Math.floor(Math.random() * 4)]
    };
    setEvents([...events, event]);
    setNewEvent({ title: '', time: '' });
    setShowAddEvent(false);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const renderDays = () => {
    const days = [];
    const totalDays = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const todayStr = getLocalDateString(new Date());

    // Padding for first week
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`pad-${i}`} className="h-14 md:h-16 lg:h-20" role="presentation"></div>);
    }

    for (let day = 1; day <= totalDays; day++) {
      const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const dayEvents = events.filter(e => e.date === dateStr);
      const isSelected = selectedDateStr === dateStr;
      const isToday = todayStr === dateStr;

      days.push(
        <div
          key={day}
          role="gridcell"
          aria-selected={isSelected}
          tabIndex={0}
          onClick={() => handleDayClick(day)}
          onKeyDown={(e) => handleDayKeyDown(e, day)}
          className={`relative h-14 md:h-16 lg:h-20 flex flex-col items-center justify-center rounded-xl md:rounded-2xl transition-all cursor-pointer group outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 ${isDark ? 'focus-visible:ring-offset-[#111827]' : 'focus-visible:ring-offset-white'}`}
          aria-label={`${new Date(year, month, day).toLocaleDateString()} - ${dayEvents.length} events`}
        >
          <div className={`w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-full transition-all duration-300
            ${isSelected ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]' :
              isToday ? (isDark ? 'border-2 border-red-500 text-red-400 font-bold' : 'border-2 border-red-600 text-red-600 font-bold') :
                (isDark ? 'text-slate-300 hover:text-white hover:bg-white/5' : 'text-slate-800 hover:text-black hover:bg-slate-50')}`}>
            <span className="text-sm md:text-base font-medium">{day}</span>
          </div>
          <div className="absolute bottom-1 flex space-x-0.5 md:space-x-1 h-1">
            {dayEvents.slice(0, 3).map((e, idx) => (
              <div key={idx} className="w-1 h-1 rounded-full" style={{ backgroundColor: e.color }}></div>
            ))}
          </div>
        </div>
      );
    }
    return days;
  };

  const bgClass = isDark ? 'bg-[#0b101b]' : 'bg-[#f0f3f6]';
  const cardClass = isDark ? 'bg-[#111827] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5' : 'bg-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-slate-100';
  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className={`w-full h-full flex flex-col items-center justify-start p-4 md:p-8 lg:p-12 overflow-y-auto no-scrollbar ${bgClass}`}>
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 h-auto">

        {/* SIDEBAR SECTION - Stacked on Mobile */}
        <div className="lg:col-span-4 flex flex-col space-y-4 lg:space-y-8 lg:h-full order-2 lg:order-1">

          {/* Live Flow Card */}
          <div className={`p-6 lg:p-8 rounded-[2rem] lg:rounded-[3rem] flex items-center space-x-6 shrink-0 ${cardClass}`}>
            <div className={`w-12 h-12 lg:w-16 lg:h-16 rounded-2xl lg:rounded-3xl flex items-center justify-center text-2xl lg:text-3xl shadow-inner ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
              <span className="grayscale contrast-125" role="img" aria-label="Clock">⏱️</span>
            </div>
            <div>
              <p className={`text-[10px] uppercase font-black tracking-[0.3em] mb-1 ${textSecondary}`}>Live Flow</p>
              <h2 className={`text-xl lg:text-2xl font-bold tracking-tight ${textPrimary}`}>
                {liveTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </h2>
            </div>
          </div>

          {/* Planned Focus Card */}
          <section className={`flex-1 p-6 md:p-8 lg:p-10 rounded-[2.5rem] lg:rounded-[4rem] flex flex-col overflow-hidden min-h-[350px] md:min-h-[450px] lg:min-h-0 ${cardClass}`} aria-labelledby="planned-focus-heading">
            <h3 id="planned-focus-heading" className={`text-xl lg:text-2xl font-bold mb-6 lg:mb-10 tracking-tight ${textPrimary}`}>Planned Focus</h3>

            <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 lg:space-y-6 pr-2">
              {filteredEvents.length > 0 ? filteredEvents.map(event => (
                <div key={event.id} className={`group p-4 lg:p-6 rounded-[1.5rem] lg:rounded-[2rem] flex items-center justify-between transition-all hover:translate-x-1 ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-50 hover:bg-slate-100'}`}>
                  <div className="flex items-center space-x-4 lg:space-x-5 overflow-hidden">
                    <div className="w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: event.color }}></div>
                    <div className="overflow-hidden">
                      <p className={`text-xs lg:text-sm font-bold truncate ${textPrimary}`}>{event.title}</p>
                      <p className={`text-[10px] font-medium uppercase tracking-wider opacity-50 ${textSecondary}`}>{event.time}</p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteEvent(event.id); }}
                    className={`p-2 rounded-xl transition-all opacity-100 lg:opacity-0 lg:group-hover:opacity-100 focus:opacity-100 outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${isDark ? 'text-slate-500 hover:text-red-400 hover:bg-red-400/10' : 'text-slate-300 hover:text-red-500 hover:bg-red-50'}`}
                    aria-label={`Delete ${event.title}`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>
              )) : (
                <div className="h-full flex flex-col items-center justify-center opacity-30 italic py-6 lg:py-10">
                  <p className={`text-xs ${textSecondary}`}>No sessions for this date</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowAddEvent(true)}
              className="mt-6 lg:mt-10 w-full py-4 lg:py-6 rounded-[2rem] lg:rounded-[2.5rem] bg-red-500 hover:bg-red-400 text-white font-black text-[10px] lg:text-xs uppercase tracking-[0.25em] shadow-2xl shadow-red-500/20 active:scale-[0.98] transition-all outline-none focus-visible:ring-4 focus-visible:ring-red-500/30"
            >
              Add Focus Event
            </button>
          </section>
        </div>

        {/* CALENDAR GRID SECTION - On Top for Mobile */}
        <section className={`lg:col-span-8 p-5 md:p-12 lg:p-16 rounded-[3rem] lg:rounded-[5rem] flex flex-col h-auto order-1 lg:order-2 ${cardClass}`} aria-label="Calendar month view">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 lg:mb-16 space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 lg:space-x-6 w-full md:w-auto justify-between md:justify-start">
              <h3 className={`text-2xl lg:text-3xl font-bold tracking-tighter cursor-pointer hover:opacity-70 transition-opacity ${textPrimary}`} onClick={goToToday}>
                {currentDate.toLocaleString('default', { month: 'long' })} <span className="opacity-30 font-light">{currentDate.getFullYear()}</span>
              </h3>
              <button
                onClick={goToToday}
                className={`flex md:hidden text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border transition-all active:scale-95 ${isDark ? 'border-white/10 text-slate-400 hover:text-white hover:bg-white/5' : 'border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
              >
                Today
              </button>
            </div>

            <div className="flex items-center justify-between w-full md:w-auto space-x-4">
              <button
                onClick={goToToday}
                className={`hidden md:block text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border transition-all active:scale-95 ${isDark ? 'border-white/10 text-slate-400 hover:text-white hover:bg-white/5' : 'border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
              >
                Today
              </button>
              <div className="flex space-x-2 lg:space-x-4 ml-auto">
                <button
                  onClick={() => changeMonth(-1)}
                  aria-label="Previous month"
                  className={`p-3 lg:p-4 rounded-2xl transition-all outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-50 text-slate-900'} active:scale-90`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="15 18 9 12 15 6" /></svg>
                </button>
                <button
                  onClick={() => changeMonth(1)}
                  aria-label="Next month"
                  className={`p-3 lg:p-4 rounded-2xl transition-all outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-50 text-slate-900'} active:scale-90`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="9 18 15 12 9 6" /></svg>
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-7 gap-y-2 lg:gap-y-4" role="grid">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((dayName, i) => (
              <div key={i} className={`text-center text-[10px] font-black tracking-[0.3em] opacity-20 mb-2 lg:mb-6 ${textPrimary}`} role="columnheader">
                {dayName}
              </div>
            ))}
            {renderDays()}
          </div>
        </section>
      </div>

      {/* Add Event Modal */}
      {showAddEvent && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className={`w-full max-w-md p-8 lg:p-12 rounded-[3rem] lg:rounded-[4rem] shadow-2xl ${isDark ? 'bg-[#1e293b] border border-white/5' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-8 lg:mb-10">
              <h3 id="modal-title" className={`text-xl lg:text-2xl font-bold tracking-tight ${textPrimary}`}>Schedule Focus</h3>
              <p className={`text-[10px] font-bold ${textSecondary}`} aria-label="Scheduled date">{selectedDateStr}</p>
            </div>
            <div className="space-y-6 lg:space-y-8">
              <div className="space-y-2 lg:space-y-3">
                <label htmlFor="event-title" className={`text-[10px] font-black uppercase tracking-widest opacity-40 ${textPrimary}`}>Session Name</label>
                <input
                  id="event-title"
                  type="text"
                  ref={addEventInputRef}
                  value={newEvent.title}
                  onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                  onKeyDown={e => e.key === 'Enter' && handleAddEvent()}
                  className={`w-full p-4 lg:p-5 rounded-[1.5rem] border outline-none transition-all focus:ring-2 focus:ring-red-500/50 ${isDark ? 'bg-slate-900 border-white/10 text-white focus:border-red-500/50' : 'bg-slate-50 border-slate-100 text-slate-900 focus:border-red-500'}`}
                  placeholder="e.g., Deep Work"
                />
              </div>
              <div className="space-y-2 lg:space-y-3">
                <label htmlFor="event-time" className={`text-[10px] font-black uppercase tracking-widest opacity-40 ${textPrimary}`}>Time Frame</label>
                <input
                  id="event-time"
                  type="text"
                  value={newEvent.time}
                  onChange={e => setNewEvent({ ...newEvent, time: e.target.value })}
                  onKeyDown={e => e.key === 'Enter' && handleAddEvent()}
                  className={`w-full p-4 lg:p-5 rounded-[1.5rem] border outline-none transition-all focus:ring-2 focus:ring-red-500/50 ${isDark ? 'bg-slate-900 border-white/10 text-white focus:border-red-500/50' : 'bg-slate-50 border-slate-100 text-slate-900 focus:border-red-500'}`}
                  placeholder="e.g., 09:00 AM - 10:00 AM"
                />
              </div>
              <div className="flex space-x-4 lg:space-x-6 pt-6 lg:pt-8">
                <button onClick={() => setShowAddEvent(false)} className={`flex-1 py-4 lg:py-5 font-bold transition-colors outline-none focus-visible:underline ${isDark ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}>Cancel</button>
                <button onClick={handleAddEvent} className="flex-1 py-4 lg:py-5 rounded-[2rem] bg-red-500 hover:bg-red-400 text-white font-bold shadow-xl shadow-red-500/30 active:scale-95 transition-all outline-none focus-visible:ring-4 focus-visible:ring-red-500/40">Schedule</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
};

export default CalendarView;
