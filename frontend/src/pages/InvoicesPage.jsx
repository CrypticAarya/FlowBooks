import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, Button, Input, Modal, Form, Select, message } from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  CloseOutlined
} from '@ant-design/icons';
import axios from 'axios';

// Backend API Base Endpoint
const API_URL = 'http://localhost:5001/api/invoices';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // Fetch Invoices from Express + MongoDB backend
  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      if (response.data && response.data.success) {
        setInvoices(response.data.data);
        setError(null);
      }
    } catch (err) {
      console.error('Failed to sync invoices:', err);
      setError('Database offline. Render cached results.');
      message.warning('Database sync failed! Running on local cache.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Dynamic calculations based on live invoice list
  const totalInvoiced = invoices.reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalPending = invoices.filter(i => i.status === 'pending').reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalOverdue = invoices.filter(i => i.status === 'overdue').reduce((sum, item) => sum + (item.amount || 0), 0);

  // Filters logic
  const filteredInvoices = invoices.filter((item) => {
    const matchesSearch = 
      (item.clientName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.invoiceNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.project || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle Form Submission inside modal
  const handleCreateInvoice = async (values) => {
    try {
      // Generate a dynamic Invoice Number
      const invoiceNumber = `INV-${Math.floor(1000 + Math.random() * 9000)}`;
      
      const payload = {
        invoiceNumber,
        clientName: values.client,
        project: values.project || 'General Consulting',
        amount: parseFloat(values.amount),
        dueDate: values.due || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: values.status || 'pending',
      };

      const response = await axios.post(API_URL, payload);
      if (response.data && response.data.success) {
        setInvoices([response.data.data, ...invoices]);
        message.success(`Successfully issued invoice ${payload.invoiceNumber} for $${payload.amount.toLocaleString()}!`);
      }
      setIsModalOpen(false);
      form.resetFields();
    } catch (err) {
      console.error('Failed to issue invoice:', err);
      message.error(err.response?.data?.message || 'Failed to sync new invoice statement.');
    }
  };

  // Handle Deleting an Invoice from live backend
  const handleDeleteInvoice = async (id, invoiceNumber) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      if (response.data && response.data.success) {
        setInvoices(invoices.filter(i => i._id !== id));
        message.success(`Invoice ${invoiceNumber} deleted successfully.`);
      }
    } catch (err) {
      console.error('Failed to remove invoice:', err);
      message.error('Failed to remove invoice statement.');
    }
  };

  const columns = [
    {
      title: 'Invoice ID',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
      render: (text) => <strong className="text-zinc-200 text-xs font-mono">{text}</strong>,
    },
    {
      title: 'Client',
      dataIndex: 'clientName',
      key: 'clientName',
      render: (text, record) => (
        <div className="flex flex-col">
          <span className="text-zinc-250 text-xs font-bold">{text}</span>
          <span className="text-[10px] text-zinc-500">{record.project || 'General Consulting'}</span>
        </div>
      ),
    },
    {
      title: 'Issued Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (_, record) => {
        const date = record.createdAt ? new Date(record.createdAt) : new Date();
        return <span className="text-zinc-450 text-xs font-medium">{date.toISOString().split('T')[0]}</span>;
      },
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (text) => <span className="text-zinc-450 text-xs font-medium">{text}</span>,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => <strong className="text-zinc-200 text-xs font-bold">${amount ? amount.toLocaleString() : '0'}</strong>,
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
            onClick={() => message.info(`Viewing details for statement ${record.invoiceNumber}`)}
          >
            View
          </button>
          <button 
            className="text-xs text-rose-500 hover:text-rose-450 font-semibold cursor-pointer border-none bg-transparent"
            onClick={() => handleDeleteInvoice(record._id, record.invoiceNumber)}
          >
            Delete
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
          Issue Invoice
        </Button>
      </div>

      {/* Sync Warning banner if DB Offline */}
      {error && (
        <div className="bg-amber-955/20 border border-amber-900/60 rounded-xl px-4 py-3 text-xs text-amber-300 flex items-center gap-2">
          <ExclamationCircleOutlined className="text-sm" />
          <span>{error}</span>
        </div>
      )}

      {/* Financial Overview Metrics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#121214] border border-zinc-850 hover-card-trigger rounded-2xl p-4 flex flex-col gap-1 transition-all duration-300">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Total Invoiced</span>
          <span className="text-lg md:text-xl font-display font-black text-white mt-1">
            ${totalInvoiced.toLocaleString()}
          </span>
          <span className="text-[9px] text-zinc-500">Gross billing statements</span>
        </div>

        <div className="bg-[#121214] border border-zinc-850 hover-card-trigger rounded-2xl p-4 flex flex-col gap-1 transition-all duration-300">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider text-emerald-500">Total Settled</span>
          <span className="text-lg md:text-xl font-display font-black text-emerald-400 mt-1">
            ${totalPaid.toLocaleString()}
          </span>
          <span className="text-[9px] text-zinc-500">Cleared balance</span>
        </div>

        <div className="bg-[#121214] border border-zinc-850 hover-card-trigger rounded-2xl p-4 flex flex-col gap-1 transition-all duration-300">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider text-amber-500">Total Pending</span>
          <span className="text-lg md:text-xl font-display font-black text-amber-400 mt-1">
            ${totalPending.toLocaleString()}
          </span>
          <span className="text-[9px] text-zinc-500">Awaiting clearance</span>
        </div>

        <div className="bg-[#121214] border border-zinc-850 hover-card-trigger rounded-2xl p-4 flex flex-col gap-1 transition-all duration-300">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider text-rose-500">Total Overdue</span>
          <span className="text-lg md:text-xl font-display font-black text-rose-400 mt-1">
            ${totalOverdue.toLocaleString()}
          </span>
          <span className="text-[9px] text-zinc-500">Outstanding statements</span>
        </div>
      </div>

      {/* Main invoices controls card */}
      <div className="bg-[#121214] border border-zinc-850 rounded-2xl p-4 sm:p-5 md:p-6 hover-card-trigger transition-all duration-300 flex flex-col gap-4">
        
        {/* Filtering & Searching Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Quick status tabs (Vercel Style) */}
          <div className="flex bg-[#18181b] border border-zinc-850 p-1 rounded-lg self-start">
            {['all', 'paid', 'pending', 'overdue'].map((tab) => (
              <button
                key={tab}
                className={`px-3 py-1.5 rounded-md text-xs font-bold capitalize transition-all cursor-pointer border-none ${
                  statusFilter === tab 
                    ? 'bg-[#27272a] border-[#3f3f46] text-white' 
                    : 'text-zinc-500 hover:text-zinc-350 bg-transparent'
                }`}
                onClick={() => setStatusFilter(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search query input */}
          <Input 
            prefix={<SearchOutlined className="text-zinc-500 text-xs mr-1" />}
            placeholder="Search by client, ID, or project..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:max-w-xs h-9 text-xs"
            style={{
              backgroundColor: '#18181b',
              borderColor: '#27272a',
              color: 'white',
              borderRadius: '8px',
              fontSize: '12px'
            }}
          />
        </div>

        {/* Ant Design Data Table */}
        <Table 
          columns={columns} 
          dataSource={filteredInvoices} 
          loading={loading}
          rowKey="_id"
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
