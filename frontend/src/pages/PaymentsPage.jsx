import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Input, Modal, Form, message, Select, Tag } from 'antd';
import { PlusOutlined, SearchOutlined, CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api/payments';
const INVOICES_URL = 'http://localhost:5001/api/invoices';

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const getAuthConfig = () => {
    const token = localStorage.getItem('flowbooks_token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [paymentsRes, invoicesRes] = await Promise.all([
        axios.get(API_URL, getAuthConfig()),
        axios.get(INVOICES_URL, getAuthConfig())
      ]);
      
      if (paymentsRes.data.success) {
        setPayments(paymentsRes.data.data);
      }
      if (invoicesRes.data.success) {
        // Filter out fully paid invoices to ensure sellers only see outstanding collections
        const outstanding = invoicesRes.data.data.filter(inv => inv.status !== 'paid');
        setInvoices(outstanding);
      }
      setError(null);
    } catch (err) {
      console.error('Failed to sync payment data:', err);
      setError('Failed to fetch payment ledger.');
      message.error('Database connection failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredPayments = payments.filter(p => {
    const query = searchQuery.toLowerCase();
    return (
      (p.customerName || '').toLowerCase().includes(query) ||
      (p.invoice?.invoiceNumber || '').toLowerCase().includes(query) ||
      (p.transactionId || '').toLowerCase().includes(query)
    );
  });

  const handleLogPayment = async (values) => {
    try {
      const payload = {
        invoiceId: values.invoiceId,
        amount: values.amount,
        paymentMethod: values.paymentMethod,
        paymentStatus: 'Paid',
        transactionId: values.transactionId || `TRX-${Math.floor(Math.random() * 1000000)}`,
        notes: values.notes
      };
      
      const response = await axios.post(API_URL, payload, getAuthConfig());
      if (response.data.success) {
        message.success('Payment settled and invoice balance auto-updated!');
        fetchData(); // Refresh both payments and invoices to sync balances
        setIsModalOpen(false);
        form.resetFields();
      }
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to settle payment.');
    }
  };

  const columns = [
    {
      title: 'Invoice Ref',
      dataIndex: ['invoice', 'invoiceNumber'],
      key: 'invoiceRef',
      render: (text) => <strong className="text-zinc-200 text-xs">{text || 'N/A'}</strong>,
    },
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (text) => <span className="text-zinc-400 text-xs font-semibold">{text}</span>,
    },
    {
      title: 'Amount Processed',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => <strong className="text-emerald-400 text-xs font-bold">+${amount ? amount.toLocaleString() : '0'}</strong>,
    },
    {
      title: 'Method',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (text) => (
        <span className="text-zinc-450 text-xs">{text}</span>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'paymentDate',
      key: 'paymentDate',
      render: (date) => <span className="text-zinc-450 text-xs">{new Date(date).toLocaleDateString()}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (status) => {
        let color = status === 'Paid' ? 'green' : status === 'Pending' ? 'orange' : 'red';
        let bgClass = status === 'Paid' ? 'bg-emerald-950/40 text-emerald-400' : 'bg-amber-950/40 text-amber-400';
        return (
          <Tag className={`border-none rounded font-bold text-[9px] uppercase px-2 py-0.5 ${bgClass}`}>
            {status}
          </Tag>
        )
      },
    },
    {
      title: 'Transaction ID',
      dataIndex: 'transactionId',
      key: 'transactionId',
      render: (text) => <span className="text-zinc-500 text-[10px] uppercase font-mono">{text || '--'}</span>,
    },
  ];

  const totalCollected = payments.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <div className="flex flex-col gap-5 md:gap-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-xl md:text-2xl font-extrabold text-white tracking-tight">Payments & Settlements</h1>
          <p className="text-xs text-zinc-450 mt-0.5">Track collections, log partial payments, and monitor outstanding balances.</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)} style={{ backgroundColor: 'white', color: 'black', fontWeight: 650, borderRadius: '8px', fontSize: '12px', height: '38px', boxShadow: '0 4px 12px rgba(255, 255, 255, 0.1)' }}>Log Settlement</Button>
      </div>

      {error && (
        <div className="bg-amber-955/20 border border-amber-900/60 rounded-xl px-4 py-3 text-xs text-amber-300 flex items-center gap-2">
          <ExclamationCircleOutlined className="text-sm" />
          <span>{error}</span>
        </div>
      )}

      {/* Analytics Cards Header */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#121214] border border-zinc-850 rounded-xl p-5 flex flex-col gap-1 shadow-sm hover-card-trigger">
           <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Total Collected</span>
           <span className="text-emerald-400 text-xl font-bold">${totalCollected.toLocaleString()}</span>
        </div>
        <div className="bg-[#121214] border border-zinc-850 rounded-xl p-5 flex flex-col gap-1 shadow-sm hover-card-trigger">
           <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Payments Processed</span>
           <span className="text-white text-xl font-bold">{payments.length} <span className="text-xs text-zinc-500 font-normal">transactions</span></span>
        </div>
        <div className="bg-[#121214] border border-zinc-850 rounded-xl p-5 flex flex-col gap-1 shadow-sm hover-card-trigger">
           <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Outstanding Invoices</span>
           <span className="text-amber-400 text-xl font-bold">{invoices.length} <span className="text-xs text-zinc-500 font-normal">awaiting collection</span></span>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-[#121214] border border-zinc-850 rounded-2xl p-4 sm:p-5 md:p-6 flex flex-col gap-4 shadow-sm hover-card-trigger transition-all duration-300">
        <div className="flex justify-end gap-4">
          <Input prefix={<SearchOutlined className="text-zinc-500 text-xs mr-1" />} placeholder="Search customer, invoice, or TRX..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full md:max-w-xs h-9 text-xs" style={{ backgroundColor: '#18181b', borderColor: '#27272a', color: 'white', borderRadius: '8px', fontSize: '12px' }} />
        </div>
        <Table columns={columns} dataSource={filteredPayments} loading={loading} rowKey="_id" scroll={{ x: 680 }} pagination={{ pageSize: 6, className: "custom-antd-dark-pagination" }} className="custom-antd-dark-table" rowClassName="hover:bg-zinc-900/40 transition-all border-zinc-850" style={{ background: 'transparent' }} />
      </div>

      {/* Log Payment Modal */}
      <Modal title={<span className="text-white font-bold text-base font-display">Settle Invoice Payment</span>} open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null} closeIcon={<CloseOutlined className="text-zinc-500 hover:text-white" />} className="custom-dark-modal" centered width={420}>
        <Form form={form} layout="vertical" onFinish={handleLogPayment} className="mt-4 flex flex-col gap-2">
          
          <Form.Item name="invoiceId" label={<span className="text-[10px] font-bold text-zinc-500 uppercase">Select Unpaid Invoice</span>} rules={[{ required: true }]} style={{ marginBottom: '12px' }}>
            <Select placeholder="Choose an outstanding invoice" dropdownStyle={{ backgroundColor: '#121214', border: '1px solid #27272a' }} style={{ height: '38px' }} onChange={(val) => {
              const selected = invoices.find(i => i._id === val);
              if (selected) {
                 const remainingBalance = selected.amount - (selected.paidAmount || 0);
                 form.setFieldsValue({ amount: remainingBalance });
              }
            }}>
              {invoices.map(inv => (
                <Select.Option key={inv._id} value={inv._id}>
                  <div className="flex justify-between items-center text-xs">
                     <span>{inv.invoiceNumber} - {inv.clientName}</span>
                     <span className="text-rose-400 font-bold">${(inv.amount - (inv.paidAmount || 0)).toLocaleString()} Due</span>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="amount" label={<span className="text-[10px] font-bold text-zinc-500 uppercase">Payment Amount ($)</span>} rules={[{ required: true }]} style={{ marginBottom: '12px' }}><Input type="number" step="0.01" style={{ backgroundColor: '#18181b', borderColor: '#27272a', color: 'white', height: '38px', borderRadius: '8px', fontSize: '12px' }} /></Form.Item>
            <Form.Item name="paymentMethod" label={<span className="text-[10px] font-bold text-zinc-500 uppercase">Method</span>} rules={[{ required: true }]} style={{ marginBottom: '12px' }}>
              <Select dropdownStyle={{ backgroundColor: '#121214', border: '1px solid #27272a' }} style={{ height: '38px' }}>
                 {['Stripe', 'Credit Card', 'Bank Transfer', 'PayPal', 'Cash'].map(m => <Select.Option key={m} value={m}>{m}</Select.Option>)}
              </Select>
            </Form.Item>
          </div>

          <Form.Item name="transactionId" label={<span className="text-[10px] font-bold text-zinc-500 uppercase">Transaction ID (Optional)</span>} style={{ marginBottom: '16px' }}><Input style={{ backgroundColor: '#18181b', borderColor: '#27272a', color: 'white', height: '38px', borderRadius: '8px', fontSize: '12px' }} /></Form.Item>
          
          <Button type="primary" htmlType="submit" block style={{ backgroundColor: 'white', color: 'black', fontWeight: 650, borderRadius: '8px', height: '40px', fontSize: '12px' }}>Confirm Settlement</Button>
        </Form>
      </Modal>
    </div>
  );
}
