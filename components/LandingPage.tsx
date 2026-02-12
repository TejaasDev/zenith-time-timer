
import React, { useState } from 'react';
const flowerIcon = '/assets/flower_icon.png';

interface LandingPageProps {
  onLaunch: () => void;
  isDark: boolean;
  toggleTheme: () => void;
}

type Tab = 'home' | 'features' | 'about';

const LandingPage: React.FC<LandingPageProps> = ({ onLaunch, isDark, toggleTheme }) => {
  const [activeTab, setActiveTab] = useState<Tab>('home');

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-1000 ${isDark ? 'bg-[#0f172a] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>

      {/* --- NAVIGATION --- */}
      <nav className={`fixed top-0 w-full z-50 backdrop-blur-2xl border-b transition-all duration-500 ${isDark ? 'bg-[#0f172a]/60 border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]' : 'bg-white/60 border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => setActiveTab('home')}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-red-500' : 'bg-red-600'}`}>
              <div className="w-4 h-4 rounded-full bg-white opacity-20 animate-pulse"></div>
            </div>
            <span className="text-xl font-bold tracking-tight">Zenith</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => setActiveTab('home')}
              className={`text-sm font-medium transition-colors ${activeTab === 'home' ? (isDark ? 'text-white' : 'text-slate-900') : (isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900')}`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={`text-sm font-medium transition-colors ${activeTab === 'features' ? (isDark ? 'text-white' : 'text-slate-900') : (isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900')}`}
            >
              Features
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`text-sm font-medium transition-colors ${activeTab === 'about' ? (isDark ? 'text-white' : 'text-slate-900') : (isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900')}`}
            >
              About
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <button onClick={toggleTheme} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'}`}>
              {isDark ? <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>}
            </button>
            <button onClick={onLaunch} className={`px-5 py-2 rounded-full text-sm font-bold transition-all transform active:scale-95 ${isDark ? 'bg-white text-slate-900 hover:bg-slate-200' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>Try Now</button>
          </div>
        </div>

        {/* Mobile Tab Bar (Top) - Optional, or rely on Bottom Bar in App? 
            Since LandingPage is full screen, it needs its own nav. 
            For now, we keep the simple top nav with "Home" icon acting as reset.
            Ideally, we add a simple mobile menu or tabs here too.
        */}
        <div className={`flex md:hidden justify-around border-t py-2 text-xs font-semibold tracking-wide uppercase transition-all duration-500 ${isDark ? 'bg-[#0f172a]/60 border-white/5' : 'bg-white/60 border-slate-100'}`}>
          <button onClick={() => setActiveTab('home')} className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'home' ? 'text-red-500 bg-red-500/10' : 'opacity-50'}`}>Home</button>
          <button onClick={() => setActiveTab('features')} className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'features' ? 'text-red-500 bg-red-500/10' : 'opacity-50'}`}>Features</button>
          <button onClick={() => setActiveTab('about')} className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'about' ? 'text-red-500 bg-red-500/10' : 'opacity-50'}`}>About</button>
        </div>
      </nav>

      {/* --- CONTENT AREA --- */}
      <main className="flex-1 pt-32 pb-20 animate-fade-in">

        {/* === HOME VIEW === */}
        {activeTab === 'home' && (
          <div className="animate-fade-in-up">
            {/* HERO */}
            <header className="pt-8 pb-12 md:pt-24 md:pb-32 px-6 flex flex-col items-center text-center max-w-6xl mx-auto space-y-6 md:space-y-12">
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-9xl font-black tracking-tight leading-[1.05]">
                A simple, visual <br className="hidden sm:block" /> way to <span className={`italic font-serif ${isDark ? 'text-red-400' : 'text-red-600'}`}>understand</span> time.
              </h1>
              <p className={`text-base sm:text-lg md:text-2xl max-w-3xl leading-relaxed opacity-90 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Zenith is a premium digital clock system designed to make time visible, intentional, and effortless—eliminating the abstract and replacing it with clarity.
              </p>
              <div>
                <button onClick={onLaunch} className={`group relative px-8 py-3 md:px-10 md:py-4 rounded-full text-base md:text-lg font-bold transition-all transform hover:scale-105 active:scale-95 shadow-xl ${isDark ? 'bg-red-500 text-white hover:bg-red-400' : 'bg-red-600 text-white hover:bg-red-700'}`}>
                  Try Zenith Now
                </button>
              </div>
            </header>

            {/* PROBLEM SECTION */}
            <section className={`py-16 md:py-20 px-6 ${isDark ? 'bg-slate-900/30' : 'bg-slate-100/50'}`}>
              <div className="max-w-4xl mx-auto space-y-12 md:space-y-16">
                <div className="text-center space-y-6">
                  <h2 className="text-2xl md:text-5xl font-bold">Time is everywhere. <br /> Understanding it isn’t.</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
                  <div className="space-y-6 md:space-y-10 text-base sm:text-lg md:text-xl font-medium leading-relaxed opacity-90">
                    <p>Standard digital clocks are abstract numbers. They tell you <span className="font-bold italic">when</span> you are, but not <span className="font-bold italic">how much</span> you have left.</p>
                    <p>Zenith changes the perspective, turning time into a physical-feeling volume that you can actually see diminishing.</p>
                  </div>
                  <div className="flex flex-col justify-center space-y-6 border-l-4 border-red-500/20 pl-6 md:border-none md:pl-0">
                    <p className={`text-xl md:text-2xl font-serif italic ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>"Most clock apps tell time—but don’t help you see it."</p>
                    <div className={`hidden md:block h-1 w-20 rounded-full ${isDark ? 'bg-red-500' : 'bg-red-600'}`}></div>
                    <p className="font-bold text-lg md:text-xl">Zenith exists to fix that.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* WHY DIFFERENT */}
            <section className="py-16 md:py-20 px-6">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-2xl md:text-5xl font-bold mb-12 md:mb-16">Why Zenith is Different</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-10">
                  <div className="space-y-4 group">
                    <div className={`mx-auto w-14 h-14 sm:w-20 sm:h-20 rounded-[1.5rem] sm:rounded-[2rem] flex items-center justify-center text-xl md:text-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${isDark ? 'bg-slate-800 text-slate-200 shadow-xl shadow-black/20' : 'bg-white shadow-xl shadow-slate-200 text-slate-700'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm md:text-lg">Visual-First</h4>
                  </div>
                  <div className="space-y-4 group">
                    <div className={`mx-auto w-14 h-14 sm:w-20 sm:h-20 rounded-[1.5rem] sm:rounded-[2rem] flex items-center justify-center text-xl md:text-2xl transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3 overflow-hidden ${isDark ? 'bg-slate-800 shadow-xl shadow-black/20' : 'bg-white shadow-xl shadow-slate-200'}`}>
                      <img src={flowerIcon} alt="Calm Design" className={`w-10 h-10 sm:w-14 sm:h-14 object-contain ${isDark ? '' : 'invert'}`} />
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm md:text-lg">Calm Design</h4>
                  </div>
                  <div className="space-y-4 group">
                    <div className={`mx-auto w-14 h-14 sm:w-20 sm:h-20 rounded-[1.5rem] sm:rounded-[2rem] flex items-center justify-center text-xl md:text-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${isDark ? 'bg-slate-800 text-slate-200 shadow-xl shadow-black/20' : 'bg-white shadow-xl shadow-slate-200 text-slate-700'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /></svg>
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm md:text-lg">No Clutter</h4>
                  </div>
                  <div className="space-y-4 group">
                    <div className={`mx-auto w-14 h-14 sm:w-20 sm:h-20 rounded-[1.5rem] sm:rounded-[2rem] flex items-center justify-center text-xl md:text-2xl transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3 ${isDark ? 'bg-slate-800 text-slate-200 shadow-xl shadow-black/20' : 'bg-white shadow-xl shadow-slate-200 text-slate-700'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm md:text-lg">Focus</h4>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* === FEATURES VIEW === */}
        {activeTab === 'features' && (
          <div className="animate-fade-in-up">
            <section className="py-16 md:py-20 px-6">
              <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
                <h2 className="text-3xl md:text-6xl font-bold tracking-tight">Powerful, calm tools.</h2>
                <p className={`mt-4 md:mt-6 text-lg md:text-xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Designed to do a few things exceptionally well.</p>
              </div>

              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* Feature 1 */}
                <div className={`p-8 md:p-10 rounded-3xl md:rounded-[2.5rem] border transition-all ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <div className="text-3xl md:text-4xl mb-4 md:mb-6 text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" className="md:w-10 md:h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Visual Timer</h3>
                  <p className={`mb-4 md:mb-6 text-sm md:text-base ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>A digital timer inspired by the way time feels in the real world.</p>
                  <ul className="space-y-2 md:space-y-3 opacity-80 text-sm md:text-base">
                    <li className="flex items-center space-x-3"><div className="w-1.5 h-1.5 rounded-full bg-red-500" /><span>Time is shown visually, not just numerically</span></li>
                    <li className="flex items-center space-x-3"><div className="w-1.5 h-1.5 rounded-full bg-red-500" /><span>Ideal for studying, working, or focused sessions</span></li>
                    <li className="flex items-center space-x-3"><div className="w-1.5 h-1.5 rounded-full bg-red-500" /><span>PiP support to stay visible while multitasking</span></li>
                  </ul>
                </div>

                {/* Feature 2 */}
                <div className={`p-8 md:p-10 rounded-3xl md:rounded-[2.5rem] border transition-all ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <div className="text-3xl md:text-4xl mb-4 md:mb-6 text-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" className="md:w-10 md:h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="13" r="8" /><path d="M12 9v4l2 2" /><path d="M12 2v3" /><path d="M17 2l-2 2" /><path d="M7 2l2 2" /></svg>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Stopwatch</h3>
                  <p className={`mb-4 md:mb-6 text-sm md:text-base ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Simple, accurate, and distraction-free.</p>
                  <ul className="space-y-2 md:space-y-3 opacity-80 text-sm md:text-base">
                    <li className="flex items-center space-x-3"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /><span>Clean stopwatch interface</span></li>
                    <li className="flex items-center space-x-3"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /><span>Lap-free, no clutter</span></li>
                    <li className="flex items-center space-x-3"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /><span>PiP mode for continuous visibility</span></li>
                  </ul>
                </div>

                {/* Feature 3 */}
                <div className={`p-8 md:p-10 rounded-3xl md:rounded-[2.5rem] border transition-all md:col-span-2 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8">
                    <div className="flex-1">
                      <div className="text-3xl md:text-4xl mb-4 md:mb-6 text-green-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" className="md:w-10 md:h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">World Clock & Map</h3>
                      <p className={`mb-4 md:mb-6 text-sm md:text-base ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>See time across the world—at a glance. Perfect for remote work or curiosity.</p>
                      <ul className="space-y-2 md:space-y-3 opacity-80 text-sm md:text-base">
                        <li className="flex items-center space-x-3"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /><span>Add multiple locations to your dashboard</span></li>
                        <li className="flex items-center space-x-3"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /><span>Visual world map display</span></li>
                        <li className="flex items-center space-x-3"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /><span>Instantly understand time differences</span></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className={`py-16 md:py-20 px-6 ${isDark ? 'bg-slate-900/30' : 'bg-slate-100/50'}`}>
              <div className="max-w-4xl mx-auto text-center space-y-8 md:space-y-12">
                <h2 className="text-2xl md:text-5xl font-bold">How It Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
                  {[
                    "Choose a tool",
                    "Visualize time",
                    "Plan your focus",
                    "Stay aware"
                  ].map((step, i) => (
                    <div key={i} className="flex flex-col space-y-2 md:space-y-3 p-4 bg-white/5 rounded-xl border border-white/5 md:bg-transparent md:border-none md:p-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isDark ? 'bg-slate-800' : 'bg-white shadow'}`}>{i + 1}</div>
                      <p className="font-medium opacity-90 text-sm md:text-base">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* === ABOUT VIEW === */}
        {activeTab === 'about' && (
          <div className="animate-fade-in-up">
            <section className="py-16 md:py-20 px-6">
              <div className="max-w-3xl mx-auto space-y-8 md:space-y-10 leading-relaxed text-base md:text-lg">
                <div className="space-y-4">
                  <h2 className="text-2xl md:text-5xl font-bold">
                    Built by{' '}
                    <a
                      href="https://www.instagram.com/tejaasbuilds/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-grid grid-cols-1 cursor-pointer group transition-all duration-300 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}
                    >
                      <span className="col-start-1 row-start-1 group-hover:opacity-0 transition-opacity duration-300">Tejaas.</span>
                      <span className="col-start-1 row-start-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-bold tracking-wide text-center">Connect.</span>
                    </a>
                  </h2>
                  <p className={`font-serif italic text-lg md:text-xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Zenith was created by Tejaas, while preparing to study mathematics.</p>
                </div>
                <div className={`space-y-6 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <p>During planning and study sessions, Tejaas realized something was missing: a clear, visual way to see time passing—not just numbers ticking down.</p>
                  <p>The physical Time Timer made time feel real and intuitive. But it was too expensive, and there was no simple digital alternative that felt the same.</p>
                  <p>So Zenith began as a personal solution:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>A visual timer</li>
                    <li>Simple tools</li>
                    <li>No complexity</li>
                    <li>No distractions</li>
                  </ul>
                  <p>That idea slowly grew into Zenith. And now, we’re here.</p>
                </div>
              </div>
            </section>

            {/* WHO IT IS FOR */}
            <section className={`py-16 md:py-20 px-6 ${isDark ? 'bg-slate-900/30' : 'bg-slate-100/50'}`}>
              <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl md:text-5xl font-bold text-center mb-12 md:mb-16">Who Zenith is For</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                  <div className={`p-6 md:p-8 rounded-3xl border ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white'}`}>
                    <div className="text-3xl mb-4 text-purple-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold mb-2">Students</h3>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Study sessions with visual time awareness. Clear tracking without distractions.</p>
                  </div>
                  <div className={`p-6 md:p-8 rounded-3xl border ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white'}`}>
                    <div className="text-3xl mb-4 text-orange-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.1 4-1 4-1s.25 1.5-1 2.5" /></svg>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold mb-2">Founders</h3>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Global time awareness. Simple tools that stay out of the way.</p>
                  </div>
                  <div className={`p-6 md:p-8 rounded-3xl border ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white'}`}>
                    <div className="text-3xl mb-4 text-pink-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a5 5 0 0 0-5 5v2a5 5 0 0 0 10 0V7a5 5 0 0 0-5-5Z" /><path d="M12 14a5 5 0 0 0-5 5v2a5 5 0 0 0 10 0v-2a5 5 0 0 0-5-5Z" /><line x1="8" y1="2" x2="8" y2="4" /><line x1="16" y1="2" x2="16" y2="4" /></svg>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold mb-2">Productivity Minds</h3>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Minimal tools. Visual feedback. No unnecessary systems.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* LEGAL */}
            <section className={`py-16 md:py-20 px-6 text-sm ${isDark ? 'bg-slate-900 border-t border-slate-800' : 'bg-slate-100 border-t border-slate-200'}`}>
              <div className="max-w-4xl mx-auto space-y-6 opacity-60">
                <h4 className="font-bold uppercase tracking-widest">Legal & Attribution Note</h4>
                <p>
                  Zenith’s visual timer concept is inspired by the physical “Time Timer” device, which is a registered trademark owned by its respective rights holders.
                </p>
                <p>
                  Zenith:
                  <br />• Is not affiliated with
                  <br />• Is not endorsed by
                  <br />• Does not claim ownership of the Time Timer brand, trademarks, or patents.
                </p>
                <p>
                  Zenith is an independently developed digital product, created to offer a simple and accessible visual time experience in a digital format. All trademarks and intellectual property belong to their respective owners.
                </p>
              </div>
            </section>
          </div>
        )}

      </main>

      {/* --- FOOTER --- */}
      <footer className={`py-8 md:py-12 px-6 text-center ${isDark ? 'bg-[#0f172a]' : 'bg-slate-50'} border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 opacity-50 text-sm">
          <div className="font-bold">Built by Tejaas</div>
          <div className="flex space-x-6">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="https://www.instagram.com/tejaasbuilds/" target="_blank" rel="noopener noreferrer" className="hover:underline">Contact</a>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
