import React, { useState } from 'react';
import StatCard from './ui/StatCard';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// Initial Mock Data representing SaaS / Agency transactions
const INITIAL_TRANSACTIONS = [
  { id: 'tx-1', client: 'Acme Corp', project: 'Enterprise SaaS Dev', date: '2026-05-15', amount: 4800, type: 'income', status: 'paid' },
  { id: 'tx-2', client: 'Vercel Inc', project: 'Serverless Hosting Fee', date: '2026-05-12', amount: 120, type: 'expense', status: 'paid' },
  { id: 'tx-3', client: 'Sarah Connor', project: 'Branding & UI Consultation', date: '2026-05-10', amount: 1500, type: 'income', status: 'paid' },
  { id: 'tx-4', client: 'AWS Cloud Services', project: 'Infrastructure Hosting', date: '2026-05-08', amount: 450, type: 'expense', status: 'paid' },
  { id: 'tx-5', client: 'DesignCraft Ltd', project: 'Interactive 3D Assets', date: '2026-05-04', amount: 3200, type: 'income', status: 'pending' },
  { id: 'tx-6', client: 'Github Copilot', project: 'SaaS Tooling License', date: '2026-05-01', amount: 40, type: 'expense', status: 'paid' },
  { id: 'tx-7', client: 'Nova Corp', project: 'Mobile Frontend Audit', date: '2026-04-28', amount: 2400, type: 'income', status: 'pending' },
];

