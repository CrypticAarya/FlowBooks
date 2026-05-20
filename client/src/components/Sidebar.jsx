import toast from 'react-hot-toast'
import { NavLink, useNavigate } from 'react-router-dom'
import { getUser, logout } from '../utils/auth'

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/transactions', label: 'Transactions' },
  { to: '/invoices', label: 'Invoices' },
]

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate()
  const user = getUser()

  const linkClass = ({ isActive }) =>
    `block px-4 py-2.5 rounded-lg text-sm font-medium ${
      isActive
        ? 'bg-accent text-white'
        : 'text-muted hover:text-white hover:bg-background'
    }`

  return (
    <aside
      className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 shrink-0 bg-card border-r border-border
        min-h-screen p-5 flex flex-col
        transform transition-transform duration-200
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
    >
      <div className="mb-8">
        <h1 className="text-lg font-semibold text-white">FlowBooks</h1>
        <p className="text-xs text-muted mt-1">
          {user?.name ? `Hi, ${user.name}` : 'Finance tracker'}
        </p>
      </div>

      <nav className="space-y-1 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={linkClass}
            onClick={onClose}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        onClick={() => {
          logout()
          toast.success('Logged out')
          onClose?.()
          navigate('/login')
        }}
        className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-muted hover:text-white hover:bg-background"
      >
        Logout
      </button>
    </aside>
  )
}
