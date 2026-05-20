import React, { useState, useEffect } from 'react';
import { Button, message, Tag } from 'antd';
import { CheckOutlined, BellOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api/notifications';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAuthConfig = () => {
    const token = localStorage.getItem('flowbooks_token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL, getAuthConfig());
      if (res.data.success) {
        setNotifications(res.data.data);
      }
    } catch (err) {
      message.error('Failed to load activity timeline');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await axios.put(`${API_URL}/mark-all-read`, {}, getAuthConfig());
      message.success('All notifications marked as read');
      fetchNotifications();
    } catch (err) {
      message.error('Failed to update notifications');
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await axios.patch(`${API_URL}/${id}/read`, {}, getAuthConfig());
      fetchNotifications();
    } catch (err) {
      message.error('Failed to mark read');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, getAuthConfig());
      message.success('Activity record removed');
      fetchNotifications();
    } catch (err) {
      message.error('Failed to delete notification');
    }
  };

  // Maps backend enums to UI visual aesthetics
  const getTypeStyle = (type) => {
    switch(type) {
      case 'payment_received': return { color: 'green', label: 'Payment', bg: 'bg-emerald-950/40 text-emerald-400' };
      case 'invoice_overdue': return { color: 'red', label: 'Overdue', bg: 'bg-rose-950/40 text-rose-400' };
      case 'invoice_created': return { color: 'blue', label: 'Invoice', bg: 'bg-indigo-950/40 text-indigo-400' };
      case 'expense_added': return { color: 'orange', label: 'Expense', bg: 'bg-amber-950/40 text-amber-400' };
      case 'customer_added': return { color: 'purple', label: 'Customer', bg: 'bg-purple-950/40 text-purple-400' };
      default: return { color: 'default', label: 'System', bg: 'bg-zinc-800 text-zinc-300' };
    }
  };

  return (
    <div className="flex flex-col gap-5 md:gap-6 animate-fade-in max-w-4xl mx-auto w-full">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-xl md:text-2xl font-extrabold text-white tracking-tight">Activity Center</h1>
          <p className="text-xs text-zinc-450 mt-0.5">Your chronological timeline of system alerts, settlements, and platform updates.</p>
        </div>
        <Button 
          type="primary" 
          icon={<CheckOutlined />} 
          onClick={handleMarkAllRead} 
          style={{ backgroundColor: 'white', color: 'black', fontWeight: 650, borderRadius: '8px', fontSize: '12px', height: '38px', boxShadow: '0 4px 12px rgba(255,255,255,0.1)' }}
        >
          Mark All as Read
        </Button>
      </div>

      <div className="bg-[#121214] border border-zinc-850 rounded-2xl p-4 sm:p-5 md:p-8 shadow-sm min-h-[60vh]">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-zinc-500">
             <BellOutlined className="text-4xl mb-3 opacity-20" />
             <span className="text-sm font-semibold">You're all caught up!</span>
             <span className="text-xs">No recent activity found.</span>
          </div>
        ) : (
          <div className="flex flex-col gap-4 relative">
             
             {/* Background SaaS Timeline Tracking Line */}
             <div className="absolute left-6 top-4 bottom-4 w-[2px] bg-zinc-800/50 z-0 hidden sm:block"></div>
             
             {notifications.map(n => {
               const style = getTypeStyle(n.type);
               return (
                 <div key={n._id} className={`relative z-10 flex flex-col sm:flex-row gap-4 p-4 rounded-xl border transition-all duration-300 ${n.isRead ? 'bg-[#18181b]/30 border-zinc-850/50' : 'bg-zinc-900/60 border-zinc-700 shadow-sm shadow-indigo-900/10 hover:border-zinc-600'}`}>
                    
                    {/* Timeline Node Ring */}
                    <div className="hidden sm:flex flex-col items-center justify-start pt-1 w-12">
                       <div className={`w-3.5 h-3.5 rounded-full ring-4 ring-[#121214] ${n.isRead ? 'bg-zinc-600' : 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.6)] animate-pulse'}`}></div>
                    </div>

                    <div className="flex-1 flex flex-col gap-1.5">
                       <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <span className={`border-none rounded font-bold text-[9px] uppercase px-2 py-0.5 ${style.bg}`}>{style.label}</span>
                            <span className={`text-sm font-bold tracking-tight ${n.isRead ? 'text-zinc-300' : 'text-white'}`}>{n.title}</span>
                          </div>
                          <span className="text-[10px] text-zinc-500 font-semibold whitespace-nowrap">{new Date(n.createdAt).toLocaleString()}</span>
                       </div>
                       <p className={`text-xs leading-relaxed mt-1 ${n.isRead ? 'text-zinc-500' : 'text-zinc-300'}`}>{n.message}</p>
                    </div>

                    <div className="flex items-center gap-3 sm:flex-col sm:justify-center border-t border-zinc-800/50 sm:border-none pt-3 sm:pt-0 mt-2 sm:mt-0">
                       {!n.isRead && (
                         <button onClick={() => handleMarkRead(n._id)} className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 bg-transparent border-none cursor-pointer transition-colors">
                           Mark Read
                         </button>
                       )}
                       <button onClick={() => handleDelete(n._id)} className="text-[10px] font-bold text-zinc-600 hover:text-rose-500 bg-transparent border-none cursor-pointer transition-colors" title="Delete record">
                         <DeleteOutlined className="text-sm" />
                       </button>
                    </div>
                 </div>
               )
             })}
          </div>
        )}
      </div>
    </div>
  );
}
