import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import InvoicesPage from './pages/InvoicesPage';
import ExpensesPage from './pages/ExpensesPage';
import CustomersPage from './pages/CustomersPage';
import PaymentsPage from './pages/PaymentsPage';
import NotificationsPage from './pages/NotificationsPage';
import SettingsPage from './pages/SettingsPage';
import SubscriptionPage from './pages/SubscriptionPage';
import InsightsPage from './pages/InsightsPage';
import ReportsPage from './pages/ReportsPage';
import ProtectedRoute from './components/ProtectedRoute';
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

  if (activeTab === 'register') {
    return (
      <>
        <Register />
        
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
                <ProtectedRoute>
                  <Dashboard
                    searchQuery={searchQuery}
                    triggerToast={triggerToast}
                    quickInvoiceRef={quickInvoiceRef}
                  />
                </ProtectedRoute>
              } />
              
              {/* Real Invoices Management view */}
              <Route path="/invoices" element={<ProtectedRoute><InvoicesPage /></ProtectedRoute>} />
              <Route path="/payments" element={<ProtectedRoute><PaymentsPage /></ProtectedRoute>} />
              <Route path="/expenses" element={<ProtectedRoute><ExpensesPage /></ProtectedRoute>} />
              <Route path="/customers" element={<ProtectedRoute><CustomersPage /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
              <Route path="/insights" element={<ProtectedRoute><InsightsPage /></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              <Route path="/subscription" element={<ProtectedRoute><SubscriptionPage /></ProtectedRoute>} />
              
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
