import React, { useState, useEffect } from 'react';
import StatCard from './ui/StatCard';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { BulbOutlined, CheckCircleOutlined, ExclamationCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api/analytics/overview';

export default function Dashboard({ triggerToast }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [subUsage, setSubUsage] = useState(null);
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('flowbooks_token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const [analyticsRes, usageRes, insightsRes] = await Promise.all([
          axios.get(API_URL, config),
          axios.get('http://localhost:5001/api/subscription/usage', config),
          axios.get('http://localhost:5001/api/insights/overview', config)
        ]);
        
        if (analyticsRes.data && analyticsRes.data.success) {
          setData(analyticsRes.data.data);
        }
        if (usageRes.data && usageRes.data.success) {
          setSubUsage(usageRes.data.data);
        }
        if (insightsRes.data && insightsRes.data.success) {
          setInsights(insightsRes.data.data);
        }
      } catch (err) {
        console.error('Analytics Error:', err);
        triggerToast('Failed to load live analytics data.', 'danger');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [triggerToast]);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const { metrics, statusDistribution, monthlyRevenue, topCustomers, recentInvoices, expenseCategories, businessProfile } = data;

  // Customized premium tooltip for dark dashboard
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#121214]/95 backdrop-blur-md border border-zinc-800 rounded-lg p-3 shadow-xl flex flex-col gap-1.5 z-50">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{label || payload[0].payload.name} Summary</p>
          {payload.map((entry, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs">
              <span 
                className="w-1.5 h-1.5 rounded-full" 
                style={{ backgroundColor: entry.color || entry.payload.fill }}
              />
              <span className="text-zinc-400 capitalize">{entry.name}:</span>
              <strong className="text-zinc-100 font-bold">
                {typeof entry.value === 'number' ? `$${entry.value.toLocaleString()}` : entry.value}
              </strong>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const getFeedIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircleOutlined className="text-emerald-500 text-base" />;
      case 'warning':
      case 'danger': return <ExclamationCircleOutlined className="text-rose-500 text-base" />;
      default: return <InfoCircleOutlined className="text-indigo-400 text-base" />;
    }
  };

  return (
    <div className="flex flex-col gap-5 md:gap-6 flex-grow overflow-x-hidden">
      
      {/* Top Welcome Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-fade-in">
        <div>
          <h1 className="font-display text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            {businessProfile?.businessName || 'Seller'} Workspace
            {subUsage && (
               <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider ${subUsage.plan === 'Free' ? 'bg-zinc-800 text-zinc-300' : 'bg-indigo-900/40 text-indigo-400'}`}>
                 {subUsage.plan}
               </span>
            )}
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-450 mt-0.5">
            Your live analytics and revenue metrics.
          </p>
        </div>
        
        {/* Upgrade Prompt Injection */}
        {subUsage && subUsage.plan === 'Free' && subUsage.invoices.used >= (subUsage.invoices.limit * 0.8) && (
          <div className="bg-rose-950/40 border border-rose-900/50 rounded-lg px-4 py-2 flex items-center gap-3">
             <span className="text-[11px] text-rose-300 font-semibold">You're approaching your Free plan limits ({subUsage.invoices.used}/{subUsage.invoices.limit}).</span>
             <a href="/subscription" className="text-[10px] font-bold text-white bg-rose-600 px-3 py-1 rounded-md hover:bg-rose-500 transition-colors">Upgrade</a>
          </div>
        )}
        <div className="bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 rounded-lg px-3.5 py-1.5 text-xs font-semibold text-slate-500 dark:text-zinc-400 flex items-center gap-2 shadow-sm w-fit self-start sm:self-center">
          <span className="text-emerald-500 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
            Live Data Sync
          </span>
        </div>
      </div>

      {/* Grid of Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        <StatCard
          title="Cleared Revenue"
          value={`$${metrics.totalRevenue.toLocaleString()}`}
          icon="🟢"
          trend={`${metrics.paidInvoicesCount} paid invoices`}
          trendType="positive"
          trendText="inflow"
          iconBgColor="bg-emerald-50 dark:bg-emerald-950/40"
          iconColor="text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          title="Total Expenses"
          value={`$${metrics.totalExpenses.toLocaleString()}`}
          icon="🔴"
          trend="Operational"
          trendType="negative"
          trendText="outflow"
          iconBgColor="bg-rose-50 dark:bg-rose-950/40"
          iconColor="text-rose-600 dark:text-rose-400"
        />
        <StatCard
          title="Net Profit"
          value={`$${metrics.netProfit.toLocaleString()}`}
          icon="💵"
          trend="Revenue - Expenses"
          trendType={metrics.netProfit >= 0 ? "positive" : "negative"}
          trendText="margin"
          iconBgColor="bg-indigo-50 dark:bg-indigo-950/40"
          iconColor="text-indigo-600 dark:text-indigo-400"
        />
        <StatCard
          title="Pending Inflow"
          value={`$${metrics.pendingRevenue.toLocaleString()}`}
          icon="⏳"
          trend="Awaiting"
          trendType="neutral"
          trendText="clearance"
          iconBgColor="bg-amber-50 dark:bg-amber-950/40"
          iconColor="text-amber-600 dark:text-amber-400"
        />
      </div>

      {/* AI Smart Assistant Widget */}
      {insights && insights.feed && insights.feed.length > 0 && (
        <div className="bg-[#121214] border border-zinc-850 rounded-2xl p-5 shadow-sm animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BulbOutlined className="text-indigo-400 text-lg" />
              <span className="font-bold text-white text-sm tracking-wide">Smart Assistant</span>
            </div>
            <a href="/insights" className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors">Full Report →</a>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 overflow-x-auto pb-1">
            {insights.feed.slice(0, 3).map((item, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 rounded-xl p-3.5 border min-w-[260px] flex-1 ${
                  item.type === 'danger' || item.type === 'warning'
                    ? 'bg-rose-950/20 border-rose-900/30'
                    : item.type === 'success'
                    ? 'bg-emerald-950/20 border-emerald-900/30'
                    : 'bg-indigo-950/10 border-indigo-900/20'
                }`}
              >
                <div className="mt-0.5 shrink-0">{getFeedIcon(item.type)}</div>
                <p className="text-[11px] text-zinc-300 leading-relaxed m-0">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5 items-start animate-fade-in">
        
        {/* Left Side: Revenue Trend Graph */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm flex flex-col hover-card-trigger">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                Revenue Growth
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Monthly cleared invoice volume
              </p>
            </div>
          </div>
          
          <div className="h-60 w-full relative mt-2 text-xs">
            {monthlyRevenue.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyRevenue} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#1f1f23" vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                  <RechartsTooltip content={<CustomTooltip />} cursor={{ stroke: '#27272a', strokeWidth: 1 }} />
                  <Area type="monotone" dataKey="total" name="Revenue" stroke="#6366f1" fillOpacity={1} fill="url(#colorTotal)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500">No revenue data available yet.</div>
            )}
          </div>
        </div>

        {/* Right Side: Status Distribution & Top Customers */}
        <div className="flex flex-col gap-4 md:gap-5">
          {/* Status Distribution Pie Chart */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm flex flex-col hover-card-trigger">
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-1">
              Invoice Status
            </h2>
            <div className="h-40 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2 text-[10px] font-semibold text-slate-400">
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#10b981]"></span> Paid</div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#f59e0b]"></span> Pending</div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#ef4444]"></span> Overdue</div>
            </div>
          </div>

          {/* Top Customers Leaderboard */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col hover-card-trigger">
            <h2 className="font-display text-sm font-bold text-slate-900 dark:text-white mb-3">
              Top Customers
            </h2>
            <div className="flex flex-col gap-3">
              {topCustomers.length > 0 ? topCustomers.map((customer, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-300 truncate max-w-[150px]">{customer._id}</span>
                  <span className="text-emerald-400 font-bold">${customer.totalSpent.toLocaleString()}</span>
                </div>
              )) : (
                <span className="text-xs text-slate-500">No paid customers yet.</span>
              )}
            </div>
          </div>

          {/* Expense Category Breakdown */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col hover-card-trigger">
            <h2 className="font-display text-sm font-bold text-slate-900 dark:text-white mb-3">
              Spend by Category
            </h2>
            <div className="flex flex-col gap-3">
              {expenseCategories && expenseCategories.length > 0 ? expenseCategories.map((cat, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-300">{cat._id}</span>
                  <span className="text-rose-400 font-bold">${cat.total.toLocaleString()}</span>
                </div>
              )) : (
                <span className="text-xs text-slate-500">No operational expenses logged.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Transactions Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm flex flex-col overflow-hidden hover-card-trigger animate-fade-in">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              Recent Transactions
            </h2>
          </div>
        </div>

        <div className="overflow-x-auto -mx-6">
          <div className="inline-block min-w-full align-middle px-6">
            {recentInvoices.length > 0 ? (
              <table className="min-w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <th className="py-3.5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Client</th>
                    <th className="py-3.5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="py-3.5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Amount</th>
                    <th className="py-3.5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentInvoices.map((tx) => (
                    <tr key={tx._id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="py-4 pr-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-950/30 text-indigo-400 flex items-center justify-center text-[11px] font-bold shadow-sm uppercase">
                          {tx.clientName.charAt(0)}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{tx.clientName}</span>
                          <span className="text-[10px] text-slate-450 dark:text-slate-500 truncate">{tx.invoiceNumber}</span>
                        </div>
                      </td>
                      <td className="py-4 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {new Date(tx.createdAt).toISOString().split('T')[0]}
                      </td>
                      <td className="py-4 text-xs font-bold text-slate-850 dark:text-slate-200 whitespace-nowrap">
                        ${tx.amount.toLocaleString()}
                      </td>
                      <td className="py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          tx.status === 'paid' ? 'bg-emerald-950/40 text-emerald-400' :
                          tx.status === 'pending' ? 'bg-amber-950/40 text-amber-400' :
                          'bg-rose-950/40 text-rose-400'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-10 text-slate-400 text-xs font-medium">No invoices have been generated yet.</div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
