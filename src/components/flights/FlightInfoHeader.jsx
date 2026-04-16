import { Plane } from 'lucide-react'
import { format } from 'date-fns'

function calcDuration(dep, arr) {
  if (!dep || !arr) return ''
  const mins = (new Date(arr) - new Date(dep)) / 60000
  return `${Math.floor(mins / 60)}h ${mins % 60}m`
}

export default function FlightInfoHeader({ event }) {
  return (
    <div className="glass rounded-3xl p-6 mb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1A2744, #243354)', border: '1px solid rgba(79,142,247,0.2)' }}>
            <Plane size={24} className="text-blue-400" />
          </div>
          <div>
            <div className="text-white/40 text-sm">{event.airline} · {event.flightNumber}</div>
            <h2 className="text-2xl font-bold">{event.origin} → {event.destination}</h2>
          </div>
        </div>

        <div className="flex gap-6 text-center">
          <div>
            <div className="text-2xl font-bold">{event.departureTime && format(new Date(event.departureTime), 'HH:mm')}</div>
            <div className="text-white/40 text-xs">{event.departureTime && format(new Date(event.departureTime), 'dd MMM')}</div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="text-xs text-white/30">{calcDuration(event.departureTime, event.arrivalTime)}</div>
            <div className="w-16 h-px my-1" style={{ background: 'rgba(255,255,255,0.15)' }} />
            <div className="text-xs text-white/30">Non-stop</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{event.arrivalTime && format(new Date(event.arrivalTime), 'HH:mm')}</div>
            <div className="text-white/40 text-xs">{event.arrivalTime && format(new Date(event.arrivalTime), 'dd MMM')}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
