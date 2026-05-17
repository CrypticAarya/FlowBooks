import React from 'react';

/**
 * Reusable StatCard component for displaying dashboard metrics, now styled with Tailwind CSS.
 */
export default function StatCard({
  title,
  value,
  icon,
  trend,
  trendType = 'neutral',
  trendText = 'vs last month',
  iconBgColor = 'bg-indigo-50 dark:bg-indigo-950/40',
  iconColor = 'text-indigo-600 dark:text-indigo-400',
}) {
  const getTrendColor = () => {
    if (trendType === 'positive') return 'text-emerald-600 dark:text-emerald-400 font-semibold';
    if (trendType === 'negative') return 'text-rose-600 dark:text-rose-400 font-semibold';
    return 'text-slate-500 dark:text-slate-400 font-medium';
  };

  const getTrendIcon = () => {
    if (trendType === 'positive') return '↑';
    if (trendType === 'negative') return '↓';
    return '•';
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 flex flex-col relative overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 animate-fade-in">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${iconBgColor} ${iconColor}`}>
          {icon}
        </div>
      </div>
      <div className="font-display text-2xl font-bold text-slate-900 dark:text-white mt-3.5">
        {value}
      </div>
      <div className="flex items-center mt-2.5 text-xs gap-1.5">
        <span className={getTrendColor()}>
          {getTrendIcon()} {trend}
        </span>
        <span className="text-slate-400 dark:text-slate-500">{trendText}</span>
      </div>
    </div>
  );
}
