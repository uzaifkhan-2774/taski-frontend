import { Link } from 'react-router-dom'
import { Plane, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'
import Badge from '../ui/Badge'

export default function RecentActivity({ bookings }) {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold">Recent Activity</h2>
        <Link to="/bookings" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
          All trips <ArrowRight size={13} />
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <Plane size={40} className="mx-auto text-white/10 mb-4" />
          <p className="text-white/30">No trips yet</p>
          <Link to="/flights" className="btn-blue inline-block mt-4 text-sm py-2 px-5">
            Book your first flight
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.slice(0, 4).map((b) => (
            <div key={b._id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: b.status === 'confirmed' ? 'rgba(0,229,160,0.1)' : 'rgba(255,80,80,0.1)' }}>
                <Plane size={15} style={{ color: b.status === 'confirmed' ? '#00E5A0' : '#ff5050' }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{b.event?.origin} → {b.event?.destination}</div>
                <div className="text-white/40 text-xs">
                  {b.event?.departureTime && format(new Date(b.event.departureTime), 'dd MMM yyyy')}
                </div>
              </div>
              <Badge status={b.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
