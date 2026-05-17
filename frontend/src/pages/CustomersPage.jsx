import React from 'react';
import { Table, Tag, Space, Button, Avatar } from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  UserOutlined,
  MailOutlined
} from '@ant-design/icons';

// Mock Customers data
const CUSTOMER_DATA = [
  { key: 'CUST-1', name: 'Acme Corp', contact: 'Marcus Aurelius', email: 'marcus@acme.corp', ltv: 34500, status: 'active', activeProject: 'Enterprise SaaS Dev' },
  { key: 'CUST-2', name: 'Vercel Inc', contact: 'Sarah Connor', email: 'sarah@vercel.com', ltv: 12400, status: 'active', activeProject: 'NextJS Optimization' },
  { key: 'CUST-3', name: 'DesignCraft Ltd', contact: 'Jon Doe', email: 'jon@designcraft.io', ltv: 8600, status: 'active', activeProject: '3D assets pack' },
  { key: 'CUST-4', name: 'Nova Corp', contact: 'Nova Light', email: 'nova@light.co', ltv: 15400, status: 'active', activeProject: 'SaaS UX Audit' },
  { key: 'CUST-5', name: 'SkyNet LLC', contact: 'T-800 Cyber', email: 't800@skynet.ai', ltv: 45000, status: 'suspended', activeProject: 'Predictive Targeting API' },
];

export default function CustomersPage() {
  
  const columns = [
    {
      title: 'Customer',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <Avatar 
            size={32}
            style={{ 
              backgroundColor: '#1f1f23', 
              color: '#d4d4d8',
              fontWeight: 650,
              fontSize: '11px',
              border: '1px solid #27272a'
            }}
          >
            {text.charAt(0)}
          </Avatar>
          <div className="flex flex-col min-w-0">
            <strong className="text-zinc-200 text-xs font-semibold truncate">{text}</strong>
            <span className="text-[10px] text-zinc-500 truncate">{record.contact}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Contact Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => (
        <span className="text-xs text-zinc-450 flex items-center gap-1.5">
          <MailOutlined className="text-[10px]" />
          {text}
        </span>
      ),
    },
    {
      title: 'Active Contract',
      dataIndex: 'activeProject',
      key: 'activeProject',
      render: (text) => <span className="text-xs text-zinc-400">{text}</span>,
    },
    {
      title: 'Lifetime Value (LTV)',
      dataIndex: 'ltv',
      key: 'ltv',
      render: (ltv) => <strong className="text-zinc-200 text-xs font-semibold">${ltv.toLocaleString()}</strong>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'success' : 'error'} className="border-none rounded font-bold text-[9px] uppercase px-2 py-0.5">
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
            Client Directory
          </h1>
          <p className="text-xs text-zinc-450 mt-1">
            Browse and coordinate customer contracts and operational pipeline profiles.
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
          Add Customer
        </Button>
      </div>

      {/* Overview Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Customers */}
        <div className="bg-[#121214] border border-zinc-800 rounded-xl p-5 flex flex-col relative overflow-hidden shadow-sm">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Active Portfolio</span>
          <span className="font-display text-xl font-bold text-white mt-2">5 Corporate Accounts</span>
        </div>
        {/* Total Value */}
        <div className="bg-[#121214] border border-zinc-800 rounded-xl p-5 flex flex-col relative overflow-hidden shadow-sm">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Cumulative LTV</span>
          <span className="font-display text-xl font-bold text-emerald-400 mt-2">$115,900</span>
        </div>
        {/* Retention Rate */}
        <div className="bg-[#121214] border border-zinc-800 rounded-xl p-5 flex flex-col relative overflow-hidden shadow-sm">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Accounts Retention</span>
          <span className="font-display text-xl font-bold text-indigo-400 mt-2">100% Retained</span>
        </div>
      </div>

      {/* Main Table List Card */}
      <div className="bg-[#121214] border border-zinc-800 rounded-xl p-6 shadow-sm flex flex-col overflow-hidden">
        
        {/* Sub-card search actions header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center bg-[#18181b] border border-zinc-800 rounded-lg px-3 py-1.5 w-64 gap-2">
            <SearchOutlined className="text-zinc-500 text-sm" />
            <input
              type="text"
              className="bg-transparent border-none outline-none text-xs text-zinc-200 placeholder-zinc-500 w-full"
              placeholder="Search directory..."
            />
          </div>
        </div>

        <Table 
          columns={columns} 
          dataSource={CUSTOMER_DATA} 
          pagination={false}
          className="custom-antd-dark-table"
          rowClassName="hover:bg-zinc-900/40 transition-all border-zinc-850"
          style={{ background: 'transparent' }}
        />
      </div>

    </div>
  );
}
