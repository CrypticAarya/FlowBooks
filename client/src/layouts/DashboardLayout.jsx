import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex bg-background">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 w-full">
        <header className="md:hidden sticky top-0 z-30 flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
          <button
            type="button"
            aria-label="Open menu"
            className="p-2 rounded-lg border border-border text-sm hover:border-accent/50"
            onClick={() => setSidebarOpen(true)}
          >
            Menu
          </button>
          <span className="font-semibold text-white">FlowBooks</span>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
