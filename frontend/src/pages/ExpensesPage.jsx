import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, Button, Input, Modal, Form, Select, message } from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  CloseOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api/expenses';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  // Helper for Authorization Headers
  const getAuthConfig = () => {
    const token = localStorage.getItem('flowbooks_token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL, getAuthConfig());
      if (response.data && response.data.success) {
        setExpenses(response.data.data);
        setError(null);
      }
    } catch (err) {
      console.error('Failed to sync expenses:', err);
      setError('Failed to fetch expenses.');
      message.error('Failed to sync data from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const totalExpenses = expenses.reduce((sum, item) => sum + (item.amount || 0), 0);

  const filteredExpenses = expenses.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      (item.title || '').toLowerCase().includes(query) ||
      (item.category || '').toLowerCase().includes(query) ||
      (item.paymentMethod || '').toLowerCase().includes(query)
    );
  });

  const handleCreateExpense = async (values) => {
    try {
      const payload = {
        title: values.title,
        amount: parseFloat(values.amount),
        category: values.category,
        paymentMethod: values.paymentMethod,
        expenseDate: values.expenseDate,
        notes: values.notes,
      };

      const response = await axios.post(API_URL, payload, getAuthConfig());
      if (response.data && response.data.success) {
        setExpenses([response.data.data, ...expenses]);
        message.success(`Logged expense for $${payload.amount.toLocaleString()}!`);
      }
      setIsModalOpen(false);
      form.resetFields();
    } catch (err) {
      console.error('Failed to log expense:', err);
      message.error(err.response?.data?.message || 'Failed to log expense.');
    }
  };

  const showEditModal = (expense) => {
    setExpenseToEdit(expense);
    editForm.setFieldsValue({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      paymentMethod: expense.paymentMethod,
      expenseDate: new Date(expense.expenseDate).toISOString().split('T')[0],
      notes: expense.notes,
    });
    setIsEditModalOpen(true);
  };

  const handleEditExpense = async (values) => {
    try {
      if (!expenseToEdit) return;

      const payload = {
        title: values.title,
        amount: parseFloat(values.amount),
        category: values.category,
        paymentMethod: values.paymentMethod,
        expenseDate: values.expenseDate,
        notes: values.notes,
      };

      const response = await axios.put(`${API_URL}/${expenseToEdit._id}`, payload, getAuthConfig());
      if (response.data && response.data.success) {
        message.success(`Expense updated successfully!`);
        await fetchExpenses();
      }
      setIsEditModalOpen(false);
      setExpenseToEdit(null);
      editForm.resetFields();
    } catch (err) {
      console.error('Failed to update expense:', err);
      message.error(err.response?.data?.message || 'Failed to update expense.');
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      setLoading(true);
      const response = await axios.delete(`${API_URL}/${id}`, getAuthConfig());
      if (response.data && response.data.success) {
        message.success(`Expense deleted successfully.`);
        await fetchExpenses();
      }
    } catch (err) {
      console.error('Failed to remove expense:', err);
      message.error(err.response?.data?.message || 'Failed to delete expense.');
      setLoading(false);
    }
  };

  const showDeleteConfirm = (expense) => {
    setExpenseToDelete(expense);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (expenseToDelete) {
      await handleDeleteExpense(expenseToDelete._id);
      setIsDeleteModalOpen(false);
      setExpenseToDelete(null);
    }
  };

  const columns = [
    {
      title: 'Expense Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div className="flex flex-col">
          <span className="text-zinc-250 text-xs font-bold">{text}</span>
          <span className="text-[10px] text-zinc-500">{record.notes || 'No description'}</span>
        </div>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => (
        <Tag color="blue" className="border-none rounded font-bold text-[9px] uppercase px-2 py-0.5 bg-indigo-950/40 text-indigo-400">
          {category}
        </Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'expenseDate',
      key: 'expenseDate',
      render: (date) => <span className="text-zinc-450 text-xs font-medium">{new Date(date).toISOString().split('T')[0]}</span>,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => <strong className="text-rose-400 text-xs font-bold">-${amount ? amount.toLocaleString() : '0'}</strong>,
    },
    {
      title: 'Payment Method',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (text) => <span className="text-zinc-450 text-xs">{text}</span>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <button
            className="text-xs text-amber-400 hover:text-amber-350 font-semibold cursor-pointer border-none bg-transparent"
            onClick={() => showEditModal(record)}
          >
            Edit
          </button>
          <button
            className="text-xs text-rose-500 hover:text-rose-450 font-semibold cursor-pointer border-none bg-transparent"
            onClick={() => showDeleteConfirm(record)}
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
            Operational Expenses
          </h1>
          <p className="text-xs text-zinc-450 mt-0.5">
            Track business spendings and manage cash outflows.
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
          Log Expense
        </Button>
      </div>

      {error && (
        <div className="bg-amber-955/20 border border-amber-900/60 rounded-xl px-4 py-3 text-xs text-amber-300 flex items-center gap-2">
          <ExclamationCircleOutlined className="text-sm" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Expenses controls card */}
      <div className="bg-[#121214] border border-zinc-850 rounded-2xl p-4 sm:p-5 md:p-6 hover-card-trigger transition-all duration-300 flex flex-col gap-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="text-sm font-bold text-slate-300 flex items-center gap-2">
            Total Expenses: <span className="text-rose-400">${totalExpenses.toLocaleString()}</span>
          </div>

          <Input
            prefix={<SearchOutlined className="text-zinc-500 text-xs mr-1" />}
            placeholder="Search expenses..."
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

        <Table
          columns={columns}
          dataSource={filteredExpenses}
          loading={loading}
          rowKey="_id"
          scroll={{ x: 680 }}
          pagination={{ pageSize: 6, className: "custom-antd-dark-pagination" }}
          className="custom-antd-dark-table"
          rowClassName="hover:bg-zinc-900/40 transition-all border-zinc-850"
          style={{ background: 'transparent' }}
        />
      </div>

      {/* Create Modal */}
      <Modal
        title={<span className="text-white font-bold font-display text-base">Log New Expense</span>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        closeIcon={<CloseOutlined className="text-zinc-500 hover:text-white" />}
        className="custom-dark-modal"
        centered
        width={420}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateExpense} className="flex flex-col gap-4 mt-2">
          <Form.Item name="title" label={<span className="text-[10px] font-bold text-zinc-500 uppercase">Title / Description</span>} rules={[{ required: true }]} style={{ marginBottom: 0 }}>
            <Input style={{ backgroundColor: '#18181b', borderColor: '#27272a', color: 'white', borderRadius: '8px', height: '38px', fontSize: '12px' }} />
          </Form.Item>
          
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="amount" label={<span className="text-[10px] font-bold text-zinc-500 uppercase">Amount ($)</span>} rules={[{ required: true }]} style={{ marginBottom: 0 }}>
              <Input type="number" min="0" style={{ backgroundColor: '#18181b', borderColor: '#27272a', color: 'white', borderRadius: '8px', height: '38px', fontSize: '12px' }} />
            </Form.Item>
            <Form.Item name="category" label={<span className="text-[10px] font-bold text-zinc-500 uppercase">Category</span>} rules={[{ required: true }]} style={{ marginBottom: 0 }}>
              <Select dropdownStyle={{ backgroundColor: '#121214', border: '1px solid #27272a' }} style={{ height: '38px' }}>
                {['Shipping', 'Packaging', 'Ads', 'Inventory', 'Software', 'Utilities', 'Miscellaneous'].map(c => <Select.Option key={c} value={c}>{c}</Select.Option>)}
              </Select>
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <Form.Item name="paymentMethod" label={<span className="text-[10px] font-bold text-zinc-500 uppercase">Method</span>} rules={[{ required: true }]} style={{ marginBottom: 0 }}>
              <Select dropdownStyle={{ backgroundColor: '#121214', border: '1px solid #27272a' }} style={{ height: '38px' }}>
                {['Credit Card', 'Bank Transfer', 'PayPal', 'Cash', 'Other'].map(m => <Select.Option key={m} value={m}>{m}</Select.Option>)}
              </Select>
            </Form.Item>
            <Form.Item name="expenseDate" label={<span className="text-[10px] font-bold text-zinc-500 uppercase">Date</span>} style={{ marginBottom: 0 }}>
              <input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full bg-[#18181b] border border-zinc-800 text-zinc-200 rounded-lg px-3 h-[38px] text-xs outline-none" />
            </Form.Item>
          </div>

          <Form.Item name="notes" label={<span className="text-[10px] font-bold text-zinc-500 uppercase">Additional Notes</span>} style={{ marginBottom: 0 }}>
             <Input.TextArea style={{ backgroundColor: '#18181b', borderColor: '#27272a', color: 'white', borderRadius: '8px', fontSize: '12px' }} />
          </Form.Item>

          <Button type="primary" htmlType="submit" block style={{ backgroundColor: 'white', color: 'black', fontWeight: 650, borderRadius: '8px', height: '40px', fontSize: '12px' }}>
            Save Expense
          </Button>
        </Form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        title={<span className="text-white font-bold font-display text-base">Edit Expense</span>}
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={null}
        closeIcon={<CloseOutlined className="text-zinc-500 hover:text-white" />}
        className="custom-dark-modal"
        centered
        width={420}
      >
        <Form form={editForm} layout="vertical" onFinish={handleEditExpense} className="flex flex-col gap-4 mt-2">
          <Form.Item name="title" label={<span className="text-[10px] font-bold text-zinc-500 uppercase">Title</span>} rules={[{ required: true }]} style={{ marginBottom: 0 }}>
            <Input style={{ backgroundColor: '#18181b', borderColor: '#27272a', color: 'white', borderRadius: '8px', height: '38px', fontSize: '12px' }} />
          </Form.Item>
          
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="amount" label={<span className="text-[10px] font-bold text-zinc-500 uppercase">Amount</span>} rules={[{ required: true }]} style={{ marginBottom: 0 }}>
              <Input type="number" min="0" style={{ backgroundColor: '#18181b', borderColor: '#27272a', color: 'white', borderRadius: '8px', height: '38px', fontSize: '12px' }} />
            </Form.Item>
            <Form.Item name="category" label={<span className="text-[10px] font-bold text-zinc-500 uppercase">Category</span>} rules={[{ required: true }]} style={{ marginBottom: 0 }}>
              <Select dropdownStyle={{ backgroundColor: '#121214', border: '1px solid #27272a' }} style={{ height: '38px' }}>
                {['Shipping', 'Packaging', 'Ads', 'Inventory', 'Software', 'Utilities', 'Miscellaneous'].map(c => <Select.Option key={c} value={c}>{c}</Select.Option>)}
              </Select>
            </Form.Item>
          </div>

           <div className="grid grid-cols-2 gap-4">
             <Form.Item name="paymentMethod" label={<span className="text-[10px] font-bold text-zinc-500 uppercase">Method</span>} rules={[{ required: true }]} style={{ marginBottom: 0 }}>
              <Select dropdownStyle={{ backgroundColor: '#121214', border: '1px solid #27272a' }} style={{ height: '38px' }}>
                {['Credit Card', 'Bank Transfer', 'PayPal', 'Cash', 'Other'].map(m => <Select.Option key={m} value={m}>{m}</Select.Option>)}
              </Select>
            </Form.Item>
            <Form.Item name="expenseDate" label={<span className="text-[10px] font-bold text-zinc-500 uppercase">Date</span>} style={{ marginBottom: 0 }}>
              <input type="date" className="w-full bg-[#18181b] border border-zinc-800 text-zinc-200 rounded-lg px-3 h-[38px] text-xs outline-none" />
            </Form.Item>
          </div>

          <Button type="primary" htmlType="submit" block style={{ backgroundColor: 'white', color: 'black', fontWeight: 650, borderRadius: '8px', height: '40px', fontSize: '12px' }}>
            Update Expense
          </Button>
        </Form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        title={<span className="text-white font-bold font-display text-base">Delete Expense</span>}
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        footer={null}
        closeIcon={<CloseOutlined className="text-zinc-500 hover:text-white" />}
        className="custom-dark-modal"
        centered
        width={380}
      >
        <div className="flex flex-col gap-4 mt-2">
          <p className="text-xs text-zinc-400 leading-relaxed">
            Delete <strong className="text-zinc-250">{expenseToDelete?.title}</strong>? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 mt-2">
            <button className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#18181b] text-zinc-400 hover:text-zinc-250 border border-zinc-800 cursor-pointer" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
            <button className="px-4 py-2 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white border-none cursor-pointer" onClick={confirmDelete}>Delete</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
