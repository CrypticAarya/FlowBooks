import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Tabs, message, Select } from 'antd';
import { SaveOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api/settings';

export default function SettingsPage() {
  const [profileForm] = Form.useForm();
  const [prefsForm] = Form.useForm();
  const [securityForm] = Form.useForm();
  
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);

  const getAuthConfig = () => {
    const token = localStorage.getItem('flowbooks_token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/profile`, getAuthConfig());
      if (res.data.success) {
        setProfileData(res.data.data);
        profileForm.setFieldsValue(res.data.data);
        prefsForm.setFieldsValue(res.data.data);
      }
    } catch (err) {
      message.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (values) => {
    try {
      await axios.put(`${API_URL}/profile`, values, getAuthConfig());
      message.success('Settings updated successfully!');
      fetchProfile();
    } catch (err) {
      message.error('Failed to update settings');
    }
  };

  const handleUpdateSecurity = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      return message.error('New passwords do not match!');
    }
    try {
      await axios.put(`${API_URL}/password`, {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword
      }, getAuthConfig());
      message.success('Security protocol updated successfully');
      securityForm.resetFields();
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to update security keys');
    }
  };

  const businessProfileTab = (
    <Form form={profileForm} layout="vertical" onFinish={handleUpdateProfile} className="mt-4 flex flex-col gap-4 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
        <Form.Item name="businessName" label={<span className="text-[10px] font-bold text-zinc-500 uppercase">Workspace / Business Name</span>}><Input className="bg-[#18181b] border-zinc-800 text-white hover:border-indigo-500 focus:border-indigo-500 rounded-lg h-[38px] text-xs" /></Form.Item>
        <Form.Item name="ownerName" label={<span className="text-[10px] font-bold text-zinc-500 uppercase">Owner Name</span>}><Input className="bg-[#18181b] border-zinc-800 text-white hover:border-indigo-500 focus:border-indigo-500 rounded-lg h-[38px] text-xs" /></Form.Item>
        <Form.Item name="email" label={<span className="text-[10px] font-bold text-zinc-500 uppercase">Primary Contact Email</span>}><Input type="email" className="bg-[#18181b] border-zinc-800 text-white hover:border-indigo-500 focus:border-indigo-500 rounded-lg h-[38px] text-xs" /></Form.Item>
        <Form.Item name="phone" label={<span className="text-[10px] font-bold text-zinc-500 uppercase">Support Phone Number</span>}><Input className="bg-[#18181b] border-zinc-800 text-white hover:border-indigo-500 focus:border-indigo-500 rounded-lg h-[38px] text-xs" /></Form.Item>
        <Form.Item name="website" label={<span className="text-[10px] font-bold text-zinc-500 uppercase">Corporate Website</span>}><Input className="bg-[#18181b] border-zinc-800 text-white hover:border-indigo-500 focus:border-indigo-500 rounded-lg h-[38px] text-xs" /></Form.Item>
        <Form.Item name="taxNumber" label={<span className="text-[10px] font-bold text-zinc-500 uppercase">Tax ID / EIN</span>}><Input className="bg-[#18181b] border-zinc-800 text-white hover:border-indigo-500 focus:border-indigo-500 rounded-lg h-[38px] text-xs" /></Form.Item>
      </div>
      <Form.Item name="address" label={<span className="text-[10px] font-bold text-zinc-500 uppercase">Registered Business Address</span>}><Input.TextArea rows={3} className="bg-[#18181b] border-zinc-800 text-white hover:border-indigo-500 focus:border-indigo-500 rounded-lg text-xs py-2" /></Form.Item>
      <div className="pt-2">
         <Button type="primary" htmlType="submit" icon={<SaveOutlined />} className="w-full sm:w-fit bg-indigo-600 hover:bg-indigo-500 border-none rounded-lg font-semibold h-10 px-6 shadow-md shadow-indigo-900/20 text-xs">Update Profile Data</Button>
      </div>
    </Form>
  );

  const preferencesTab = (
    <Form form={prefsForm} layout="vertical" onFinish={handleUpdateProfile} className="mt-4 flex flex-col gap-4 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
        <Form.Item name="currency" label={<span className="text-[10px] font-bold text-zinc-500 uppercase">Default Billing Currency</span>}>
           <Select dropdownStyle={{ backgroundColor: '#121214', border: '1px solid #27272a' }} className="h-[38px] text-xs" >
             {['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR'].map(c => <Select.Option key={c} value={c}>{c}</Select.Option>)}
           </Select>
        </Form.Item>
        <Form.Item name="timezone" label={<span className="text-[10px] font-bold text-zinc-500 uppercase">System Timezone</span>}>
           <Select dropdownStyle={{ backgroundColor: '#121214', border: '1px solid #27272a' }} className="h-[38px] text-xs" >
             {['UTC', 'EST', 'PST', 'GMT', 'IST'].map(t => <Select.Option key={t} value={t}>{t}</Select.Option>)}
           </Select>
        </Form.Item>
        <Form.Item name="invoicePrefix" label={<span className="text-[10px] font-bold text-zinc-500 uppercase">Invoice Auto-Prefix</span>}><Input className="bg-[#18181b] border-zinc-800 text-white hover:border-indigo-500 focus:border-indigo-500 rounded-lg h-[38px] text-xs uppercase" /></Form.Item>
      </div>
      <div className="pt-2">
         <Button type="primary" htmlType="submit" icon={<SaveOutlined />} className="w-full sm:w-fit bg-indigo-600 hover:bg-indigo-500 border-none rounded-lg font-semibold h-10 px-6 shadow-md shadow-indigo-900/20 text-xs">Save Configuration</Button>
      </div>
    </Form>
  );

  const securityTab = (
    <Form form={securityForm} layout="vertical" onFinish={handleUpdateSecurity} className="mt-4 flex flex-col gap-2 max-w-sm">
       <Form.Item name="currentPassword" label={<span className="text-[10px] font-bold text-zinc-500 uppercase">Current Password</span>} rules={[{ required: true }]}><Input.Password className="bg-[#18181b] border-zinc-800 text-white hover:border-indigo-500 focus:border-indigo-500 rounded-lg h-[38px] text-xs" /></Form.Item>
       <Form.Item name="newPassword" label={<span className="text-[10px] font-bold text-zinc-500 uppercase">New Password</span>} rules={[{ required: true, min: 6 }]}><Input.Password className="bg-[#18181b] border-zinc-800 text-white hover:border-indigo-500 focus:border-indigo-500 rounded-lg h-[38px] text-xs" /></Form.Item>
       <Form.Item name="confirmPassword" label={<span className="text-[10px] font-bold text-zinc-500 uppercase">Confirm New Password</span>} rules={[{ required: true }]}><Input.Password className="bg-[#18181b] border-zinc-800 text-white hover:border-indigo-500 focus:border-indigo-500 rounded-lg h-[38px] text-xs" /></Form.Item>
       <div className="pt-4">
         <Button type="primary" htmlType="submit" icon={<SafetyCertificateOutlined />} className="w-full bg-emerald-600 hover:bg-emerald-500 border-none rounded-lg font-semibold h-10 px-6 shadow-md shadow-emerald-900/20 text-xs">Rotate Access Keys</Button>
       </div>
    </Form>
  );

  const items = [
    { key: '1', label: <span className="font-semibold text-xs tracking-wide">Business Profile</span>, children: businessProfileTab },
    { key: '2', label: <span className="font-semibold text-xs tracking-wide">Invoice Preferences</span>, children: preferencesTab },
    { key: '3', label: <span className="font-semibold text-xs tracking-wide text-rose-400">Security</span>, children: securityTab }
  ];

  return (
    <div className="flex flex-col gap-5 md:gap-6 animate-fade-in max-w-6xl mx-auto w-full">
      <div>
        <h1 className="font-display text-xl md:text-2xl font-extrabold text-white tracking-tight">Workspace Settings</h1>
        <p className="text-xs text-zinc-450 mt-0.5">Manage your seller profile, adjust invoice defaults, and secure your account.</p>
      </div>

      <div className="bg-[#121214] border border-zinc-850 rounded-2xl p-6 sm:p-8 shadow-sm min-h-[60vh] custom-dark-tabs">
        {loading && !profileData ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <Tabs defaultActiveKey="1" items={items} />
        )}
      </div>
    </div>
  );
}
