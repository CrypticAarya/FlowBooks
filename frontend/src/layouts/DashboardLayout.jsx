import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

/**
 * Main Layout Wrapper for the Dashboard system.
 * Organizes Sidebar, Navbar, and Content Viewports.
 */
export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex font-sans antialiased select-none">
      
      {/* Navigation Sidebar Panel */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Panel Content Container */}
      <div className="flex-1 flex flex-col md:ml-64 min-h-screen">
        
        {/* Top Navigation Bar */}
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Dynamic Nested Page Content Area */}
        <main className="flex-grow p-6 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>

    </div>
  );
}
