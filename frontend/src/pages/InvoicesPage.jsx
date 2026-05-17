import React, { useState } from 'react';
import { Table, Tag, Space, Button, Input, Modal, Form, Select, message } from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  CloseOutlined
} from '@ant-design/icons';

// Initial Mock Dataset for B2B SaaS Statements
const INITIAL_INVOICES = [
  { key: 'INV-1001', id: 'INV-1001', client: 'Acme Corp', project: 'Enterprise SaaS Dev', issued: '2026-05-15', due: '2026-06-15', amount: 4800, status: 'paid' },
  { key: 'INV-1002', id: 'INV-1002', client: 'DesignCraft Ltd', project: 'Interactive 3D Assets', issued: '2026-05-04', due: '2026-06-04', amount: 3200, status: 'pending' },
  { key: 'INV-1003', id: 'INV-1003', client: 'Sarah Connor', project: 'UI Consulting & Audits', issued: '2026-05-10', due: '2026-06-10', amount: 1500, status: 'paid' },
  { key: 'INV-1004', id: 'INV-1004', client: 'Nova Corp', project: 'Mobile Frontend Development', issued: '2026-04-28', due: '2026-05-28', amount: 2400, status: 'pending' },
  { key: 'INV-1005', id: 'INV-1005', client: 'SkyNet LLC', project: 'Machine Learning Infrastructure', issued: '2026-03-12', due: '2026-04-12', amount: 9800, status: 'overdue' },
  { key: 'INV-1006', id: 'INV-1006', client: 'Supabase Inc', project: 'Database API Migration', issued: '2026-05-18', due: '2026-06-18', amount: 4200, status: 'pending' },
  { key: 'INV-1007', id: 'INV-1007', client: 'Tailwind Labs', project: 'CSS Design System Strategy', issued: '2026-05-02', due: '2026-06-02', amount: 1900, status: 'paid' },
  { key: 'INV-1008', id: 'INV-1008', client: 'Vercel Inc', project: 'Edge Functions Implementation', issued: '2026-04-15', due: '2026-05-15', amount: 5500, status: 'overdue' },
  { key: 'INV-1009', id: 'INV-1009', client: 'Linear App', project: 'Task Engine Refactoring', issued: '2026-05-08', due: '2026-06-08', amount: 3700, status: 'paid' },
  { key: 'INV-1010', id: 'INV-1010', client: 'Figma Corp', project: 'Vector Layout Tools consulting', issued: '2026-05-12', due: '2026-06-12', amount: 6200, status: 'pending' },
];

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // Dynamic calculations based on live invoice list
  const totalInvoiced = invoices.reduce((sum, item) => sum + item.amount, 0);
  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((sum, item) => sum + item.amount, 0);
  const totalPending = invoices.filter(i => i.status === 'pending').reduce((sum, item) => sum + item.amount, 0);
  const totalOverdue = invoices.filter(i => i.status === 'overdue').reduce((sum, item) => sum + item.amount, 0);

  // Filters logic
  const filteredInvoices = invoices.filter((item) => {
    const matchesSearch = 
      item.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.project.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle Form Submission inside modal
  const handleCreateInvoice = (values) => {
    const newInvoice = {
      key: `INV-${Date.now()}`,
      id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      client: values.client,
      project: values.project || 'General Consulting',
      issued: values.issued || new Date().toISOString().split('T')[0],
      due: values.due || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      amount: parseFloat(values.amount),
      status: values.status,
    };

    setInvoices([newInvoice, ...invoices]);
    setIsModalOpen(false);
    form.resetFields();
    message.success(`Successfully issued invoice ${newInvoice.id} for $${newInvoice.amount.toLocaleString()}!`);
  };

  const columns = [
    {
      title: 'Invoice ID',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <strong className="text-zinc-200 text-xs font-mono">{text}</strong>,
    },
    {
      title: 'Client',
      dataIndex: 'client',
      key: 'client',
      render: (text, record) => (
        <div className="flex flex-col">
          <span className="text-zinc-250 text-xs font-bold">{text}</span>
          <span className="text-[10px] text-zinc-500">{record.project}</span>
        </div>
      ),
    },
    {
      title: 'Issued Date',
      dataIndex: 'issued',
      key: 'issued',
      render: (text) => <span className="text-zinc-450 text-xs font-medium">{text}</span>,
    },
    {
      title: 'Due Date',
      dataIndex: 'due',
      key: 'due',
      render: (text) => <span className="text-zinc-450 text-xs font-medium">{text}</span>,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => <strong className="text-zinc-200 text-xs font-bold">${amount.toLocaleString()}</strong>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'default';
        let icon = null;
        if (status === 'paid') {
          color = 'success';
          icon = <CheckCircleOutlined />;
        } else if (status === 'pending') {
          color = 'warning';
          icon = <ClockCircleOutlined />;
        } else if (status === 'overdue') {
          color = 'error';
          icon = <ExclamationCircleOutlined />;
        }
        return (
          <Tag 
            icon={icon} 
            color={color} 
            className="border-none rounded font-bold text-[9px] uppercase px-2 py-0.5"
          >
            {status}
          </Tag>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <button 
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer border-none bg-transparent"
            onClick={() => message.info(`Viewing details for statement ${record.id}`)}
          >
            View
          </button>
          <button 
            className="text-xs text-zinc-500 hover:text-zinc-300 font-semibold cursor-pointer border-none bg-transparent"
            onClick={() => message.success(`Downloaded Invoice PDF ${record.id}!`)}
          >
            Download
          </button>
        </Space>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5 md:gap-6 animate-fade-in">
      
      {/* Title Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-xl md:text-2xl font-extrabold text-white tracking-tight">
            Billing & Invoices
          </h1>
          <p className="text-xs text-zinc-450 mt-0.5">
            Create, issue, and manage clients financial statements.
          </p>
        </div>
        
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
          style={{
            backgroundColor: 'white',
            borderColor: 'white',
            color: 'black',
            fontWeight: 650,
            borderRadius: '8px',
            fontSize: '12px',
            height: '38px',
            boxShadow: '0 4px 12px rgba(255, 255, 255, 0.1)'
          }}
        >
          Create Invoice
        </Button>
      </div>

      {/* Invoice Overview Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {/* Total Invoiced */}
        <div className="bg-[#121214] border border-zinc-850 rounded-xl p-4 sm:p-5 flex flex-col relative overflow-hidden shadow-sm hover-card-trigger">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Total Invoiced</span>
          <span className="font-display text-xl font-bold text-white mt-1.5">${totalInvoiced.toLocaleString()}</span>
        </div>
        {/* Total Paid */}
        <div className="bg-[#121214] border border-zinc-850 rounded-xl p-4 sm:p-5 flex flex-col relative overflow-hidden shadow-sm hover-card-trigger">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Payments Settled</span>
          <span className="font-display text-xl font-bold text-emerald-400 mt-1.5">${totalPaid.toLocaleString()}</span>
        </div>
        {/* Total Pending */}
        <div className="bg-[#121214] border border-zinc-850 rounded-xl p-4 sm:p-5 flex flex-col relative overflow-hidden shadow-sm hover-card-trigger">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Outstanding</span>
          <span className="font-display text-xl font-bold text-amber-400 mt-1.5">${totalPending.toLocaleString()}</span>
        </div>
        {/* Total Overdue */}
        <div className="bg-[#121214] border border-zinc-850 rounded-xl p-4 sm:p-5 flex flex-col relative overflow-hidden shadow-sm hover-card-trigger">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Overdue Balance</span>
          <span className="font-display text-xl font-bold text-rose-450 mt-1.5">${totalOverdue.toLocaleString()}</span>
        </div>
      </div>

      {/* Main Billing Table List Card */}
      <div className="bg-[#121214] border border-zinc-850 rounded-xl p-4 sm:p-5 md:p-6 shadow-sm flex flex-col overflow-hidden hover-card-trigger">
        
        {/* Sub-card search actions header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div className="flex items-center bg-[#18181b] border border-zinc-850 rounded-lg px-3 py-1.5 w-full sm:w-64 gap-2">
            <SearchOutlined className="text-zinc-500 text-sm" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-xs text-zinc-200 placeholder-zinc-500 w-full"
              placeholder="Search invoices or clients..."
            />
          </div>

          {/* Vercel-style status filter tab row */}
          <div className="flex bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 rounded-lg p-0.5 gap-0.5 self-start sm:self-center">
            {['all', 'paid', 'pending', 'overdue'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`border-none px-3 py-1.5 text-xs font-semibold rounded-md cursor-pointer transition-all capitalize ${
                  statusFilter === status
                    ? 'bg-white dark:bg-zinc-900 text-white dark:text-zinc-100 shadow-sm'
                    : 'bg-transparent text-slate-500 dark:text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <Table 
          columns={columns} 
          dataSource={filteredInvoices} 
          scroll={{ x: 680 }}
          pagination={{
            pageSize: 6,
            showSizeChanger: false,
            className: "custom-antd-dark-pagination"
          }}
          className="custom-antd-dark-table"
          rowClassName="hover:bg-zinc-900/40 transition-all border-zinc-850"
          style={{ background: 'transparent' }}
        />
      </div>

      {/* Premium Create Invoice Modal */}
      <Modal
        title={<span className="text-white font-bold font-display text-base">New Billing Statement</span>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        closeIcon={<CloseOutlined className="text-zinc-500 hover:text-white" />}
        className="custom-dark-modal"
        centered
        width={420}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateInvoice}
          requiredMark={false}
          className="flex flex-col gap-4 mt-2"
        >
          {/* Client input */}
          <Form.Item
            name="client"
            label={<span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Client Name</span>}
            rules={[{ required: true, message: 'Please provide a client name' }]}
            style={{ marginBottom: '12px' }}
          >
            <Input 
              placeholder="e.g. Supabase Inc" 
              style={{ backgroundColor: '#18181b', borderColor: '#27272a', color: 'white', borderRadius: '8px', height: '38px', fontSize: '12px' }}
            />
          </Form.Item>

          {/* Project input */}
          <Form.Item
            name="project"
            label={<span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Project / Description</span>}
            style={{ marginBottom: '12px' }}
          >
            <Input 
              placeholder="e.g. Database API Setup" 
              style={{ backgroundColor: '#18181b', borderColor: '#27272a', color: 'white', borderRadius: '8px', height: '38px', fontSize: '12px' }}
            />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            {/* Amount input */}
            <Form.Item
              name="amount"
              label={<span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Amount ($)</span>}
              rules={[{ required: true, message: 'Please specify an amount' }]}
              style={{ marginBottom: '12px' }}
            >
              <Input 
                type="number"
                min="1"
                placeholder="2500" 
                style={{ backgroundColor: '#18181b', borderColor: '#27272a', color: 'white', borderRadius: '8px', height: '38px', fontSize: '12px' }}
              />
            </Form.Item>

            {/* Status Selector */}
            <Form.Item
              name="status"
              label={<span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Initial Status</span>}
              initialValue="pending"
              style={{ marginBottom: '12px' }}
            >
              <Select
                dropdownStyle={{ backgroundColor: '#121214', border: '1px solid #27272a' }}
                style={{ height: '38px' }}
              >
                <Select.Option value="paid">Paid</Select.Option>
                <Select.Option value="pending">Pending</Select.Option>
                <Select.Option value="overdue">Overdue</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Issued Date */}
            <Form.Item
              name="issued"
              label={<span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Issue Date</span>}
              style={{ marginBottom: '16px' }}
            >
              <input 
                type="date"
                defaultValue={new Date().toISOString().split('T')[0]}
                className="w-full bg-[#18181b] border border-zinc-800 text-zinc-200 rounded-lg px-3 h-[38px] text-xs outline-none focus:border-indigo-500"
              />
            </Form.Item>

            {/* Due Date */}
            <Form.Item
              name="due"
              label={<span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Due Date</span>}
              style={{ marginBottom: '16px' }}
            >
              <input 
                type="date"
                defaultValue={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                className="w-full bg-[#18181b] border border-zinc-800 text-zinc-200 rounded-lg px-3 h-[38px] text-xs outline-none focus:border-indigo-500"
              />
            </Form.Item>
          </div>

          {/* Action trigger button */}
          <Form.Item style={{ marginBottom: 0 }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              style={{
                backgroundColor: 'white',
                borderColor: 'white',
                color: 'black',
                fontWeight: 650,
                borderRadius: '8px',
                height: '40px',
                fontSize: '12px',
                boxShadow: '0 4px 12px rgba(255, 255, 255, 0.1)'
              }}
            >
              Issue Invoice Statement
            </Button>
          </Form.Item>
        </Form>
      </Modal>

    </div>
  );
}
