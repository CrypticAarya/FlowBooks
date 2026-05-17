import React from 'react';

/**
 * Top Header Navigation Component styled with Tailwind CSS.
 * Houses live searching states, accessibility controls, theme switches, and layout CTAs.
 */
export default function Header({ 
  searchQuery, 
  setSearchQuery, 
  theme, 
  toggleTheme, 
  toggleSidebar, 
  onQuickAction 
}) {
  return (
    <header className="h-14 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-850 flex items-center justify-between px-4 sm:px-6 md:px-8 sticky top-0 z-30 transition-colors duration-200">
      
      {/* Mobile Trigger & Responsive Brand Label */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button 
          className="md:hidden text-xl text-slate-500 dark:text-zinc-400 hover:text-indigo-500 focus:outline-none p-1 rounded-lg leading-none hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer" 
          onClick={toggleSidebar} 
          aria-label="Open sidebar"
        >
          ≡
        </button>
        <div className="md:hidden flex items-center gap-1.5">
          <div className="w-6 h-6 rounded bg-white flex items-center justify-center text-black font-black text-xs shadow-md">
            F
          </div>
          <strong className="font-display font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
            FlowBooks
          </strong>
        </div>
      </div>

      {/* Interactive Global Search Input */}
      <div className="hidden md:flex items-center bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 w-64 focus-within:w-72 gap-2 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 dark:focus-within:ring-indigo-950/20 transition-all duration-200">
        <span className="text-slate-400 dark:text-zinc-500 text-xs flex items-center">🔍</span>
        <input
          type="text"
          className="bg-transparent border-none outline-none text-xs text-slate-800 dark:text-zinc-200 placeholder-slate-400 dark:placeholder-zinc-500 w-full"
          placeholder="Search SaaS dashboard..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 text-xs font-semibold leading-none"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Top Bar Actions Stack */}
      <div className="flex items-center gap-2.5">
        {/* Light/Dark Toggle */}
        <button 
          className="w-8 h-8 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-300 flex items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 transition-all relative text-xs"
          onClick={toggleTheme} 
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          aria-label="Toggle visual theme"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        {/* Notifications */}
        <button 
          className="w-8 h-8 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-300 flex items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 transition-all relative text-xs" 
          title="View notifications" 
          aria-label="Notifications"
        >
          🔔
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full ring-1 ring-white dark:ring-zinc-900 animate-pulse"></span>
        </button>

        {/* CTA SaaS Trigger */}
        <button 
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white border-none rounded-lg px-3.5 py-1.5 text-xs font-semibold shadow-sm hover:shadow transition-all cursor-pointer h-8"
          onClick={onQuickAction}
        >
          <span className="text-xs font-bold leading-none">+</span>
          <span className="hidden sm:inline">New Invoice</span>
        </button>
      </div>
    </header>
  );
}
