import { Clock } from 'lucide-react'

export default function ReservationTimer({ timeLeft }) {
  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60
  const urgent = timeLeft < 60

  return (
    <div
      className="rounded-2xl p-4 mb-6 flex items-center gap-3"
      style={{
        background: urgent ? 'rgba(255,80,80,0.1)' : 'rgba(245,166,35,0.1)',
        border: `1px solid ${urgent ? 'rgba(255,80,80,0.3)' : 'rgba(245,166,35,0.3)'}`,
      }}
    >
      <Clock size={18} style={{ color: urgent ? '#ff5050' : '#F5A623' }} />
      <div>
        <span className="text-sm font-semibold" style={{ color: urgent ? '#ff5050' : '#F5A623' }}>
          Seats reserved for {mins}:{String(secs).padStart(2, '0')}
        </span>
        <p className="text-xs text-white/30 mt-0.5">Complete payment before time runs out</p>
      </div>
    </div>
  )
}
