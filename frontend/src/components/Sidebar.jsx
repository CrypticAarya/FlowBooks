import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { 
  DashboardOutlined, 
  FileTextOutlined, 
  CreditCardOutlined, 
  UserOutlined, 
  SettingOutlined,
  CloseOutlined,
  BankOutlined,
  BellOutlined,
  CrownOutlined,
  BulbOutlined,
  BarChartOutlined
} from '@ant-design/icons';

export default function Sidebar({ isOpen, setIsOpen, activeTab, setActiveTab }) {
  const navigate = useNavigate();
  const menuItems = [
    { id: 'dashboard', path: '/dashboard', name: 'Dashboard', icon: <DashboardOutlined /> },
    { id: 'invoices', path: '/invoices', name: 'Invoices', icon: <FileTextOutlined /> },
    { id: 'payments', path: '/payments', name: 'Payments', icon: <BankOutlined /> },
    { id: 'expenses', path: '/expenses', name: 'Expenses', icon: <CreditCardOutlined /> },
    { id: 'customers', path: '/customers', name: 'Customers', icon: <UserOutlined /> },
    { id: 'insights', path: '/insights', name: 'AI Insights', icon: <BulbOutlined /> },
    { id: 'reports', path: '/reports', name: 'Reports', icon: <BarChartOutlined /> },
    { id: 'subscription', path: '/subscription', name: 'Plans', icon: <CrownOutlined /> },
    { id: 'notifications', path: '/notifications', name: 'Activity', icon: <BellOutlined /> },
    { id: 'settings', path: '/settings', name: 'Settings', icon: <SettingOutlined /> },
  ];

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Panel Container */}
      <aside 
        className={`w-64 bg-[#09090b] border-r border-zinc-850/80 flex flex-col fixed top-0 bottom-0 left-0 z-40 transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Logo Header */}
        <div className="h-16 flex items-center px-6 border-b border-zinc-850 justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-white flex items-center justify-center text-black font-extrabold text-lg shadow-md shadow-white/10">
              F
            </div>
            <span className="font-display font-bold text-lg tracking-tight text-white">
              FlowBooks
            </span>
          </div>

          {/* Close Button on Mobile Drawer */}
          {isOpen && (
            <button 
              onClick={() => setIsOpen(false)}
              className="md:hidden p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
              aria-label="Close menu"
            >
              <CloseOutlined />
            </button>
          )}
        </div>

        {/* Navigation Link Stack */}
        <nav className="py-6 px-4 flex flex-col gap-1 flex-grow overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => {
                if (setIsOpen) setIsOpen(false); // Close drawer on mobile
                if (setActiveTab) setActiveTab(item.id); // Set tab state for non-router environments
              }}
              className={({ isActive }) => {
                const isTabActive = activeTab ? activeTab === item.id : isActive;
                return `flex items-center px-3.5 py-2.5 rounded-lg text-[13px] font-medium gap-3 transition-all duration-200 text-left ${
                  isTabActive 
                    ? 'text-white bg-zinc-900 font-semibold' 
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
                }`;
              }}
            >
              <span className="text-base flex items-center">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Workspace Footer Profile */}
        <div className="p-4 border-t border-zinc-850 flex items-center justify-between bg-[#0c0c0e]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-inner">
              JD
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-zinc-200 truncate">Jane Doe</span>
              <span className="text-[10px] text-zinc-500 truncate text-left">jane@flowbooks.io</span>
            </div>
          </div>
          <button 
            onClick={() => {
              localStorage.removeItem('flowbooks_token');
              message.success('Logged out successfully');
              navigate('/login');
            }}
            className="text-zinc-500 hover:text-rose-450 p-1.5 rounded-lg hover:bg-rose-950/20 border-none bg-transparent transition-all cursor-pointer flex items-center justify-center"
            title="Log Out"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </aside>
    </>
  );
}
