import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-white">
      {/* Navbar */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">
            FlowBooks
          </h1>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm text-muted hover:text-white transition"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="bg-accent text-background text-sm font-medium px-4 py-2 rounded-lg hover:brightness-110"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="max-w-3xl">
          <p className="text-accent text-sm font-medium mb-4">
            SIMPLE FINANCE TRACKING
          </p>

          <h2 className="text-5xl font-bold leading-tight">
            Manage your business finances without the clutter.
          </h2>

          <p className="text-muted text-lg mt-6 leading-8">
            Track transactions, manage invoices, and monitor
            your business performance with a clean and modern
            dashboard.
          </p>

          <div className="flex flex-wrap gap-4 mt-10">
            <Link
              to="/register"
              className="bg-accent text-background px-6 py-3 rounded-lg font-medium hover:brightness-110"
            >
              Start Free
            </Link>

            <Link
              to="/login"
              className="border border-border px-6 py-3 rounded-lg font-medium hover:bg-card transition"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold">
              Track Transactions
            </h3>

            <p className="text-muted text-sm mt-3 leading-6">
              Add and manage income and expenses with
              a simple workflow.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold">
              Manage Invoices
            </h3>

            <p className="text-muted text-sm mt-3 leading-6">
              Create invoices and monitor payment status
              in one place.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold">
              Real-Time Dashboard
            </h3>

            <p className="text-muted text-sm mt-3 leading-6">
              View revenue, expenses, and profit instantly
              with clean analytics.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}