
import React, { useState, useEffect, useCallback, useRef } from 'react';
import TimerDial from './components/TimerDial';
import LandingPage from './components/LandingPage';
import CalendarView from './components/CalendarView';
import { TimerStatus, TimerMode, AppView } from './types';
import { PlayIcon, PauseIcon, RotateCcwIcon, TimerIcon, CalendarIcon, GlobeIcon, PipIcon, StopwatchIcon, MenuIcon, HomeIcon } from './constants';
import WorldClockView from './components/WorldClockView';
import LoginPage from './components/LoginPage';
import { TIMER_END_SOUND } from './utils/sound';

type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showApp, setShowApp] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>(AppView.TIMER);

  // Independent state for each mode
  const [timeStates, setTimeStates] = useState({
    [TimerMode.TIMER]: { seconds: 0, status: TimerStatus.IDLE, initial: 0 },
    [TimerMode.STOPWATCH]: { seconds: 0, status: TimerStatus.IDLE, initial: 0 }
  });

  const [mode, setMode] = useState<TimerMode>(TimerMode.TIMER);
  const [isPipActive, setIsPipActive] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isPresenceMode, setIsPresenceMode] = useState(() => {
    return localStorage.getItem('zenith_presence_mode') === 'true';
  });

  // Derived state for rendering
  const activeState = timeStates[mode];
  const remainingSeconds = activeState.seconds;
  const status = activeState.status;

  const [theme, setTheme] = useState<Theme>(() => {
    const hour = new Date().getHours();
    return (hour >= 6 && hour < 18) ? 'light' : 'dark';
  });

  const lastTickRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  const pipVideoRef = useRef<HTMLVideoElement | null>(null);
  const pipCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Ref holds the entire state map to avoid closure staleness in tick
  const tickStateRef = useRef({ mode, timeStates });

  // AudioContext ref to persist across renders and be unlocked by user interaction
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    tickStateRef.current = { mode, timeStates };
  }, [mode, timeStates]);



  const tickStatePresenceRef = useRef(isPresenceMode);
  useEffect(() => {
    tickStatePresenceRef.current = isPresenceMode;
  }, [isPresenceMode]);

  const updatePipCanvas = useCallback(() => {
    const canvas = pipCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Read directly from ref for latest render data
    const { mode: currentMode, timeStates: currentStates } = tickStateRef.current;
    const currentState = currentStates[currentMode];
    const seconds = currentState.seconds;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 100;

    ctx.fillStyle = theme === 'dark' ? '#0f172a' : '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 15, 0, Math.PI * 2);
    ctx.stroke();

    const accentColor = currentMode === TimerMode.STOPWATCH ? '#3b82f6' : '#ef4444';
    ctx.fillStyle = accentColor;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    const startAngle = -Math.PI / 2;
    const progress = Math.min(seconds / 3600, 1);
    const endAngle = startAngle + (progress * (Math.PI * 2));
    ctx.arc(centerX, centerY, radius, startAngle, endAngle, false);
    ctx.lineTo(centerX, centerY);
    ctx.fill();

    ctx.fillStyle = theme === 'dark' ? '#0f172a' : '#ffffff';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 32, 0, Math.PI * 2);
    ctx.fill();

    if (mode === TimerMode.TIMER && !tickStatePresenceRef.current) {
      ctx.fillStyle = theme === 'dark' ? '#ffffff' : '#0f172a';
      ctx.font = 'bold 50px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const m = Math.floor(seconds / 60);
      const s = Math.floor(seconds % 60);
      ctx.fillText(`${m}:${s.toString().padStart(2, '0')}`, centerX, centerY);
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('zenith_presence_mode', String(isPresenceMode));
    if (isPipActive) updatePipCanvas();
  }, [isPresenceMode, isPipActive, updatePipCanvas]);


  const playTimerFinishedSound = useCallback(() => {
    try {
      const AudioContextCtor = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextCtor) return;

      let ctx = audioCtxRef.current;
      if (!ctx) {
        ctx = new AudioContextCtor();
        audioCtxRef.current = ctx;
      }

      // Ensure context is running (it might be suspended if created without gesture, or suspended by browser)
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.5); // Drop to A4

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.error("Failed to play sound", e);
    }
  }, []);

  const tick = useCallback((timestamp: number) => {
    if (!lastTickRef.current) {
      lastTickRef.current = timestamp;
      animationFrameRef.current = requestAnimationFrame(tick);
      return;
    }
    const deltaTime = (timestamp - lastTickRef.current) / 1000;
    lastTickRef.current = timestamp;

    const { mode: currentMode, timeStates: currentStates } = tickStateRef.current;
    const currentState = currentStates[currentMode];

    if (currentState.status === TimerStatus.RUNNING) {
      let nextSeconds = currentState.seconds;
      let nextStatus: TimerStatus = currentState.status;
      let shouldPlaySound = false;

      if (currentMode === TimerMode.TIMER) {
        nextSeconds = Math.max(0, currentState.seconds - deltaTime);
        if (nextSeconds <= 0) {
          nextSeconds = 0;
          nextStatus = TimerStatus.FINISHED;
          shouldPlaySound = true;
        }
      } else {
        nextSeconds = Math.min(3600, currentState.seconds + deltaTime);
        if (nextSeconds >= 3600) nextStatus = TimerStatus.FINISHED;
      }

      if (shouldPlaySound) {
        playTimerFinishedSound();
      }

      setTimeStates(prev => ({
        ...prev,
        [currentMode]: { ...prev[currentMode], seconds: nextSeconds, status: nextStatus }
      }));
    }

    if (isPipActive) updatePipCanvas();
    animationFrameRef.current = requestAnimationFrame(tick);
  }, [isPipActive, updatePipCanvas, playTimerFinishedSound]);

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(tick);
    return () => { if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current); };
  }, [tick]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handleSetTime = (seconds: number) => {
    if (mode === TimerMode.STOPWATCH) return;

    setTimeStates(prev => {
      const current = prev[TimerMode.TIMER];
      const newStatus = (current.status === TimerStatus.FINISHED || current.status === TimerStatus.IDLE)
        ? TimerStatus.IDLE
        : current.status;

      return {
        ...prev,
        [TimerMode.TIMER]: {
          ...current,
          seconds: seconds,
          initial: seconds,
          status: newStatus
        }
      };
    });
  };

  const toggleTimer = useCallback(() => {
    // Initialize/Resume AudioContext on user gesture (Play/Pause)
    if (!audioCtxRef.current) {
      const AudioContextCtor = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextCtor) {
        audioCtxRef.current = new AudioContextCtor();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    setTimeStates(prev => {
      const current = prev[mode];
      if (mode === TimerMode.TIMER && current.seconds <= 0 && current.status !== TimerStatus.RUNNING) return prev;

      const newStatus = current.status === TimerStatus.RUNNING ? TimerStatus.PAUSED : TimerStatus.RUNNING;
      return {
        ...prev,
        [mode]: { ...current, status: newStatus }
      };
    });
  }, [mode]);

  const resetTimer = useCallback(() => {
    setTimeStates(prev => {
      const current = prev[mode];
      return {
        ...prev,
        [mode]: {
          ...current,
          status: TimerStatus.IDLE,
          seconds: mode === TimerMode.TIMER ? current.initial : 0
        }
      };
    });
  }, [mode]);

  const togglePip = async () => {
    const video = pipVideoRef.current;
    const canvas = pipCanvasRef.current;
    if (!video || !canvas || !('pictureInPictureEnabled' in document)) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        return;
      }

      updatePipCanvas();

      if (!streamRef.current) {
        // @ts-ignore
        const stream = canvas.captureStream ? canvas.captureStream(30) : (canvas as any).mozCaptureStream?.(30);
        if (!stream) throw new Error("Stream capture failed");
        streamRef.current = stream;
        video.srcObject = stream;

        await new Promise((resolve) => {
          if (video.readyState >= 1) resolve(true);
          else video.onloadedmetadata = () => resolve(true);
        });
      }

      await video.play();
      await video.requestPictureInPicture();
      setIsPipActive(true);
    } catch (err) {
      console.error("Zenith PiP Failure:", err);
      setIsPipActive(false);
    }
  };

  useEffect(() => {
    const handlePipExit = () => setIsPipActive(false);
    const video = pipVideoRef.current;
    if (video) {
      video.addEventListener('leavepictureinpicture', handlePipExit);
      return () => video.removeEventListener('leavepictureinpicture', handlePipExit);
    }
  }, []);

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  if (!showApp) {
    return <LandingPage onLaunch={() => setShowApp(true)} isDark={theme === 'dark'} toggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')} />;
  }

  const isDark = theme === 'dark';

  return (
    <div className={`flex flex-col md:flex-row h-screen overflow-hidden transition-all duration-700 ${isDark ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>

      {/* --- DESKTOP SIDEBAR --- */}
      <aside className={`hidden md:flex w-20 flex-col items-center py-6 border-r transition-colors duration-500 z-[200] ${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'}`}>

        {/* Brand/Logo Section */}
        <div className="mb-10">
          <button
            onClick={() => setShowApp(false)}
            className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20 transition-transform active:scale-95 hover:scale-105"
            title="Go Back to Home"
          >
            <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
          </button>
        </div>

        {/* Main Nav Section */}
        <div className="flex-1 flex flex-col space-y-8">
          <button
            onClick={() => setCurrentView(AppView.TIMER)}
            className={`relative p-3 rounded-2xl transition-all hover:scale-105 active:scale-95 ${currentView === AppView.TIMER ? (isDark ? 'text-red-400' : 'text-red-600') : (isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600')}`}
          >
            <TimerIcon />
            {currentView === AppView.TIMER && <div className="absolute top-1/2 -right-1 w-1.5 h-1.5 bg-red-500 rounded-full -translate-y-1/2"></div>}
          </button>

          <button
            onClick={() => setCurrentView(AppView.CALENDAR)}
            className={`relative p-3 rounded-2xl transition-all hover:scale-105 active:scale-95 ${currentView === AppView.CALENDAR ? (isDark ? 'text-red-400' : 'text-red-600') : (isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600')}`}
          >
            <CalendarIcon />
            {currentView === AppView.CALENDAR && <div className="absolute top-1/2 -right-1 w-1.5 h-1.5 bg-red-500 rounded-full -translate-y-1/2"></div>}
          </button>

          <button
            onClick={() => setCurrentView(AppView.WORLD_CLOCK)}
            className={`relative p-3 rounded-2xl transition-all hover:scale-105 active:scale-95 ${currentView === AppView.WORLD_CLOCK ? (isDark ? 'text-red-400' : 'text-red-600') : (isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600')}`}
          >
            <GlobeIcon />
            {currentView === AppView.WORLD_CLOCK && <div className="absolute top-1/2 -right-1 w-1.5 h-1.5 bg-red-500 rounded-full -translate-y-1/2"></div>}
          </button>
        </div>

        {/* Bottom Utils Section */}
        <div className="flex flex-col space-y-8 mt-auto">
          <button
            onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
            className={`p-3 rounded-2xl transition-all hover:scale-110 active:scale-90 ${isDark ? 'text-slate-500 hover:text-yellow-400' : 'text-slate-400 hover:text-slate-900'}`}
          >
            {isDark ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
            )}
          </button>

          <button
            onClick={() => setShowApp(false)}
            className={`p-3 rounded-2xl transition-all hover:scale-110 active:scale-90 ${isDark ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}
            title="Go Back to Home"
          >
            <HomeIcon />
          </button>
        </div>
      </aside>

      {/* --- CONTENT AREA --- */}
      <main className="flex-1 relative flex flex-col items-center justify-center p-6 md:p-12 lg:p-20 pb-28 md:pb-12 overflow-y-auto overflow-x-hidden">
        {currentView === AppView.TIMER ? (
          <div className="flex flex-col items-center space-y-8 md:space-y-12 animate-fade-in w-full max-w-4xl">

            {/* Timer/Stopwatch Toggle */}
            <div className="flex items-center p-1 rounded-full bg-slate-500/10 border border-slate-500/20 backdrop-blur-md scale-90 md:scale-100 origin-center">
              <button onClick={() => setMode(TimerMode.TIMER)} className={`px-8 md:px-10 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${mode === TimerMode.TIMER ? 'bg-red-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-700'}`}>Timer</button>
              <button onClick={() => setMode(TimerMode.STOPWATCH)} className={`px-8 md:px-10 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${mode === TimerMode.STOPWATCH ? 'bg-blue-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-700'}`}>Stopwatch</button>
            </div>

            {/* Dial Display - Scaled for Responsive Design */}
            <div className="scale-[0.85] sm:scale-100 md:scale-110 lg:scale-125 xl:scale-100 transform-gpu relative transition-transform duration-700">
              <TimerDial remainingSeconds={remainingSeconds} onSetTime={handleSetTime} isInteractive={status !== TimerStatus.RUNNING} theme={theme} mode={mode} isPresenceMode={isPresenceMode && mode === TimerMode.TIMER} />

              {/* Presence View / Cancel Toggle Overlay */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center space-x-3">
                {mode === TimerMode.TIMER && (
                  <button
                    onClick={() => setIsPresenceMode(true)}
                    className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${isPresenceMode
                      ? 'bg-slate-900 border-slate-900 text-white shadow-lg'
                      : (isDark ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900 shadow-sm')}`}
                  >
                    Presence View
                  </button>
                )}
                {mode === TimerMode.TIMER && isPresenceMode && (
                  <button
                    onClick={() => setIsPresenceMode(false)}
                    className="px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all bg-red-500 text-white shadow-lg shadow-red-500/20 hover:bg-red-600"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center space-x-8 md:space-x-12 scale-95 md:scale-110 transition-transform">
              <button onClick={resetTimer} className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all active:scale-90 border ${isDark ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-white border-slate-200 text-slate-500 shadow-sm'}`}><RotateCcwIcon /></button>
              <button onClick={toggleTimer} className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 shadow-xl ${status === TimerStatus.RUNNING ? (isDark ? 'bg-slate-100 text-slate-900' : 'bg-slate-900 text-white') : (mode === TimerMode.TIMER ? 'bg-red-500 text-white' : 'bg-blue-500 text-white')}`}>{status === TimerStatus.RUNNING ? <PauseIcon /> : <PlayIcon />}</button>
              <button onClick={togglePip} className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all active:scale-90 border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'} ${isPipActive ? 'text-red-500 border-red-500/50' : (isDark ? 'text-slate-400' : 'text-slate-500')}`}><PipIcon /></button>
            </div>

            {/* Digital Readout */}
            {(!isPresenceMode || mode !== TimerMode.TIMER) && (
              <div className="flex flex-col items-center">
                <span className={`text-6xl md:text-8xl font-black tracking-tight tabular-nums leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {Math.floor(remainingSeconds / 60)}:{Math.floor(remainingSeconds % 60).toString().padStart(2, '0')}
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mt-6">Remaining Duration</span>
              </div>
            )}
          </div>
        ) : currentView === AppView.CALENDAR ? (
          <CalendarView isDark={isDark} />
        ) : (
          <WorldClockView theme={theme} />
        )}

        {/* Off-screen buffers */}
        <canvas ref={pipCanvasRef} width="300" height="300" className="opacity-0 pointer-events-none absolute -left-[9999px]" />
        <video ref={pipVideoRef} autoPlay playsInline muted className="opacity-0 pointer-events-none absolute -left-[9999px]" />
      </main>

      {/* --- MOBILE BOTTOM NAV --- */}
      <nav className={`fixed bottom-0 left-0 right-0 h-20 md:hidden flex justify-around items-center px-4 border-t transition-all duration-500 z-[200] backdrop-blur-2xl ${isDark ? 'bg-[#0f172a]/60 border-white/10 shadow-[0_-8px_32px_0_rgba(0,0,0,0.2)]' : 'bg-white/60 border-white/20 shadow-[0_-8px_32px_0_rgba(31,38,135,0.05)]'}`}>
        <button
          onClick={() => setCurrentView(AppView.TIMER)}
          className={`flex flex-col items-center space-y-1 transition-all active:scale-95 ${currentView === AppView.TIMER ? (isDark ? 'text-red-400' : 'text-red-600') : (isDark ? 'text-slate-500' : 'text-slate-400')}`}
        >
          <TimerIcon />
          <span className="text-[10px] font-bold uppercase tracking-wide">Timer</span>
        </button>

        <button
          onClick={() => setCurrentView(AppView.CALENDAR)}
          className={`flex flex-col items-center space-y-1 transition-all active:scale-95 ${currentView === AppView.CALENDAR ? (isDark ? 'text-red-400' : 'text-red-600') : (isDark ? 'text-slate-500' : 'text-slate-400')}`}
        >
          <CalendarIcon />
          <span className="text-[10px] font-bold uppercase tracking-wide">Calendar</span>
        </button>

        <button
          onClick={() => setCurrentView(AppView.WORLD_CLOCK)}
          className={`flex flex-col items-center space-y-1 transition-all active:scale-95 ${currentView === AppView.WORLD_CLOCK ? (isDark ? 'text-red-400' : 'text-red-600') : (isDark ? 'text-slate-500' : 'text-slate-400')}`}
        >
          <GlobeIcon />
          <span className="text-[10px] font-bold uppercase tracking-wide">World</span>
        </button>

        <button
          onClick={() => setShowApp(false)}
          className={`flex flex-col items-center space-y-1 transition-all active:scale-95 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}
        >
          <HomeIcon />
          <span className="text-[10px] font-bold uppercase tracking-wide">Home</span>
        </button>
      </nav>

      <style>{`
        .animate-fade-in { animation: fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default App;
