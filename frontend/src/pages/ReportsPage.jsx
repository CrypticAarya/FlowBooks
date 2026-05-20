import React, { useState, useEffect } from 'react';
import { message, Spin } from 'antd';
import { DownloadOutlined, FileTextOutlined, DollarOutlined, TeamOutlined, BarChartOutlined } from '@ant-design/icons';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const BASE = 'http://localhost:5001/api';

const PIE_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function ReportsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getAuthConfig = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('flowbooks_token')}` }
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${BASE}/reports/business-summary`, getAuthConfig());
        if (res.data.success) setData(res.data.data);
      } catch {
        message.error('Failed to load report data');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // Trigger CSV download by navigating to the authenticated endpoint
  const handleCSVExport = async (type) => {
    try {
      const token = localStorage.getItem('flowbooks_token');
      const res = await axios.get(`${BASE}/reports/export/csv?type=${type}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `flowbooks_${type}_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      message.success(`${type} report exported successfully!`);
    } catch {
      message.error('Export failed. Try again.');
    }
  };

  // PDF report generation using the browser's print API  
  const handlePDFExport = () => {
    window.print();
    message.success('PDF dialog opened — save as PDF from the print panel.');
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spin size="large" />
      </div>
    );
  }

  const { summary, monthlyRevenue, monthlyExpenses, expenseByCategory, topCustomers, invoiceStatusBreakdown } = data;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#121214]/95 border border-zinc-800 rounded-lg p-3 text-xs flex flex-col gap-1.5">
          <p className="text-zinc-500 font-bold uppercase">{label}</p>
          {payload.map((entry, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-zinc-400">{entry.name}:</span>
              <strong className="text-zinc-100">${(entry.value || 0).toLocaleString()}</strong>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div id="reports-printable" className="flex flex-col gap-6 animate-fade-in max-w-6xl mx-auto w-full">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-xl md:text-2xl font-extrabold text-white tracking-tight">Business Reports</h1>
          <p className="text-xs text-zinc-450 mt-0.5">Generate, review, and export comprehensive financial reports for your business.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handlePDFExport} className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white rounded-lg px-4 py-2.5 text-xs font-bold transition-all cursor-pointer">
            <DownloadOutlined /> Export PDF
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: `$${summary.totalRevenue.toLocaleString()}`, color: 'text-emerald-400', bg: 'bg-emerald-950/30 border-emerald-900/40' },
          { label: 'Total Expenses', value: `$${summary.totalExpenses.toLocaleString()}`, color: 'text-rose-400', bg: 'bg-rose-950/30 border-rose-900/40' },
          { label: 'Net Profit', value: `$${summary.netProfit.toLocaleString()}`, color: summary.netProfit >= 0 ? 'text-white' : 'text-rose-400', bg: 'bg-[#121214] border-zinc-850' },
          { label: 'Pending Inflow', value: `$${summary.totalPending.toLocaleString()}`, color: 'text-amber-400', bg: 'bg-amber-950/20 border-amber-900/30' },
        ].map((card, i) => (
          <div key={i} className={`${card.bg} border rounded-2xl p-5 flex flex-col gap-2 hover-card-trigger`}>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{card.label}</span>
            <span className={`text-2xl font-black tracking-tight ${card.color}`}>{card.value}</span>
          </div>
        ))}
      </div>

      {/* Revenue vs Expense Monthly Chart */}
      <div className="bg-[#121214] border border-zinc-850 rounded-2xl p-6 shadow-sm hover-card-trigger">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2"><BarChartOutlined className="text-indigo-400" /> Revenue vs Expenses</h2>
            <p className="text-[10px] text-zinc-500 mt-0.5">Monthly income and spending comparison</p>
          </div>
          <button onClick={() => handleCSVExport('invoices')} className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white rounded-lg px-3 py-1.5 text-[10px] font-bold transition-all cursor-pointer">
            <DownloadOutlined /> CSV
          </button>
        </div>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyRevenue.map((m, i) => ({ ...m, expenses: monthlyExpenses[i]?.expenses || 0 }))} barCategoryGap="35%">
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" name="Revenue" fill="#6366f1" radius={[4,4,0,0]} />
              <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Expense Breakdown Pie */}
        <div className="bg-[#121214] border border-zinc-850 rounded-2xl p-6 shadow-sm hover-card-trigger">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2"><DollarOutlined className="text-rose-400" /> Expense Categories</h2>
              <p className="text-[10px] text-zinc-500 mt-0.5">Spending distribution by category</p>
            </div>
            <button onClick={() => handleCSVExport('expenses')} className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white rounded-lg px-3 py-1.5 text-[10px] font-bold transition-all cursor-pointer">
              <DownloadOutlined /> CSV
            </button>
          </div>
          {expenseByCategory.length > 0 ? (
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="h-44 w-full sm:w-44 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={expenseByCategory} dataKey="amount" nameKey="category" cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3}>
                      {expenseByCategory.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v) => `$${v.toLocaleString()}`} contentStyle={{ backgroundColor: '#121214', border: '1px solid #27272a', borderRadius: '8px', fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col gap-2.5 w-full">
                {expenseByCategory.map((c, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}></span>
                      <span className="text-zinc-400">{c.category}</span>
                    </div>
                    <span className="font-bold text-zinc-200">${c.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 text-zinc-600 text-xs">No expense data yet</div>
          )}
        </div>

        {/* Top Customers Table */}
        <div className="bg-[#121214] border border-zinc-850 rounded-2xl p-6 shadow-sm hover-card-trigger">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2"><TeamOutlined className="text-purple-400" /> Top Customers</h2>
              <p className="text-[10px] text-zinc-500 mt-0.5">Ranked by lifetime value</p>
            </div>
            <button onClick={() => handleCSVExport('customers')} className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white rounded-lg px-3 py-1.5 text-[10px] font-bold transition-all cursor-pointer">
              <DownloadOutlined /> CSV
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {topCustomers.length > 0 ? topCustomers.map((c, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-zinc-800/50 last:border-none">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-black text-zinc-400">#{i+1}</span>
                  <div>
                    <p className="text-xs font-bold text-zinc-200 m-0">{c.name}</p>
                    <p className="text-[10px] text-zinc-500 m-0">{c.email}</p>
                  </div>
                </div>
                <span className="text-emerald-400 font-bold text-xs">${(c.totalSpent || 0).toLocaleString()}</span>
              </div>
            )) : (
              <div className="flex items-center justify-center h-40 text-zinc-600 text-xs">No customer data yet</div>
            )}
          </div>
        </div>
      </div>

      {/* Invoice Status Summary */}
      <div className="bg-[#121214] border border-zinc-850 rounded-2xl p-6 shadow-sm hover-card-trigger">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2"><FileTextOutlined className="text-indigo-400" /> Invoice Status Report</h2>
            <p className="text-[10px] text-zinc-500 mt-0.5">Settlement overview across all {summary.totalInvoices} invoices</p>
          </div>
          <button onClick={() => handleCSVExport('invoices')} className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white rounded-lg px-3 py-1.5 text-[10px] font-bold transition-all cursor-pointer">
            <DownloadOutlined /> CSV
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Paid', count: invoiceStatusBreakdown.paid, color: 'text-emerald-400', bar: 'bg-emerald-500' },
            { label: 'Pending', count: invoiceStatusBreakdown.pending, color: 'text-amber-400', bar: 'bg-amber-500' },
            { label: 'Overdue', count: invoiceStatusBreakdown.overdue, color: 'text-rose-400', bar: 'bg-rose-500' },
            { label: 'Partial', count: invoiceStatusBreakdown.partial, color: 'text-indigo-400', bar: 'bg-indigo-500' },
          ].map((s, i) => {
            const pct = summary.totalInvoices > 0 ? Math.round((s.count / summary.totalInvoices) * 100) : 0;
            return (
              <div key={i} className="flex flex-col gap-2.5">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400 font-semibold">{s.label}</span>
                  <span className={`font-black ${s.color}`}>{s.count}</span>
                </div>
                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className={`h-full ${s.bar} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }}></div>
                </div>
                <span className="text-[10px] text-zinc-600">{pct}% of total</span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
