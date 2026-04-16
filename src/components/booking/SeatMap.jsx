import { useState } from 'react'

const LEGEND = [
  ['available', '#00E5A0', 'Available'],
  ['selected', '#4F8EF7', 'Selected'],
  ['reserved', '#F5A623', 'Reserved'],
  ['booked', '#ff5050', 'Booked'],
]

const CLASS_FILTERS = ['all', 'economy', 'business', 'first']

export default function SeatMap({ seats, selectedSeats, onToggle }) {
  const [classFilter, setClassFilter] = useState('all')

  const filtered = seats?.filter((s) => classFilter === 'all' || s.class === classFilter) || []
  const rows = [...new Set(filtered.map((s) => s.row))].sort()

  return (
    <div className="glass rounded-3xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-lg">Select Seats</h3>
        <div className="flex gap-2">
          {CLASS_FILTERS.map((c) => (
            <button
              key={c}
              onClick={() => setClassFilter(c)}
              className="text-xs px-3 py-1.5 rounded-lg transition-all capitalize font-medium"
              style={{
                background: classFilter === c ? 'rgba(79,142,247,0.2)' : 'rgba(255,255,255,0.05)',
                color: classFilter === c ? '#4F8EF7' : 'rgba(255,255,255,0.4)',
                border: `1px solid ${classFilter === c ? 'rgba(79,142,247,0.3)' : 'transparent'}`,
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-6 flex-wrap">
        {LEGEND.map(([cls, color, label]) => (
          <div key={cls} className="flex items-center gap-2">
            <div className={`seat ${cls}`} style={{ width: 20, height: 20, fontSize: 8 }} />
            <span className="text-xs text-white/40">{label}</span>
          </div>
        ))}
      </div>

      {/* Aircraft nose */}
      <div className="text-center mb-6">
        <div className="inline-block px-6 py-2 rounded-full text-xs text-white/30" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
          ✈ FRONT OF AIRCRAFT
        </div>
      </div>

      {/* Seat grid */}
      <div className="space-y-2 overflow-x-auto">
        {rows.map((row) => {
          const rowSeats = filtered.filter((s) => s.row === row).sort((a, b) => a.seatNumber.localeCompare(b.seatNumber))
          const half = Math.ceil(rowSeats.length / 2)
          return (
            <div key={row} className="flex items-center gap-2 justify-center">
              <span className="text-xs text-white/30 w-5 text-right">{row}</span>
              <div className="flex gap-1">
                {rowSeats.slice(0, half).map((seat) => (
                  <SeatButton key={seat._id} seat={seat} selected={!!selectedSeats.find((s) => s._id === seat._id)} onToggle={onToggle} />
                ))}
              </div>
              <div className="w-8" />
              <div className="flex gap-1">
                {rowSeats.slice(half).map((seat) => (
                  <SeatButton key={seat._id} seat={seat} selected={!!selectedSeats.find((s) => s._id === seat._id)} onToggle={onToggle} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function SeatButton({ seat, selected, onToggle }) {
  return (
    <button
      className={`seat ${selected ? 'selected' : seat.status}`}
      onClick={() => onToggle(seat)}
      title={`${seat.seatNumber} - ${seat.class} - ₹${(seat.price / 100).toLocaleString()}`}
    >
      {seat.seatNumber.replace(seat.row, '')}
    </button>
  )
}
