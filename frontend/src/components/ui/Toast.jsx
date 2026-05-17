import React, { useEffect } from 'react';

/**
 * Reusable animated Toast notification component styled with Tailwind CSS.
 */
export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const getBorderColor = () => {
    if (type === 'success') return 'border-l-emerald-500';
    if (type === 'danger') return 'border-l-rose-500';
    return 'border-l-indigo-500';
  };

  const getIcon = () => {
    if (type === 'success') return '✓';
    if (type === 'danger') return '✗';
    return 'ℹ';
  };

  const getIconBg = () => {
    if (type === 'success') return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400';
    if (type === 'danger') return 'bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400';
    return 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400';
  };

  return (
    <div className={`bg-white dark:bg-slate-900 border-l-4 ${getBorderColor()} shadow-xl rounded-r-xl py-4 px-5 flex items-center gap-3.5 text-sm font-medium text-slate-800 dark:text-slate-200 animate-slide-in min-w-[280px] max-w-sm`}>
      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${getIconBg()}`}>
        {getIcon()}
      </span>
      <span>{message}</span>
      <button 
        className="ml-auto text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg leading-none transition-colors" 
        onClick={onClose}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}
