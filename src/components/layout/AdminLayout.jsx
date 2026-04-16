import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../store/slices/authSlice'
import { LayoutDashboard, Plane, Ticket, CreditCard, LogOut, Menu, ChevronRight } from 'lucide-react'

const NAV = [
  { path: '/admin', icon: <LayoutDashboard size={17} />, label: 'Dashboard' },
  { path: '/admin/events', icon: <Plane size={17} />, label: 'Flights' },
  { path: '/admin/bookings', icon: <Ticket size={17} />, label: 'Bookings' },
  { path: '/admin/transactions', icon: <CreditCard size={17} />, label: 'Transactions' },
]

function SidebarContent({ onClose }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { user } = useSelector((s) => s.auth)

  const handleLogout = () => { dispatch(logout()); navigate('/login') }

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F5A623, #e8941a)' }}>
          <Plane size={17} className="text-black" />
        </div>
        <div>
          <div className="font-bold" style={{ fontFamily: 'Syne, sans-serif' }}>ta<span className="gold-text">ski</span></div>
          <div className="text-xs text-white/30">Admin Panel</div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {NAV.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={`sidebar-link ${pathname === item.path ? 'active' : ''}`}
          >
            {item.icon}
            {item.label}
            {pathname === item.path && <ChevronRight size={14} className="ml-auto" />}
          </Link>
        ))}
      </nav>

      <div className="p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-3 p-3 rounded-xl mb-2" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: 'linear-gradient(135deg, #F5A623, #e8941a)', color: '#0A0E1A' }}>
            {user?.name?.[0]}
          </div>
          <div>
            <div className="text-sm font-medium">{user?.name}</div>
            <div className="text-xs text-white/30">{user?.email}</div>
          </div>
        </div>
        <button onClick={handleLogout} className="sidebar-link w-full hover:text-red-400 hover:bg-red-400/10">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  )
}

export default function AdminLayout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--taski-dark)' }}>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 flex-shrink-0" style={{ background: '#0A0E1A', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-60 flex flex-col" style={{ background: '#0A0E1A', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
            <SidebarContent onClose={() => setSidebarOpen(false)} />
          </div>
          <div className="flex-1" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-6 h-16 flex-shrink-0" style={{ background: '#0A0E1A', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3">
            <button className="md:hidden text-white/50 hover:text-white" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-bold">{title}</h1>
          </div>
          <Link to="/" className="text-sm text-white/40 hover:text-white transition-all flex items-center gap-1">
            <Plane size={14} /> User View
          </Link>
        </header>

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
