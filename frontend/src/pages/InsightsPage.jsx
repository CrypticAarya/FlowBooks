import React, { useState, useEffect } from 'react';
import { Progress, message } from 'antd';
import { BulbOutlined, LineChartOutlined, ExclamationCircleOutlined, CheckCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api/insights/overview';

export default function InsightsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchInsights = async () => {
    try {
      const token = localStorage.getItem('flowbooks_token');
      const res = await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      message.error('Failed to load AI Insights');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
      </div>
    );
  }

  const { healthScore, totalRevenue, totalExpenses, netProfit, feed } = data;

  const getHealthColor = (score) => {
    if (score >= 80) return '#10b981'; // emerald
    if (score >= 50) return '#f59e0b'; // amber
    return '#ef4444'; // rose
  };

  const getFeedIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircleOutlined className="text-emerald-500 text-lg shadow-sm" />;
      case 'warning':
      case 'danger': return <ExclamationCircleOutlined className="text-rose-500 text-lg shadow-sm" />;
      default: return <InfoCircleOutlined className="text-indigo-400 text-lg shadow-sm" />;
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-6xl mx-auto w-full">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <BulbOutlined className="text-indigo-500" /> Smart Insights
        </h1>
        <p className="text-xs text-zinc-450 mt-1">AI-powered analytics and real-time business intelligence tailored for your SaaS workspace.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Business Health Score Gauge */}
        <div className="bg-[#121214] border border-zinc-850 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center gap-4 hover-card-trigger col-span-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center w-full block">Business Health Score</span>
          <div className="relative w-36 h-36 flex items-center justify-center my-2">
             <Progress 
               type="circle" 
               percent={healthScore} 
               strokeColor={getHealthColor(healthScore)} 
               trailColor="#27272a" 
               format={() => <span className="text-4xl font-black text-white font-display tracking-tighter">{healthScore}</span>}
               strokeWidth={10}
               size={140}
             />
          </div>
          <p className="text-xs text-zinc-400 text-center leading-relaxed px-4">
            {healthScore >= 80 ? 'Your business is in excellent financial health. Revenue generation is strong.' : healthScore >= 50 ? 'Your business is stable, but there are distinct areas for margin improvement.' : 'Critical attention required. Review expenses and chase overdue invoices.'}
          </p>
        </div>

        {/* AI Assistant Insight Feed */}
        <div className="lg:col-span-2 bg-[#121214] border border-zinc-850 rounded-2xl p-6 shadow-sm flex flex-col gap-5 hover-card-trigger h-full">
          <div className="flex items-center gap-2 border-b border-zinc-800/60 pb-3">
             <LineChartOutlined className="text-indigo-400 text-lg" />
             <span className="text-sm font-bold text-zinc-200 tracking-wide">Assistant Feed</span>
          </div>
          
          <div className="flex flex-col gap-4 overflow-y-auto pr-2 max-h-[320px] custom-scrollbar">
            {feed.length > 0 ? feed.map((item, idx) => (
              <div key={idx} className={`p-4 rounded-xl border flex gap-3.5 items-start transition-colors duration-300 ${
                item.type === 'danger' || item.type === 'warning' ? 'bg-rose-950/20 border-rose-900/30 hover:bg-rose-950/30' : 
                item.type === 'success' ? 'bg-emerald-950/20 border-emerald-900/30 hover:bg-emerald-950/30' : 'bg-indigo-950/10 border-indigo-900/30 hover:bg-indigo-950/20'
              }`}>
                 <div className="mt-0.5">{getFeedIcon(item.type)}</div>
                 <p className="text-[13px] text-zinc-300 leading-relaxed m-0">{item.text}</p>
              </div>
            )) : (
              <div className="text-center text-zinc-500 text-xs py-10 flex flex-col items-center gap-2">
                <BulbOutlined className="text-3xl opacity-20" />
                <span>No critical insights detected at this moment.</span>
              </div>
            )}
          </div>
        </div>

        {/* Fast Top-Level Metric Summary Cards */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
           <div className="bg-[#121214] border border-zinc-850 rounded-2xl p-6 shadow-sm hover-card-trigger">
             <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-2">Total Processed</span>
             <span className="text-3xl font-black text-emerald-400">${totalRevenue.toLocaleString()}</span>
           </div>
           <div className="bg-[#121214] border border-zinc-850 rounded-2xl p-6 shadow-sm hover-card-trigger">
             <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-2">Total Outflow</span>
             <span className="text-3xl font-black text-rose-400">${totalExpenses.toLocaleString()}</span>
           </div>
           <div className="bg-[#121214] border border-zinc-850 rounded-2xl p-6 shadow-sm relative overflow-hidden hover-card-trigger">
             <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none"></div>
             <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-2">Net Profitability</span>
             <span className={`text-3xl font-black tracking-tight ${netProfit >= 0 ? 'text-white' : 'text-rose-400'}`}>${netProfit.toLocaleString()}</span>
           </div>
        </div>

      </div>
    </div>
  );
}
