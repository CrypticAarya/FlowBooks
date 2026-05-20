import React, { useState, useEffect } from 'react';
import { Button, message, Progress, Tag, Modal, Badge } from 'antd';
import { CrownOutlined, CheckCircleFilled, ThunderboltFilled } from '@ant-design/icons';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api/subscription';

export default function SubscriptionPage() {
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('Pro');

  const getAuthConfig = () => {
    const token = localStorage.getItem('flowbooks_token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchUsage = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/usage`, getAuthConfig());
      if (res.data.success) setUsage(res.data.data);
    } catch (err) {
      message.error('Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsage();
  }, []);

  const handleUpgrade = async () => {
    try {
      await axios.post(`${API_URL}/upgrade`, { plan: selectedPlan, billingCycle: 'monthly' }, getAuthConfig());
      message.success(`Successfully upgraded to ${selectedPlan} Plan!`);
      setIsModalVisible(false);
      fetchUsage();
    } catch (err) {
      message.error(err.response?.data?.message || 'Upgrade failed');
    }
  };

  const handleCancel = async () => {
    try {
      await axios.post(`${API_URL}/cancel`, {}, getAuthConfig());
      message.success('Subscription canceled. Your workspace is now on the Free tier.');
      fetchUsage();
    } catch (err) {
      message.error('Failed to cancel subscription');
    }
  };

  if (loading || !usage) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const invoicePercent = usage.invoices.limit === -1 ? 0 : Math.min(100, Math.round((usage.invoices.used / usage.invoices.limit) * 100));
  const customerPercent = usage.customers.limit === -1 ? 0 : Math.min(100, Math.round((usage.customers.used / usage.customers.limit) * 100));

  return (
    <div className="flex flex-col gap-5 md:gap-8 animate-fade-in max-w-5xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-xl md:text-2xl font-extrabold text-white tracking-tight">Billing & Plans</h1>
          <p className="text-xs text-zinc-450 mt-0.5">Manage your SaaS subscription, limits, and workspace capabilities.</p>
        </div>
        {usage.plan === 'Free' ? (
          <Button type="primary" icon={<CrownOutlined />} onClick={() => setIsModalVisible(true)} className="bg-indigo-600 hover:bg-indigo-500 border-none h-10 px-6 rounded-lg font-bold shadow-md shadow-indigo-900/20">
            Upgrade Plan
          </Button>
        ) : (
          <Badge status="success" text={<span className="text-emerald-400 font-bold uppercase text-[10px]">Plan Active</span>} />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Current Plan Card */}
        <div className="bg-[#121214] border border-zinc-850 rounded-2xl p-6 shadow-sm flex flex-col gap-4 hover-card-trigger">
           <div className="flex justify-between items-center">
             <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Current Plan</span>
             <Tag color={usage.plan === 'Free' ? 'default' : 'purple'} className="border-none m-0 font-bold uppercase text-[10px] px-2">{usage.plan}</Tag>
           </div>
           <div className="mt-2">
             <span className="text-4xl font-black text-white">{usage.plan === 'Free' ? '$0' : usage.plan === 'Pro' ? '$29' : '$99'}</span>
             <span className="text-xs text-zinc-500 font-semibold"> / month</span>
           </div>
           <p className="text-xs text-zinc-400 mt-2 mb-4 leading-relaxed">
             {usage.plan === 'Free' ? 'You are currently on the free tier. Upgrade to unlock unlimited processing and advanced CRM features.' : 'You have access to premium functionality and priority processing limits.'}
           </p>
           {usage.plan !== 'Free' ? (
             <Button danger type="text" onClick={handleCancel} className="mt-auto self-start text-xs font-semibold hover:bg-rose-950/30 transition-colors">Cancel Subscription</Button>
           ) : (
             <Button onClick={() => setIsModalVisible(true)} className="mt-auto bg-white text-black border-none font-bold rounded-lg h-10 text-xs shadow-md">View Premium Plans</Button>
           )}
        </div>

        {/* Usage Limits Card */}
        <div className="md:col-span-2 bg-[#121214] border border-zinc-850 rounded-2xl p-6 shadow-sm flex flex-col gap-6 hover-card-trigger">
           <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Workspace Limits</span>
           
           <div className="flex flex-col gap-2.5">
             <div className="flex justify-between text-xs">
                <span className="font-bold text-zinc-300">Invoices Processed</span>
                <span className="font-mono text-zinc-400">{usage.invoices.used} / {usage.invoices.limit === -1 ? '∞' : usage.invoices.limit}</span>
             </div>
             <Progress percent={invoicePercent} showInfo={false} strokeColor={invoicePercent > 85 ? '#ef4444' : '#6366f1'} trailColor="#27272a" strokeWidth={8} />
             {usage.invoices.limit !== -1 && usage.invoices.used >= usage.invoices.limit && <span className="text-[10px] text-rose-500 font-semibold mt-1">Invoice limit reached. Upgrade to process more payments.</span>}
           </div>

           <div className="flex flex-col gap-2.5">
             <div className="flex justify-between text-xs">
                <span className="font-bold text-zinc-300">Customers Managed</span>
                <span className="font-mono text-zinc-400">{usage.customers.used} / {usage.customers.limit === -1 ? '∞' : usage.customers.limit}</span>
             </div>
             <Progress percent={customerPercent} showInfo={false} strokeColor={customerPercent > 85 ? '#ef4444' : '#10b981'} trailColor="#27272a" strokeWidth={8} />
             {usage.customers.limit !== -1 && usage.customers.used >= usage.customers.limit && <span className="text-[10px] text-rose-500 font-semibold mt-1">Customer limit reached. Upgrade to add more clients.</span>}
           </div>
        </div>

      </div>

      {/* Subscription Upgrade Modal */}
      <Modal 
        open={isModalVisible} 
        onCancel={() => setIsModalVisible(false)} 
        footer={null} 
        className="custom-dark-modal"
        centered
        width={720}
      >
        <div className="p-2 sm:p-4">
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-black text-white tracking-tight mb-2">Upgrade your workspace</h2>
            <p className="text-xs md:text-sm text-zinc-400">Select a plan to instantly unlock premium SaaS features and remove limits.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Pro Plan */}
            <div 
              onClick={() => setSelectedPlan('Pro')} 
              className={`cursor-pointer border-2 rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300 ${selectedPlan === 'Pro' ? 'border-indigo-500 bg-indigo-950/20 shadow-[0_0_20px_rgba(99,102,241,0.15)]' : 'border-zinc-800 bg-[#121214] hover:border-zinc-700'}`}
            >
               <div className="flex justify-between items-start">
                 <span className="font-black text-lg text-white">Pro</span>
                 {selectedPlan === 'Pro' && <CheckCircleFilled className="text-indigo-500 text-xl" />}
               </div>
               <div>
                 <span className="text-4xl font-black text-white">$29</span>
                 <span className="text-[10px] text-zinc-500 font-semibold"> / mo</span>
               </div>
               <ul className="flex flex-col gap-3 mt-4 m-0 p-0 list-none text-xs text-zinc-300">
                  <li className="flex items-center gap-2"><ThunderboltFilled className="text-indigo-400" /> <strong className="text-white">Unlimited</strong> Invoices</li>
                  <li className="flex items-center gap-2"><ThunderboltFilled className="text-indigo-400" /> <strong className="text-white">Unlimited</strong> Customers</li>
                  <li className="flex items-center gap-2"><ThunderboltFilled className="text-indigo-400" /> Advanced Analytics</li>
               </ul>
            </div>

            {/* Business Plan */}
            <div 
              onClick={() => setSelectedPlan('Business')} 
              className={`cursor-pointer border-2 rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300 ${selectedPlan === 'Business' ? 'border-purple-500 bg-purple-950/20 shadow-[0_0_20px_rgba(168,85,247,0.15)]' : 'border-zinc-800 bg-[#121214] hover:border-zinc-700'}`}
            >
               <div className="flex justify-between items-start">
                 <span className="font-black text-lg text-white">Business</span>
                 {selectedPlan === 'Business' && <CheckCircleFilled className="text-purple-500 text-xl" />}
               </div>
               <div>
                 <span className="text-4xl font-black text-white">$99</span>
                 <span className="text-[10px] text-zinc-500 font-semibold"> / mo</span>
               </div>
               <ul className="flex flex-col gap-3 mt-4 m-0 p-0 list-none text-xs text-zinc-300">
                  <li className="flex items-center gap-2"><ThunderboltFilled className="text-purple-400" /> Everything in Pro</li>
                  <li className="flex items-center gap-2"><ThunderboltFilled className="text-purple-400" /> Team Support Features</li>
                  <li className="flex items-center gap-2"><ThunderboltFilled className="text-purple-400" /> Priority Helpdesk</li>
               </ul>
            </div>
            
          </div>

          <Button 
            type="primary" 
            block 
            onClick={handleUpgrade}
            className="mt-8 bg-white text-black font-bold h-12 rounded-xl text-sm border-none shadow-[0_4px_12px_rgba(255,255,255,0.15)] hover:bg-zinc-200 transition-colors"
          >
            Confirm {selectedPlan} Upgrade
          </Button>
        </div>
      </Modal>

    </div>
  );
}
