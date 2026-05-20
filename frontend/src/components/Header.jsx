import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { message, Dropdown, Badge } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import axios from 'axios';

export default function Header({ 
  searchQuery, 
  setSearchQuery, 
  theme, 
  toggleTheme, 
  toggleSidebar, 
  onQuickAction 
}) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const getAuthConfig = () => {
    const token = localStorage.getItem('flowbooks_token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchNotifications = async () => {
    try {
      if (!localStorage.getItem('flowbooks_token')) return;
      const res = await axios.get('http://localhost:5001/api/notifications', getAuthConfig());
      if (res.data.success) {
        setNotifications(res.data.data);
        const unread = res.data.data.filter(n => !n.isRead).length;
        setUnreadCount(unread);
      }
    } catch (err) {
      console.error('Failed to sync live notifications');
    }
  };

  useEffect(() => {
    fetchNotifications();
    // SaaS Real-time polling UX: Fetch notifications silently every 15 seconds
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await axios.patch(`http://localhost:5001/api/notifications/${id}/read`, {}, getAuthConfig());
      fetchNotifications();
    } catch (err) {
      message.error('Failed to mark notification as read');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('flowbooks_token');
    message.success('Logged out successfully');
    navigate('/login');
  };

  // Convert raw DB notifications into Ant Design Dropdown items
  const notificationItems = notifications.slice(0, 5).map(n => ({
    key: n._id,
    label: (
      <div 
        className={`flex flex-col gap-1.5 px-3 py-2.5 w-64 md:w-72 border-b border-zinc-800/50 transition-all ${!n.isRead ? 'bg-zinc-900/60' : 'bg-transparent hover:bg-zinc-900/30'}`}
        onClick={() => { if (!n.isRead) handleMarkAsRead(n._id); }}
      >
        <div className="flex justify-between items-center">
           <span className={`text-xs font-bold ${!n.isRead ? 'text-white' : 'text-zinc-300'}`}>{n.title}</span>
           {!n.isRead && <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.8)]"></span>}
        </div>
        <span className="text-[10px] text-zinc-400 whitespace-normal leading-relaxed">{n.message}</span>
        <span className="text-[9px] text-zinc-500 font-medium">{new Date(n.createdAt).toLocaleTimeString()}</span>
      </div>
    )
  }));

  notificationItems.push({
    key: 'view_all',
    label: (
      <div 
        className="text-center text-[11px] font-bold text-indigo-400 hover:text-indigo-300 py-2.5 bg-[#121214] transition-colors"
        onClick={() => navigate('/notifications')}
      >
        View Activity Timeline →
      </div>
    )
  });

  return (
    <header className="h-14 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-850 flex items-center justify-between px-4 sm:px-6 md:px-8 sticky top-0 z-30 transition-colors duration-200">
      
      <div className="flex items-center gap-2 sm:gap-3">
        <button 
          className="md:hidden text-xl text-slate-500 dark:text-zinc-400 hover:text-indigo-500 focus:outline-none p-1 rounded-lg leading-none hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer" 
          onClick={toggleSidebar} 
        >
          ≡
        </button>
        <div className="md:hidden flex items-center gap-1.5">
          <div className="w-6 h-6 rounded bg-white flex items-center justify-center text-black font-black text-xs shadow-md">
            F
          </div>
          <strong className="font-display font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
            FlowBooks
          </strong>
        </div>
      </div>

      <div className="hidden md:flex items-center bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 w-64 focus-within:w-72 gap-2 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 dark:focus-within:ring-indigo-950/20 transition-all duration-200">
        <span className="text-slate-400 dark:text-zinc-500 text-xs flex items-center">🔍</span>
        <input
          type="text"
          className="bg-transparent border-none outline-none text-xs text-slate-800 dark:text-zinc-200 placeholder-slate-400 dark:placeholder-zinc-500 w-full"
          placeholder="Search SaaS dashboard..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 text-xs font-semibold leading-none"
          >
            ✕
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button 
          className="w-8 h-8 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-300 flex items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 transition-all text-xs"
          onClick={toggleTheme} 
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        {/* Live Notification Dropdown Bell */}
        <Dropdown menu={{ items: notificationItems }} trigger={['click']} placement="bottomRight" overlayStyle={{ padding: 0, backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
          <Badge count={unreadCount} size="small" offset={[-2, 2]} className="cursor-pointer">
            <div className="w-8 h-8 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-300 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 transition-all">
              <BellOutlined />
            </div>
          </Badge>
        </Dropdown>

        <button 
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white border-none rounded-lg px-3.5 py-1.5 text-xs font-semibold shadow-sm hover:shadow transition-all cursor-pointer h-8"
          onClick={onQuickAction}
        >
          <span className="text-xs font-bold leading-none">+</span>
          <span className="hidden sm:inline">New Invoice</span>
        </button>

        <button 
          className="flex items-center gap-1.5 bg-transparent border border-rose-600 text-rose-500 hover:bg-rose-600 hover:text-white rounded-lg px-3.5 py-1.5 text-xs font-semibold shadow-sm hover:shadow transition-all cursor-pointer h-8 ml-1"
          onClick={handleLogout}
        >
          <span className="hidden sm:inline">Logout</span>
          <span className="sm:hidden">🚪</span>
        </button>
      </div>
    </header>
  );
}
