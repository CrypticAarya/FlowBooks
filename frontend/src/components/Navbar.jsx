import React from 'react';
import { Badge, Avatar, Input } from 'antd';
import { 
  BellOutlined, 
  SearchOutlined, 
  MenuOutlined,
  UserOutlined 
} from '@ant-design/icons';

export default function Navbar({ onMenuClick }) {
  return (
    <header className="h-16 bg-[#09090b]/80 backdrop-blur-md border-b border-zinc-850 flex items-center justify-between px-6 md:px-8 sticky top-0 z-30 transition-colors">
      
      {/* Mobile Hamburger menu & Mobile Brand Logo */}
      <div className="flex items-center gap-3">
        <button 
          className="md:hidden text-lg text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-900 leading-none" 
          onClick={onMenuClick}
          aria-label="Open sidebar"
        >
          <MenuOutlined />
        </button>
        <div className="md:hidden flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-white flex items-center justify-center text-black font-extrabold text-[10px]">
            F
          </div>
          <strong className="font-display font-extrabold text-sm tracking-tight text-white">
            FlowBooks
          </strong>
        </div>
      </div>

      {/* Modern, Vercel-Style Search Bar */}
      <div className="hidden md:flex items-center bg-[#121214] border border-zinc-800 rounded-lg px-3 py-1.5 w-72 gap-2.5 focus-within:border-zinc-550 transition-all">
        <SearchOutlined className="text-zinc-500 text-sm" />
        <input
          type="text"
          className="bg-transparent border-none outline-none text-xs text-zinc-200 placeholder-zinc-500 w-full"
          placeholder="Search SaaS dashboard..."
        />
      </div>

      {/* Right Navbar Utility Icons */}
      <div className="flex items-center gap-4">
        
        {/* Notification Bell Badge */}
        <button 
          className="w-9 h-9 rounded-lg border border-zinc-800 bg-[#121214] text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer hover:border-zinc-700 transition-all relative" 
          title="Notifications"
          aria-label="View notifications"
        >
          <Badge dot status="processing" offset={[2, -2]}>
            <BellOutlined className="text-base flex items-center text-zinc-400" />
          </Badge>
        </button>

        {/* User Profile Avatar with Ant Design */}
        <div className="flex items-center gap-2 cursor-pointer group">
          <Avatar 
            size={32}
            style={{ 
              backgroundColor: 'white', 
              color: 'black',
              fontWeight: 600,
              fontSize: '12px' 
            }}
          >
            JD
          </Avatar>
          <span className="hidden sm:inline text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">
            Jane Doe
          </span>
        </div>

      </div>
    </header>
  );
}
