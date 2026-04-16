export default function BookingBreakdown({ stats }) {
  if (!stats) return null
  const items = [
    { label: 'Confirmed', val: stats.confirmedBookings, color: '#00E5A0' },
    { label: 'Cancelled', val: stats.cancelledBookings, color: '#ff5050' },
  ]
  return (
    <div className="mt-6 glass rounded-2xl p-5">
      <h3 className="font-bold mb-4">Booking Breakdown</h3>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.label}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-white/50">{item.label}</span>
              <span style={{ color: item.color }}>{item.val}</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${stats.totalBookings ? (item.val / stats.totalBookings) * 100 : 0}%`, background: item.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
