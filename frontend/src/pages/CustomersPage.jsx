import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Input, Modal, Form, message } from 'antd';
import { PlusOutlined, SearchOutlined, CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api/customers';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const getAuthConfig = () => {
    const token = localStorage.getItem('flowbooks_token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL, getAuthConfig());
      if (response.data && response.data.success) {
        setCustomers(response.data.data);
        setError(null);
      }
    } catch (err) {
      console.error('Failed to sync customers:', err);
      setError('Failed to fetch customers.');
      message.error('Database connection failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(c => {
    const query = searchQuery.toLowerCase();
    return (
      (c.name || '').toLowerCase().includes(query) ||
      (c.company || '').toLowerCase().includes(query) ||
      (c.email || '').toLowerCase().includes(query)
    );
  });

  const handleCreateCustomer = async (values) => {
    try {
      const response = await axios.post(API_URL, values, getAuthConfig());
      if (response.data && response.data.success) {
        setCustomers([response.data.data, ...customers]);
        message.success(`Customer ${values.name} added successfully!`);
      }
      setIsModalOpen(false);
      form.resetFields();
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to create customer.');
    }
  };

  const showEditModal = (customer) => {
    setCustomerToEdit(customer);
    editForm.setFieldsValue({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      company: customer.company,
      address: customer.address,
      notes: customer.notes,
    });
    setIsEditModalOpen(true);
  };

  const handleEditCustomer = async (values) => {
    try {
      if (!customerToEdit) return;
      const response = await axios.put(`${API_URL}/${customerToEdit._id}`, values, getAuthConfig());
      if (response.data && response.data.success) {
        message.success(`Customer updated successfully!`);
        await fetchCustomers();
      }
      setIsEditModalOpen(false);
      setCustomerToEdit(null);
      editForm.resetFields();
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to update customer.');
    }
  };

  const confirmDelete = async () => {
    if (customerToDelete) {
      try {
        setLoading(true);
        const response = await axios.delete(`${API_URL}/${customerToDelete._id}`, getAuthConfig());
        if (response.data && response.data.success) {
          message.success(`Customer deleted successfully.`);
          await fetchCustomers();
        }
      } catch (err) {
        message.error('Failed to delete customer.');
        setLoading(false);
      }
      setIsDeleteModalOpen(false);
      setCustomerToDelete(null);
    }
  };

  const columns = [
    {
      title: 'Customer Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex flex-col">
          <span className="text-zinc-250 text-xs font-bold">{text}</span>
          <span className="text-[10px] text-zinc-500">{record.company || 'Individual'}</span>
        </div>
      ),
    },
    {
      title: 'Contact Information',
      key: 'contact',
      render: (_, record) => (
        <div className="flex flex-col">
          <span className="text-zinc-400 text-xs">{record.email}</span>
          <span className="text-[10px] text-zinc-500">{record.phone || 'No phone provided'}</span>
        </div>
      ),
    },
    {
      title: 'Lifetime Value (LTV)',
      dataIndex: 'totalSpent',
      key: 'totalSpent',
      render: (amount) => <strong className="text-emerald-400 text-xs font-bold">${amount ? amount.toLocaleString() : '0'}</strong>,
    },
    {
      title: 'Invoices',
      dataIndex: 'totalInvoices',
      key: 'totalInvoices',
      render: (count) => <span className="text-zinc-450 text-xs font-bold">{count || 0}</span>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <button className="text-xs text-amber-400 hover:text-amber-350 font-semibold cursor-pointer border-none bg-transparent" onClick={() => showEditModal(record)}>Edit</button>
          <button className="text-xs text-rose-500 hover:text-rose-450 font-semibold cursor-pointer border-none bg-transparent" onClick={() => { setCustomerToDelete(record); setIsDeleteModalOpen(true); }}>Delete</button>
        </Space>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5 md:gap-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-xl md:text-2xl font-extrabold text-white tracking-tight">Customers Directory</h1>
          <p className="text-xs text-zinc-450 mt-0.5">Manage clients, track relationships and monitor lifetime value.</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)} style={{ backgroundColor: 'white', color: 'black', fontWeight: 650, borderRadius: '8px', fontSize: '12px', height: '38px', boxShadow: '0 4px 12px rgba(255, 255, 255, 0.1)' }}>Add Customer</Button>
      </div>

      {error && (
        <div className="bg-amber-955/20 border border-amber-900/60 rounded-xl px-4 py-3 text-xs text-amber-300 flex items-center gap-2">
          <ExclamationCircleOutlined className="text-sm" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-[#121214] border border-zinc-850 rounded-2xl p-4 sm:p-5 md:p-6 flex flex-col gap-4 shadow-sm hover-card-trigger transition-all duration-300">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm font-bold text-slate-300 flex items-center gap-2">
             <span className="text-emerald-400">{filteredCustomers.length}</span> Total Registered Customers
          </div>
          <Input prefix={<SearchOutlined className="text-zinc-500 text-xs mr-1" />} placeholder="Search by name, company, email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full md:max-w-xs h-9 text-xs" style={{ backgroundColor: '#18181b', borderColor: '#27272a', color: 'white', borderRadius: '8px', fontSize: '12px' }} />
        </div>
        <Table columns={columns} dataSource={filteredCustomers} loading={loading} rowKey="_id" scroll={{ x: 680 }} pagination={{ pageSize: 6, className: "custom-antd-dark-pagination" }} className="custom-antd-dark-table" rowClassName="hover:bg-zinc-900/40 transition-all border-zinc-850" style={{ background: 'transparent' }} />
      </div>

      {/* Add Customer Modal */}
      <Modal title={<span className="text-white font-bold text-base">Register New Customer</span>} open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null} closeIcon={<CloseOutlined className="text-zinc-500 hover:text-white" />} className="custom-dark-modal" centered>
        <Form form={form} layout="vertical" onFinish={handleCreateCustomer} className="mt-4 flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="name" label={<span className="text-[10px] font-bold text-zinc-500 uppercase">Full Name</span>} rules={[{ required: true }]} style={{ marginBottom: '12px' }}><Input style={{ backgroundColor: '#18181b', borderColor: '#27272a', color: 'white', height: '38px', borderRadius: '8px', fontSize: '12px' }} /></Form.Item>
            <Form.Item name="email" label={<span className="text-[10px] font-bold text-zinc-500 uppercase">Email</span>} rules={[{ required: true }]} style={{ marginBottom: '12px' }}><Input style={{ backgroundColor: '#18181b', borderColor: '#27272a', color: 'white', height: '38px', borderRadius: '8px', fontSize: '12px' }} /></Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="company" label={<span className="text-[10px] font-bold text-zinc-500 uppercase">Company (Optional)</span>} style={{ marginBottom: '12px' }}><Input style={{ backgroundColor: '#18181b', borderColor: '#27272a', color: 'white', height: '38px', borderRadius: '8px', fontSize: '12px' }} /></Form.Item>
            <Form.Item name="phone" label={<span className="text-[10px] font-bold text-zinc-500 uppercase">Phone (Optional)</span>} style={{ marginBottom: '12px' }}><Input style={{ backgroundColor: '#18181b', borderColor: '#27272a', color: 'white', height: '38px', borderRadius: '8px', fontSize: '12px' }} /></Form.Item>
          </div>
          <Form.Item name="address" label={<span className="text-[10px] font-bold text-zinc-500 uppercase">Billing Address</span>} style={{ marginBottom: '12px' }}><Input.TextArea style={{ backgroundColor: '#18181b', borderColor: '#27272a', color: 'white', borderRadius: '8px', fontSize: '12px' }} /></Form.Item>
          <Form.Item name="notes" label={<span className="text-[10px] font-bold text-zinc-500 uppercase">Internal Notes</span>} style={{ marginBottom: '16px' }}><Input.TextArea style={{ backgroundColor: '#18181b', borderColor: '#27272a', color: 'white', borderRadius: '8px', fontSize: '12px' }} /></Form.Item>
          <Button type="primary" htmlType="submit" block style={{ backgroundColor: 'white', color: 'black', fontWeight: 650, borderRadius: '8px', height: '40px', fontSize: '12px' }}>Save Customer Profile</Button>
        </Form>
      </Modal>

      {/* Edit Customer Modal */}
      <Modal title={<span className="text-white font-bold text-base">Edit Customer Profile</span>} open={isEditModalOpen} onCancel={() => setIsEditModalOpen(false)} footer={null} closeIcon={<CloseOutlined className="text-zinc-500 hover:text-white" />} className="custom-dark-modal" centered>
        <Form form={editForm} layout="vertical" onFinish={handleEditCustomer} className="mt-4 flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="name" label={<span className="text-[10px] font-bold text-zinc-500 uppercase">Full Name</span>} rules={[{ required: true }]} style={{ marginBottom: '12px' }}><Input style={{ backgroundColor: '#18181b', borderColor: '#27272a', color: 'white', height: '38px', borderRadius: '8px', fontSize: '12px' }} /></Form.Item>
            <Form.Item name="email" label={<span className="text-[10px] font-bold text-zinc-500 uppercase">Email</span>} rules={[{ required: true }]} style={{ marginBottom: '12px' }}><Input style={{ backgroundColor: '#18181b', borderColor: '#27272a', color: 'white', height: '38px', borderRadius: '8px', fontSize: '12px' }} /></Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="company" label={<span className="text-[10px] font-bold text-zinc-500 uppercase">Company</span>} style={{ marginBottom: '12px' }}><Input style={{ backgroundColor: '#18181b', borderColor: '#27272a', color: 'white', height: '38px', borderRadius: '8px', fontSize: '12px' }} /></Form.Item>
            <Form.Item name="phone" label={<span className="text-[10px] font-bold text-zinc-500 uppercase">Phone</span>} style={{ marginBottom: '12px' }}><Input style={{ backgroundColor: '#18181b', borderColor: '#27272a', color: 'white', height: '38px', borderRadius: '8px', fontSize: '12px' }} /></Form.Item>
          </div>
          <Form.Item name="address" label={<span className="text-[10px] font-bold text-zinc-500 uppercase">Address</span>} style={{ marginBottom: '12px' }}><Input.TextArea style={{ backgroundColor: '#18181b', borderColor: '#27272a', color: 'white', borderRadius: '8px', fontSize: '12px' }} /></Form.Item>
          <Form.Item name="notes" label={<span className="text-[10px] font-bold text-zinc-500 uppercase">Internal Notes</span>} style={{ marginBottom: '16px' }}><Input.TextArea style={{ backgroundColor: '#18181b', borderColor: '#27272a', color: 'white', borderRadius: '8px', fontSize: '12px' }} /></Form.Item>
          <Button type="primary" htmlType="submit" block style={{ backgroundColor: 'white', color: 'black', fontWeight: 650, borderRadius: '8px', height: '40px', fontSize: '12px' }}>Update Profile</Button>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal title={<span className="text-white font-bold text-base">Remove Customer</span>} open={isDeleteModalOpen} onCancel={() => setIsDeleteModalOpen(false)} footer={null} closeIcon={<CloseOutlined className="text-zinc-500 hover:text-white" />} className="custom-dark-modal" centered width={380}>
        <div className="flex flex-col gap-4 mt-2">
          <p className="text-xs text-zinc-400 leading-relaxed">Are you sure you want to completely erase <strong className="text-zinc-250">{customerToDelete?.name}</strong> from the directory? This action is permanent.</p>
          <div className="flex justify-end gap-3 mt-2">
            <button className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#18181b] hover:bg-[#27272a] text-zinc-400 hover:text-zinc-250 border border-zinc-800 transition-all cursor-pointer" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
            <button className="px-4 py-2 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white border-none transition-all cursor-pointer shadow-md shadow-rose-900/10" onClick={confirmDelete}>Erase Data</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
