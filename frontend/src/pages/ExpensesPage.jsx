import React from 'react';
import { Table, Tag, Space, Button } from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  CreditCardOutlined,
  ShoppingOutlined,
  ToolOutlined
} from '@ant-design/icons';

// Mock Expenses dataset
const EXPENSE_DATA = [
  { key: 'EXP-401', id: 'EXP-401', desc: 'Vercel Serverless Hosting', category: 'infrastructure', date: 'May 12, 2026', amount: 120, status: 'cleared' },
  { key: 'EXP-402', id: 'EXP-402', desc: 'AWS Compute Clusters', category: 'infrastructure', date: 'May 08, 2026', amount: 450, status: 'cleared' },
  { key: 'EXP-403', id: 'EXP-403', desc: 'Github Copilot seats', category: 'software-licences', date: 'May 01, 2026', amount: 40, status: 'cleared' },
  { key: 'EXP-404', id: 'EXP-404', desc: 'DigitalOcean database backup', category: 'infrastructure', date: 'Apr 24, 2026', amount: 80, status: 'cleared' },
  { key: 'EXP-405', id: 'EXP-405', desc: 'Supabase Postgres Instance', category: 'infrastructure', date: 'Apr 18, 2026', amount: 110, status: 'cleared' },
];

export default function ExpensesPage() {
  
  const columns = [
    {
      title: 'Expense ID',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <strong className="text-zinc-200 text-xs font-mono">{text}</strong>,
    },
    {
      title: 'Item / Target',
      dataIndex: 'desc',
      key: 'desc',
      render: (text) => <span className="text-zinc-350 text-xs font-medium">{text}</span>,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (cat) => {
        let color = 'default';
        if (cat === 'infrastructure') color = 'blue';
        if (cat === 'software-licences') color = 'purple';
        if (cat === 'ops-marketing') color = 'orange';
        return (
          <Tag color={color} className="border-none rounded font-bold text-[9px] uppercase px-2 py-0.5">
            {cat}
          </Tag>
        );
      },
    },
    {
      title: 'Billing Date',
      dataIndex: 'date',
      key: 'date',
      render: (text) => <span className="text-zinc-450 text-xs">{text}</span>,
    },
    {
      title: 'Amount Spent',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => <strong className="text-zinc-200 text-xs font-semibold">${amount.toLocaleString()}</strong>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color="success" className="border-none rounded font-bold text-[9px] uppercase px-2 py-0.5">
          {status}
        </Tag>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 md:gap-8 animate-fade-in">
      
      {/* Title Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-xl md:text-2xl font-extrabold text-white tracking-tight">
            Outflow Expenses
          </h1>
          <p className="text-xs text-zinc-450 mt-1">
            Track hosting dependencies, licensing payments, and salaries outflows.
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
          Add Expense
        </Button>
      </div>

      {/* Invoice Overview Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Expenses */}
        <div className="bg-[#121214] border border-zinc-800 rounded-xl p-5 flex flex-col relative overflow-hidden shadow-sm">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Total Expenditures</span>
          <span className="font-display text-xl font-bold text-white mt-2">$3,870</span>
        </div>
        {/* Infrastructure Cost */}
        <div className="bg-[#121214] border border-zinc-800 rounded-xl p-5 flex flex-col relative overflow-hidden shadow-sm">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Infrastructure Hosting</span>
          <span className="font-display text-xl font-bold text-sky-400 mt-2">$2,630</span>
        </div>
        {/* Tooling and Subscriptions */}
        <div className="bg-[#121214] border border-zinc-800 rounded-xl p-5 flex flex-col relative overflow-hidden shadow-sm">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Software Licenses</span>
          <span className="font-display text-xl font-bold text-purple-400 mt-2">$1,240</span>
        </div>
      </div>

      {/* Main Expenses Table List Card */}
      <div className="bg-[#121214] border border-zinc-800 rounded-xl p-6 shadow-sm flex flex-col overflow-hidden">
        
        {/* Sub-card search actions header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center bg-[#18181b] border border-zinc-800 rounded-lg px-3 py-1.5 w-64 gap-2">
            <SearchOutlined className="text-zinc-500 text-sm" />
            <input
              type="text"
              className="bg-transparent border-none outline-none text-xs text-zinc-200 placeholder-zinc-500 w-full"
              placeholder="Search expenses..."
            />
          </div>
        </div>

        <Table 
          columns={columns} 
          dataSource={EXPENSE_DATA} 
          pagination={false}
          className="custom-antd-dark-table"
          rowClassName="hover:bg-zinc-900/40 transition-all border-zinc-850"
          style={{ background: 'transparent' }}
        />
      </div>

    </div>
  );
}
