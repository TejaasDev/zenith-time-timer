
import React from 'react';

export const MAX_MINUTES = 60;
export const TICK_COLOR = '#94a3b8'; // slate-400
export const PRIMARY_COLOR = '#ef4444'; // red-500 (Timer)
export const STOPWATCH_COLOR = '#3b82f6'; // blue-500 (Stopwatch)
export const SECONDARY_COLOR = '#f8fafc'; // slate-50

export const MARK_INTERVALS = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

const IconBase = ({ children }: { children?: React.ReactNode }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-300">
    {children}
  </svg>
);

export const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>
);

export const PauseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
);

export const RotateCcwIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
);

export const TimerIcon = () => (
  <IconBase>
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </IconBase>
);

export const CalendarIcon = () => (
  <IconBase>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </IconBase>
);

export const StopwatchIcon = () => (
  <IconBase>
    <circle cx="12" cy="13" r="8" /><path d="M12 9v4l2 2" /><path d="M12 2v3" /><path d="M17 2l-2 2" /><path d="M7 2l2 2" />
  </IconBase>
);

export const PipIcon = () => (
  <IconBase>
    <path d="M15 12h5V7h-5v5z" /><path d="M19 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2" />
  </IconBase>
);

export const MenuIcon = () => (
  <IconBase>
    <line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="18" x2="20" y2="18" />
  </IconBase>
);

export const GlobeIcon = () => (
  <IconBase>
    <circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </IconBase>
);

export const HomeIcon = () => (
  <IconBase>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
  </IconBase>
);
