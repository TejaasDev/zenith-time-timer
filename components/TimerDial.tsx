
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { getAngleFromPoint, getArcPath } from '../utils/geometry';
import { MARK_INTERVALS, MAX_MINUTES, PRIMARY_COLOR, STOPWATCH_COLOR } from '../constants';
import { TimerMode } from '../types';

interface TimerDialProps {
  remainingSeconds: number;
  onSetTime: (seconds: number) => void;
  isInteractive: boolean;
  onDragChange?: (isDragging: boolean) => void;
  theme: 'light' | 'dark';
  mode: TimerMode;
  isPresenceMode?: boolean;
}

const TimerDial: React.FC<TimerDialProps> = ({ remainingSeconds, onSetTime, isInteractive, onDragChange, theme, mode, isPresenceMode = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const requestRef = useRef<number | null>(null);

  const setDraggingState = useCallback((dragging: boolean) => {
    setIsDragging(dragging);
    onDragChange?.(dragging);
  }, [onDragChange]);

  const updateFromPointer = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current || mode === TimerMode.STOPWATCH) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angle = getAngleFromPoint(clientX, clientY, centerX, centerY);
    const minutes = (angle / 360) * MAX_MINUTES;
    onSetTime(Math.round(minutes * 60));
  }, [onSetTime, mode]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isInteractive || mode === TimerMode.STOPWATCH) return;
    setDraggingState(true);
    updateFromPointer(e.clientX, e.clientY);
    // @ts-ignore
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    if (requestRef.current !== null) cancelAnimationFrame(requestRef.current);
    const { clientX, clientY } = e;
    requestRef.current = requestAnimationFrame(() => {
      updateFromPointer(clientX, clientY);
      requestRef.current = null;
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setDraggingState(false);
    // @ts-ignore
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const currentMinutes = remainingSeconds / 60;
  const radius = 140;
  const arcPath = getArcPath(currentMinutes, radius);
  const isDark = theme === 'dark';
  const activeColor = mode === TimerMode.STOPWATCH ? (isDark ? '#60a5fa' : STOPWATCH_COLOR) : (isDark ? '#f87171' : PRIMARY_COLOR);

  return (
    <div
      ref={containerRef}
      className={`relative w-[85vw] h-[85vw] max-w-80 max-h-80 md:max-w-[32rem] md:max-h-[32rem] md:w-[32rem] md:h-[32rem] rounded-full select-none transition-all duration-700 dial-inner-shadow flex items-center justify-center ${isDark ? 'bg-slate-800' : 'bg-white'} ${isDragging ? 'no-transition' : ''}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{ touchAction: 'none' }}
    >
      <svg viewBox="-160 -160 320 320" className={`w-full h-full ${isDragging ? 'no-transition' : ''}`}>
        <circle cx="0" cy="0" r="150" fill={isDark ? "#1e293b" : "#ffffff"} stroke={isDark ? "#334155" : "#e2e8f0"} strokeWidth="1" />
        {!isPresenceMode && Array.from({ length: 60 }).map((_, i) => {
          const angle = (i / 60) * 360;
          const isMajor = i % 5 === 0;
          return (
            <line
              key={i} x1="0" y1={-150} x2="0" y2={-150 + (isMajor ? 14 : 7)}
              stroke={isMajor ? (isDark ? "#94a3b8" : "#64748b") : (isDark ? "#475569" : "#cbd5e1")}
              strokeWidth={isMajor ? 2.5 : 1}
              transform={`rotate(${angle})`}
            />
          );
        })}
        {!isPresenceMode && MARK_INTERVALS.map((m) => {
          const angle = (m / 60) * 360;
          const radians = ((angle - 90) * Math.PI) / 180;
          const r = 115;
          const x = r * Math.cos(radians);
          const y = r * Math.sin(radians);
          return (
            <text key={m} x={x} y={y} fill={isDark ? "#94a3b8" : "#475569"} fontSize="15" fontWeight="600" textAnchor="middle" dominantBaseline="middle" className="font-sans pointer-events-none">{m === 0 ? 60 : m}</text>
          );
        })}
        <path d={arcPath} fill={activeColor} className={`${isDragging ? '' : 'transition-all duration-[16ms] linear'}`} style={{ opacity: 0.95 }} />
        <circle cx="0" cy="0" r="5" fill={isDark ? "#cbd5e1" : "#334155"} />
      </svg>
      {isInteractive && mode !== TimerMode.STOPWATCH && (
        <div
          className={`absolute w-12 h-12 rounded-full flex items-center justify-center z-30 transition-all ${isDragging ? 'scale-115 shadow-2xl no-transition' : 'scale-100 shadow-md'} ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-200'} border-[2.5px]`}
          style={{
            left: '50%', top: '50%', transformOrigin: 'center center',
            transform: `translate(-50%, -50%) rotate(${(remainingSeconds / 3600) * 360}deg) translateY(-145px)`,
            cursor: 'grab',
            transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <div className={`w-2.5 h-2.5 rounded-full ${isDark ? 'bg-red-500' : 'bg-red-600'}`}></div>
        </div>
      )}
    </div>
  );
};

export default TimerDial;
