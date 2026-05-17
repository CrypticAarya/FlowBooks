import React from 'react';
import { Table, Tag, Space, Button } from 'antd';
import { 
  ArrowUpOutlined, 
  ArrowDownOutlined, 
  DollarOutlined, 
  SyncOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// Mock cash flow data for Recharts Area Chart
const CHART_DATA = [
  { name: 'Jan', revenue: 4200, expenses: 1800 },
  { name: 'Feb', revenue: 5800, expenses: 2100 },
  { name: 'Mar', revenue: 7100, expenses: 3100 },
  { name: 'Apr', revenue: 6400, expenses: 2400 },
  { name: 'May', revenue: 8900, expenses: 2900 },
  { name: 'Jun', revenue: 10500, expenses: 3200 },
];

// Mock transaction data for Ant Design Table
const TABLE_DATA = [
  { key: '1', client: 'Acme Corp', project: 'Enterprise SaaS Dev', date: 'May 15, 2026', amount: 4800, type: 'income', status: 'paid' },
  { key: '2', client: 'Vercel Inc', project: 'Hosting Infrastructure', date: 'May 12, 2026', amount: 120, type: 'expense', status: 'paid' },
  { key: '3', client: 'Sarah Connor', project: 'UI/UX Brand Strategy', date: 'May 10, 2026', amount: 1500, type: 'income', status: 'paid' },
  { key: '4', client: 'AWS Cloud Services', project: 'EC2 Server Compute', date: 'May 08, 2026', amount: 450, type: 'expense', status: 'paid' },
  { key: '5', client: 'DesignCraft Ltd', project: '3D Illustration Package', date: 'May 04, 2026', amount: 3200, type: 'income', status: 'pending' },
];

export default function DashboardPage() {
  
  // Custom styled columns for Ant Design Table
  const columns = [
    {
      title: 'Client / Target',
      dataIndex: 'client',
      key: 'client',
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold ${
            record.type === 'income' 
              ? 'bg-emerald-500/10 text-emerald-400' 
              : 'bg-rose-500/10 text-rose-450'
          }`}>
            {text.charAt(0)}
          </div>
          <div>
            <strong className="block text-xs font-semibold text-zinc-200">{text}</strong>
            <span className="text-[10px] text-zinc-500">{record.project}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (text) => <span className="text-xs text-zinc-400">{text}</span>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <span className={`text-xs font-medium capitalize ${
          type === 'income' ? 'text-emerald-400' : 'text-rose-450'
        }`}>
          {type}
        </span>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount, record) => (
        <strong className="text-xs font-bold text-zinc-200">
          {record.type === 'income' ? '+' : '-'} ${amount.toLocaleString()}
        </strong>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'paid' ? 'success' : 'warning'} className="border-none rounded font-bold text-[9px] uppercase px-2 py-0.5">
          {status}
        </Tag>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 md:gap-8 animate-fade-in">
      
      {/* Header Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-xl md:text-2xl font-extrabold text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs text-zinc-450 mt-1">
            Cashflow metrics and accounting sync logs for May 2026.
          </p>
        </div>
        
        <Button 
          type="primary"
          icon={<PlusOutlined />}
          style={{
            backgroundColor: 'white',
            borderColor: 'white',
            color: 'black',
            fontWeight: 600,
            borderRadius: '8px',
            fontSize: '12px',
            height: '38px',
            boxShadow: '0 4px 12px rgba(255, 255, 255, 0.1)'
          }}
        >
          New Statement
        </Button>
      </div>

      {/* KPI Cards Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Revenue */}
        <div className="bg-[#121214] border border-zinc-800 rounded-xl p-6 flex flex-col relative overflow-hidden shadow-sm hover:border-zinc-700 transition-all duration-200">
          <div className="flex items-center justify-between text-zinc-450">
            <span className="text-xs font-bold uppercase tracking-wider">Net Cash Flow</span>
            <DollarOutlined className="text-base text-white" />
          </div>
          <span className="font-display text-2xl font-bold text-white mt-3.5">$9,530</span>
          <div className="flex items-center mt-2.5 text-[11px] gap-1.5">
            <span className="text-emerald-400 font-semibold"><ArrowUpOutlined /> +14.2%</span>
            <span className="text-zinc-500">vs last month</span>
          </div>
        </div>

        {/* Card 2: Income */}
        <div className="bg-[#121214] border border-zinc-800 rounded-xl p-6 flex flex-col relative overflow-hidden shadow-sm hover:border-zinc-700 transition-all duration-200">
          <div className="flex items-center justify-between text-zinc-450">
            <span className="text-xs font-bold uppercase tracking-wider">Inflows Recieved</span>
            <ArrowUpOutlined className="text-base text-emerald-450" />
          </div>
          <span className="font-display text-2xl font-bold text-white mt-3.5">$13,400</span>
          <div className="flex items-center mt-2.5 text-[11px] gap-1.5">
            <span className="text-emerald-400 font-semibold"><ArrowUpOutlined /> +18.5%</span>
            <span className="text-zinc-500">vs last month</span>
          </div>
        </div>

        {/* Card 3: Expenses */}
        <div className="bg-[#121214] border border-zinc-800 rounded-xl p-6 flex flex-col relative overflow-hidden shadow-sm hover:border-zinc-700 transition-all duration-200">
          <div className="flex items-center justify-between text-zinc-450">
            <span className="text-xs font-bold uppercase tracking-wider">Outflows Paid</span>
            <ArrowDownOutlined className="text-base text-rose-450" />
          </div>
          <span className="font-display text-2xl font-bold text-white mt-3.5">$3,870</span>
          <div className="flex items-center mt-2.5 text-[11px] gap-1.5">
            <span className="text-rose-450 font-semibold"><ArrowDownOutlined /> +4.8%</span>
            <span className="text-zinc-500">vs last month</span>
          </div>
        </div>

      </div>

      {/* Analytics Recharts Curve */}
      <div className="bg-[#121214] border border-zinc-800 rounded-xl p-6 shadow-sm flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="font-display text-sm font-bold text-white">Cash Flow Breakdown</h2>
            <p className="text-[11px] text-zinc-500">Comparing Inflow (Payments) and Outflow (Expenses) streams</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <span>Inflow</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Outflow</span>
            </div>
          </div>
        </div>

        <div className="h-64 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="name" 
                stroke="#52525b" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
              />
              <YAxis 
                stroke="#52525b" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#09090b',
                  borderColor: '#27272a',
                  color: 'white',
                  borderRadius: '8px',
                  fontSize: '11px',
                }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              <Area type="monotone" dataKey="expenses" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorExpenses)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity Table Card with Ant Design */}
      <div className="bg-[#121214] border border-zinc-800 rounded-xl p-6 shadow-sm flex flex-col overflow-hidden">
        <h2 className="font-display text-sm font-bold text-white mb-4">Recent Transactions</h2>
        
        <Table 
          columns={columns} 
          dataSource={TABLE_DATA} 
          pagination={false}
          className="custom-antd-dark-table"
          rowClassName="hover:bg-zinc-900/40 transition-all border-zinc-850"
          style={{ background: 'transparent' }}
        />
      </div>

    </div>
  );
}