export default function Dashboard({ searchQuery, triggerToast, quickInvoiceRef }) {
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [chartMode, setChartMode] = useState('6m'); // '6m' or '30d'

  // Invoice builder form state
  const [formClient, setFormClient] = useState('');
  const [formProject, setFormProject] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formType, setFormType] = useState('income');
  const [formStatus, setFormStatus] = useState('pending');

  // Dynamic Calculations based on state
  const totalRevenue = transactions
    .filter(t => t.type === 'income' && t.status === 'paid')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingRevenue = transactions
    .filter(t => t.type === 'income' && t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalRevenue - totalExpenses;
  const activeInvoicesCount = transactions.filter(t => t.status === 'pending').length;

  // Filtered transactions list based on live search
  const filteredTransactions = transactions.filter((t) => {
    const query = searchQuery.toLowerCase();
    return (
      t.client.toLowerCase().includes(query) ||
      t.project.toLowerCase().includes(query) ||
      t.amount.toString().includes(query) ||
      t.status.toLowerCase().includes(query)
    );
  });

  // Handle Form Submission for new Invoices / Transactions
  const handleCreateInvoice = (e) => {
    e.preventDefault();
    if (!formClient || !formAmount) {
      triggerToast('Please provide a client name and amount.', 'danger');
      return;
    }

    const newTx = {
      id: `tx-${Date.now()}`,
      client: formClient,
      project: formProject || 'Consulting & Strategy',
      date: new Date().toISOString().split('T')[0],
      amount: parseFloat(formAmount),
      type: formType,
      status: formStatus,
    };

    setTransactions([newTx, ...transactions]);
    triggerToast(
      `Successfully logged ${formType === 'income' ? 'Income' : 'Expense'} of $${parseFloat(formAmount).toLocaleString()} for ${formClient}!`, 
      'success'
    );

    // Reset Form
    setFormClient('');
    setFormProject('');
    setFormAmount('');
    setFormStatus('pending');
  };

  // Rich monthly dataset for Recharts area graph (Jan - Jun)
  const chartData = [
    { name: 'Jan', inflow: 4200, outflow: 1800 },
    { name: 'Feb', inflow: 5800, outflow: 2100 },
    { name: 'Mar', inflow: 7100, outflow: 3100 },
    { name: 'Apr', inflow: 6400, outflow: 2400 },
    { name: 'May', inflow: 8900, outflow: 2900 },
    { name: 'Jun', inflow: 10400 + (totalRevenue - 11900) * 0.8, outflow: 3400 + (totalExpenses - 730) * 0.5 },
  ];

  // Customized premium tooltip for dark dashboard
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#121214]/95 backdrop-blur-md border border-zinc-800 rounded-lg p-3 shadow-xl flex flex-col gap-1.5">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{payload[0].payload.name} Summary</p>
          {payload.map((entry, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs">
              <span 
                className="w-1.5 h-1.5 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-zinc-400 capitalize">{entry.name}:</span>
              <strong className="text-zinc-100 font-bold">${entry.value.toLocaleString()}</strong>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-5 md:gap-6 flex-grow overflow-x-hidden">
      
      {/* Top Welcome Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-fade-in">
        <div>
          <h1 className="font-display text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-450 mt-0.5">
            Welcome back, Jane! Here is your SaaS cashflow summary.
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 rounded-lg px-3.5 py-1.5 text-xs font-semibold text-slate-500 dark:text-zinc-400 flex items-center gap-2 shadow-sm w-fit self-start sm:self-center">
          <span>📅</span>
          <span>May 2026</span>
          <span className="text-emerald-500 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
            Live Sync
          </span>
        </div>
      </div>

      {/* Grid of Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        <StatCard
          title="Cleared Income"
          value={`$${totalRevenue.toLocaleString()}`}
          icon="🟢"
          trend="+14.2%"
          trendType="positive"
          trendText="vs prev month"
          iconBgColor="bg-emerald-50 dark:bg-emerald-950/40"
          iconColor="text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          title="Total Expenses"
          value={`$${totalExpenses.toLocaleString()}`}
          icon="🔴"
          trend="+4.8%"
          trendType="negative"
          trendText="vs prev month"
          iconBgColor="bg-rose-50 dark:bg-rose-950/40"
          iconColor="text-rose-600 dark:text-rose-400"
        />
        <StatCard
          title="Net Cashflow"
          value={`$${netProfit.toLocaleString()}`}
          icon="💵"
          trend="+18.5%"
          trendType="positive"
          trendText="vs prev month"
          iconBgColor="bg-indigo-50 dark:bg-indigo-950/40"
          iconColor="text-indigo-600 dark:text-indigo-400"
        />
        <StatCard
          title="Pending Payments"
          value={`$${pendingRevenue.toLocaleString()}`}
          icon="⏳"
          trend={`${activeInvoicesCount} invoices`}
          trendType="neutral"
          trendText="outstanding"
          iconBgColor="bg-amber-50 dark:bg-amber-950/40"
          iconColor="text-amber-600 dark:text-amber-400"
        />
      </div>

      {/* Analytics and Cashflow Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5 items-start animate-fade-in">
        
        {/* Left Side: Cashflow Graph */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm flex flex-col hover-card-trigger">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                Cash Flow Trends
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Comparing Monthly Income and Expenditures
              </p>
            </div>
            <div className="flex bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-855 rounded-lg p-0.5 gap-0.5 self-start sm:self-center">
              <button 
                className={`border-none px-3 py-1.5 text-xs font-semibold rounded-md cursor-pointer transition-all ${
                  chartMode === '6m' 
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                    : 'bg-transparent text-slate-500 dark:text-slate-400'
                }`}
                onClick={() => setChartMode('6m')}
              >
                6 Months
              </button>
              <button 
                className={`border-none px-3 py-1.5 text-xs font-semibold rounded-md cursor-pointer transition-all ${
                  chartMode === '30d' 
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                    : 'bg-transparent text-slate-500 dark:text-slate-400'
                }`}
                onClick={() => {
                  setChartMode('30d');
                  triggerToast("Monthly micro-drills are simulated inside standard charts.", "info");
                }}
              >
                30 Days
              </button>
            </div>
          </div>
          {/* Interactive Recharts area plot */}
          <div className="h-60 w-full relative mt-2 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="inflowGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="outflowGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity="0.15"/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1f1f23" vertical={false} strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  stroke="#71717a" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10}
                />
                <YAxis 
                  stroke="#71717a" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#27272a', strokeWidth: 1 }} />
                <Area 
                  type="monotone" 
                  dataKey="inflow" 
                  name="Inflow"
                  stroke="#6366f1" 
                  fillOpacity={1} 
                  fill="url(#inflowGradient)" 
                  strokeWidth={2.5}
                />
                <Area 
                  type="monotone" 
                  dataKey="outflow" 
                  name="Outflow"
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#outflowGradient)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Legends */}
          <div className="flex flex-wrap justify-center gap-6 mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-650 dark:bg-indigo-500 shadow-sm shadow-indigo-600/20"></span>
              <span>Inflow (Payments)</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 dark:bg-emerald-450 shadow-sm shadow-emerald-500/20"></span>
              <span>Outflow (Software & Operations)</span>
            </div>
          </div>
        </div>

        {/* Right Side: Revenue Channels */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm flex flex-col w-full hover-card-trigger">
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-1">
            Income Sources
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-6">
            Breakdown of major revenue streams generated this year.
          </p>

          <div className="flex flex-col gap-6">
            {/* Category 1 */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                <span>SaaS Product Sales</span>
                <span className="text-indigo-600 dark:text-indigo-400">55%</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-500" style={{ width: '55%' }}></div>
              </div>
            </div>

            {/* Category 2 */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                <span>Freelancing & Consulting</span>
                <span className="text-emerald-505 dark:text-emerald-450">30%</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 dark:bg-emerald-450 rounded-full transition-all duration-500" style={{ width: '30%' }}></div>
              </div>
            </div>

            {/* Category 3 */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                <span>Affiliates & Sponsorships</span>
                <span className="text-amber-600 dark:text-amber-400">15%</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 dark:bg-amber-450 rounded-full transition-all duration-500" style={{ width: '15%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Transaction Table & Quick Invoice Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5 items-start animate-fade-in">
        
        {/* Left Side: Live Filtered Transactions Table */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm flex flex-col overflow-hidden hover-card-trigger">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                Recent Transactions
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                {searchQuery ? `Filtered search matching "${searchQuery}"` : 'All recent financial logs'}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto -mx-6">
            <div className="inline-block min-w-full align-middle px-6">
              {filteredTransactions.length > 0 ? (
                <table className="min-w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <th className="py-3.5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        Client / Target
                      </th>
                      <th className="py-3.5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="py-3.5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="py-3.5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="py-3.5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((tx) => (
                      <tr 
                        key={tx.id} 
                        className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
                      >
                        <td className="py-4 pr-3 flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold shadow-sm ${
                            tx.type === 'income' 
                              ? 'bg-indigo-50 text-indigo-650 dark:bg-indigo-950/30 dark:text-indigo-400' 
                              : 'bg-rose-50 text-rose-650 dark:bg-rose-950/30 dark:text-rose-450'
                          }`}>
                            {tx.client.charAt(0)}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {tx.client}
                            </span>
                            <span className="text-[10px] text-slate-450 dark:text-slate-500 truncate">
                              {tx.project}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                          {tx.date}
                        </td>
                        <td className="py-4 text-xs font-semibold whitespace-nowrap capitalize">
                          <span className={tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-450'}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="py-4 text-xs font-bold text-slate-850 dark:text-slate-200 whitespace-nowrap">
                          {tx.type === 'income' ? '+' : '-'} ${tx.amount.toLocaleString()}
                        </td>
                        <td className="py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            tx.status === 'paid' 
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' 
                              : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-10 px-4 text-slate-400 dark:text-slate-500 flex flex-col items-center gap-2">
                  <span className="text-3xl">🔍</span>
                  <p className="text-xs font-medium">No transactions match your search filter.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Quick Action Form (Prepare SaaS Dashboard) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm flex flex-col w-full hover-card-trigger" ref={quickInvoiceRef}>
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-1">
            Quick Ledger
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-6">
            Instantly log a transaction / invoice
          </p>

          <form onSubmit={handleCreateInvoice} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400" htmlFor="client-name">
                Client Name
              </label>
              <input
                id="client-name"
                type="text"
                className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 text-slate-805 dark:text-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950/30 transition-all placeholder:text-slate-400"
                placeholder="e.g. Supabase Inc"
                value={formClient}
                onChange={(e) => setFormClient(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400" htmlFor="project-desc">
                Project / Description
              </label>
              <input
                id="project-desc"
                type="text"
                className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 text-slate-805 dark:text-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950/30 transition-all placeholder:text-slate-400"
                placeholder="e.g. Database API Setup"
                value={formProject}
                onChange={(e) => setFormProject(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400" htmlFor="tx-amount">
                  Amount ($)
                </label>
                <input
                  id="tx-amount"
                  type="number"
                  className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 text-slate-805 dark:text-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950/30 transition-all placeholder:text-slate-400"
                  placeholder="2500"
                  value={formAmount}
                  onChange={(e) => setFormAmount(e.target.value)}
                  min="1"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400" htmlFor="tx-type">
                  Type
                </label>
                <select
                  id="tx-type"
                  className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 text-slate-805 dark:text-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950/30 transition-all cursor-pointer"
                  value={formType}
                  onChange={(e) => setFormType(e.target.value)}
                >
                  <option value="income">Inflow (+) </option>
                  <option value="expense">Outflow (-) </option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400" htmlFor="tx-status">
                Invoice Status
              </label>
              <select
                id="tx-status"
                className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 text-slate-805 dark:text-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950/30 transition-all cursor-pointer"
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value)}
              >
                <option value="paid">Cleared / Paid</option>
                <option value="pending">Pending / Invoice Sent</option>
              </select>
            </div>

            <button 
              type="submit" 
              className="w-full mt-2 bg-indigo-600 hover:bg-indigo-750 text-white border-none rounded-xl py-3 text-xs font-bold shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all cursor-pointer"
            >
              Post Ledger Entry
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
