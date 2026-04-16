import { useNavigate } from 'react-router-dom'
import { Plane, Calendar, Users, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'

function duration(dep, arr) {
  const mins = (new Date(arr) - new Date(dep)) / 60000
  return `${Math.floor(mins / 60)}h ${mins % 60}m`
}

export default function FlightCard({ event }) {
  const navigate = useNavigate()
  const minPrice = Math.min(...(event.seats?.map((s) => s.price) || [0]))

  return (
    <div className="glass glass-hover rounded-2xl p-6 cursor-pointer" onClick={() => navigate(`/flights/${event._id}`)}>
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        {/* Airline */}
        <div className="flex items-center gap-3 md:w-40">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, rgba(79,142,247,0.2), rgba(0,212,255,0.1))', border: '1px solid rgba(79,142,247,0.2)' }}>
            <Plane size={20} className="text-blue-400" />
          </div>
          <div>
            <div className="font-semibold text-sm">{event.airline || 'Taski Air'}</div>
            <div className="text-white/40 text-xs">{event.flightNumber}</div>
          </div>
        </div>

        {/* Route */}
        <div className="flex-1 flex items-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{event.originCode || event.origin?.slice(0, 3).toUpperCase()}</div>
            <div className="text-white/40 text-xs">{event.origin}</div>
            {event.departureTime && <div className="text-white/60 text-sm font-medium mt-1">{format(new Date(event.departureTime), 'HH:mm')}</div>}
          </div>
          <div className="flex-1 flex flex-col items-center gap-1">
            <div className="text-xs text-white/30">{event.departureTime && event.arrivalTime && duration(event.departureTime, event.arrivalTime)}</div>
            <div className="w-full flex items-center gap-2">
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
              <Plane size={14} className="text-blue-400" />
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
            </div>
            <div className="text-xs text-white/30">Non-stop</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{event.destinationCode || event.destination?.slice(0, 3).toUpperCase()}</div>
            <div className="text-white/40 text-xs">{event.destination}</div>
            {event.arrivalTime && <div className="text-white/60 text-sm font-medium mt-1">{format(new Date(event.arrivalTime), 'HH:mm')}</div>}
          </div>
        </div>

        {/* Price & CTA */}
        <div className="flex md:flex-col items-center md:items-end gap-4 md:gap-2 md:min-w-36">
          <div>
            <div className="text-xs text-white/30 mb-1">Starts from</div>
            <div className="text-2xl font-bold gold-text">₹{minPrice / 100 || 'N/A'}</div>
          </div>
          <div className="flex items-center gap-1 text-xs text-white/40">
            <Users size={12} /> <span>{event.availableSeats} left</span>
          </div>
          <button className="btn-blue text-sm py-2 px-5 flex items-center gap-1">
            Select <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 flex items-center gap-4 text-xs text-white/30" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <span className="flex items-center gap-1">
          <Calendar size={11} />
          {event.departureTime && format(new Date(event.departureTime), 'EEE, dd MMM yyyy')}
        </span>
        <span className={`badge ${event.availableSeats > 10 ? 'badge-green' : event.availableSeats > 0 ? 'badge-gold' : 'badge-red'}`}>
          {event.availableSeats > 10 ? 'Available' : event.availableSeats > 0 ? 'Filling fast' : 'Sold out'}
        </span>
      </div>
    </div>
  )
}
