import { Users, Plane, Ticket, CheckCircle, XCircle, TrendingUp, Activity } from 'lucide-react'
import SkeletonList from '../ui/SkeletonList'

export default function StatsGrid({ stats, loading }) {
  if (loading) return <div className="grid grid-cols-2 md:grid-cols-3 gap-4"><SkeletonList count={6} height="h-28" /></div>
  if (!stats) return null

  const cards = [
    { label: 'Total Users', value: stats.totalUsers, icon: <Users size={22} />, color: '#4F8EF7', bg: 'rgba(79,142,247,0.1)' },
    { label: 'Active Flights', value: stats.activeEvents, icon: <Plane size={22} />, color: '#00D4FF', bg: 'rgba(0,212,255,0.1)' },
    { label: 'Total Bookings', value: stats.totalBookings, icon: <Ticket size={22} />, color: '#F5A623', bg: 'rgba(245,166,35,0.1)' },
    { label: 'Confirmed', value: stats.confirmedBookings, icon: <CheckCircle size={22} />, color: '#00E5A0', bg: 'rgba(0,229,160,0.1)' },
    { label: 'Cancelled', value: stats.cancelledBookings, icon: <XCircle size={22} />, color: '#ff5050', bg: 'rgba(255,80,80,0.1)' },
    { label: 'Total Revenue', value: `₹${((stats.totalRevenue || 0) / 100).toLocaleString('en-IN')}`, icon: <TrendingUp size={22} />, color: '#F5A623', bg: 'rgba(245,166,35,0.1)', large: true },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="glass rounded-2xl p-5 glass-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: card.bg, color: card.color }}>
              {card.icon}
            </div>
            <Activity size={14} className="text-white/15" />
          </div>
          <div className={`font-bold mb-1 ${card.large ? 'text-2xl' : 'text-3xl'}`} style={{ color: card.color }}>{card.value}</div>
          <div className="text-white/40 text-sm">{card.label}</div>
        </div>
      ))}
    </div>
  )
}
