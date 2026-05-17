import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Login from './pages/Login';
import InvoicesPage from './pages/InvoicesPage';
import Toast from './components/ui/Toast';

export default function App() {
  // Routing sync layer
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname.substring(1) || 'dashboard';
  const setActiveTab = (tab) => navigate(`/${tab}`);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [toasts, setToasts] = useState([]);

  // Element Ref for smooth scrolling
  const quickInvoiceRef = useRef(null);

  // Theme management effect
  useEffect(() => {
    // Detect system preferred theme initially
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = systemPrefersDark ? 'dark' : 'light';
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    triggerToast(`Theme switched to ${nextTheme === 'light' ? 'Light' : 'Dark'} Mode!`, 'success');
  };

  // Toast helper
  const triggerToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Quick action helper: Scrolls directly to the invoice form
  const handleQuickAction = () => {
    setActiveTab('dashboard'); // Ensure we are on the dashboard
    triggerToast("Scrolling to Quick Ledger Form...", "info");
    setTimeout(() => {
      if (quickInvoiceRef.current) {
        quickInvoiceRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Briefly focus the client input for high accessibility
        const input = document.getElementById('client-name');
        if (input) input.focus();
      }
    }, 100);
  };

// Premium custom placeholder view for clean SaaS routes
function PlaceholderView({ tab }) {
  const navigate = useNavigate();
  const subpageDetails = {
    invoices: { title: 'Billing & Invoices', desc: 'Create, edit, and track outgoing client statements.', icon: '🧾' },
    expenses: { title: 'Operational Expenses', desc: 'Track spend categories, recurring fees, and SaaS tool expenses.', icon: '💸' },
    customers: { title: 'Customers Directory', desc: 'Manage your client profiles and lifetime customer values (LTV).', icon: '👥' },
    settings: { title: 'Settings', desc: 'Adjust payment integrations, invoice layouts, and account defaults.', icon: '⚙️' },
  };

  const details = subpageDetails[tab] || { title: 'Page', desc: 'Module loading...', icon: '⚙️' };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h1 className="font-display text-xl md:text-2xl font-extrabold text-white tracking-tight">
          {details.title}
        </h1>
        <p className="text-xs text-zinc-450 mt-1">
          {details.desc}
        </p>
      </div>

      <div className="bg-[#121214] border border-zinc-800 rounded-xl p-8 sm:p-12 md:p-16 shadow-sm flex flex-col items-center gap-5 text-center mt-4">
        <span className="text-5xl animate-bounce">{details.icon}</span>
        <h2 className="font-display text-base font-bold text-white">
          {details.title} Sub-System
        </h2>
        <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
          This sub-system has been completely connected to modern react-router-dom routes. Edit this view directly inside App.jsx or extract it as your application expands.
        </p>
        <button
          className="mt-2 bg-white hover:bg-zinc-200 text-black border-none rounded-lg px-5 py-2.5 text-xs font-semibold shadow-md transition-all cursor-pointer"
          onClick={() => navigate('/dashboard')}
        >
          ← Back to Dashboard Hub
        </button>
      </div>
    </div>
  );
}

  if (activeTab === 'login') {
    return (
      <>
        <Login onLoginSuccess={() => {
          setActiveTab('dashboard');
          triggerToast('Welcome back, Jane! Logged in successfully.', 'success');
        }} />
        
        {/* Floating Animated Toast Container */}
        <div className="toast-container">
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              message={toast.message}
              type={toast.type}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#09090b] text-zinc-100 font-sans antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={mobileSidebarOpen}
        setIsOpen={setMobileSidebarOpen}
      />

      {/* Main Panel Content Container */}
      <div className="flex-1 md:ml-64 min-h-screen flex flex-col">
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          theme={theme}
          toggleTheme={toggleTheme}
          toggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          onQuickAction={handleQuickAction}
        />

        <main className="flex-grow p-4 sm:p-6 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full">
            <Routes>
              {/* Default landing page path triggers redirect to dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              <Route path="/dashboard" element={
                <Dashboard
                  searchQuery={searchQuery}
                  triggerToast={triggerToast}
                  quickInvoiceRef={quickInvoiceRef}
                />
              } />
              
              {/* Real Invoices Management view */}
              <Route path="/invoices" element={<InvoicesPage />} />
              <Route path="/expenses" element={<PlaceholderView tab="expenses" />} />
              <Route path="/customers" element={<PlaceholderView tab="customers" />} />
              <Route path="/settings" element={<PlaceholderView tab="settings" />} />
              
              {/* Missing paths redirect back to central dashboard view */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </main>
      </div>

      {/* Floating Animated Toast Container */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
}
