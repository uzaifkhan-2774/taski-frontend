import { Link } from 'react-router-dom'
import { Wallet, Plane, BookOpen, TrendingUp, ArrowRight } from 'lucide-react'

export default function StatsRow({ balance, confirmedCount, totalTrips, txCount }) {
  const stats = [
    { label: 'Wallet Balance', value: `₹${(balance / 100).toLocaleString('en-IN')}`, icon: <Wallet size={20} />, color: '#F5A623', link: '/wallet' },
    { label: 'Active Bookings', value: confirmedCount, icon: <Plane size={20} />, color: '#4F8EF7', link: '/bookings' },
    { label: 'Total Trips', value: totalTrips, icon: <BookOpen size={20} />, color: '#00E5A0', link: '/bookings' },
    { label: 'Transactions', value: txCount, icon: <TrendingUp size={20} />, color: '#00D4FF', link: '/wallet' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <Link to={stat.link} key={stat.label} className="glass glass-hover rounded-2xl p-5 cursor-pointer">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${stat.color}20`, color: stat.color }}>
              {stat.icon}
            </div>
            <ArrowRight size={14} className="text-white/20" />
          </div>
          <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
          <div className="text-white/40 text-sm mt-1">{stat.label}</div>
        </Link>
      ))}
    </div>
  )
}
