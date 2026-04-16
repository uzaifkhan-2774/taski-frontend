import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../store/slices/authSlice'
import { Plane, Wallet, BookOpen, LayoutDashboard, LogOut, Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { path: '/flights', icon: <Plane size={15} />, label: 'Flights' },
  { path: '/wallet', icon: <Wallet size={15} />, label: 'Wallet' },
  { path: '/bookings', icon: <BookOpen size={15} />, label: 'My Trips' },
]

function NavLink({ path, icon, label, active, onClick }) {
  return (
    <Link
      to={path}
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
      style={
        active
          ? { background: 'rgba(79,142,247,0.15)', color: '#4F8EF7', border: '1px solid rgba(79,142,247,0.2)' }
          : { color: 'rgba(255,255,255,0.5)' }
      }
    >
      {icon} {label}
    </Link>
  )
}

export default function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { user } = useSelector((s) => s.auth)
  const { balance } = useSelector((s) => s.wallet)
  const [open, setOpen] = useState(false)

  const links = user?.role === 'admin'
    ? [...NAV_LINKS, { path: '/admin', icon: <LayoutDashboard size={15} />, label: 'Admin' }]
    : NAV_LINKS

  const handleLogout = () => { dispatch(logout()); navigate('/login') }

  return (
    <nav className="glass sticky top-0 z-50 px-4 md:px-8" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F5A623, #e8941a)' }}>
            <Plane size={16} className="text-black" />
          </div>
          <span className="font-bold text-lg" style={{ fontFamily: 'Syne, sans-serif' }}>
            ta<span className="gold-text">ski</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink key={l.path} {...l} active={pathname === l.path} />
          ))}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          {balance > 0 && (
            <div className="glass px-3 py-1.5 rounded-xl flex items-center gap-2">
              <Wallet size={14} className="text-yellow-400" />
              <span className="text-sm font-semibold text-yellow-400">₹{(balance / 100).toLocaleString()}</span>
            </div>
          )}
          <div className="glass px-3 py-1.5 rounded-xl flex items-center gap-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'linear-gradient(135deg, #4F8EF7, #00D4FF)' }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <span className="text-sm text-white/70">{user?.name?.split(' ')[0]}</span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm text-white/50 hover:text-red-400 hover:bg-red-400/10 transition-all">
            <LogOut size={15} /> Logout
          </button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-white/70" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden pb-4 space-y-1">
          {links.map((l) => (
            <NavLink key={l.path} {...l} active={pathname === l.path} onClick={() => setOpen(false)} />
          ))}
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-3 text-sm text-red-400 w-full">
            <LogOut size={15} /> Logout
          </button>
        </div>
      )}
    </nav>
  )
}
