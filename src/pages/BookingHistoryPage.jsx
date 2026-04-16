import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMyBookings, cancelBooking } from '../store/slices/bookingsSlice'
import { fetchWallet } from '../store/slices/walletSlice'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import Navbar from '../components/layout/Navbar'
import SkeletonList from '../components/ui/SkeletonList'
import EmptyState from '../components/ui/EmptyState'
import Badge from '../components/ui/Badge'
import { Plane, Calendar, X, ChevronDown, ChevronUp, Ticket } from 'lucide-react'

const FILTERS = ['all', 'confirmed', 'cancelled']

export default function BookingHistoryPage() {
  const dispatch = useDispatch()
  const { list: bookings, loading } = useSelector((s) => s.bookings)
  const [expanded, setExpanded] = useState(null)
  const [cancelling, setCancelling] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => { dispatch(fetchMyBookings()) }, [dispatch])

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking? You will receive a full refund.')) return
    setCancelling(id)
    const result = await dispatch(cancelBooking(id))
    setCancelling(null)
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Booking cancelled. Refund added to wallet.')
      dispatch(fetchWallet())
    } else {
      toast.error(result.payload || 'Cancel failed')
    }
  }

  const filtered = bookings.filter((b) => filter === 'all' || b.status === filter)

  return (
    <div style={{ background: 'var(--taski-dark)', minHeight: '100vh' }}>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-8">
        <h1 className="text-3xl font-bold mb-2">My Trips</h1>
        <p className="text-white/40 mb-6">All your flight bookings</p>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all"
              style={{
                background: filter === f ? 'rgba(79,142,247,0.2)' : 'rgba(255,255,255,0.05)',
                color: filter === f ? '#4F8EF7' : 'rgba(255,255,255,0.5)',
                border: `1px solid ${filter === f ? 'rgba(79,142,247,0.3)' : 'transparent'}`,
              }}
            >
              {f} ({f === 'all' ? bookings.length : bookings.filter((b) => b.status === f).length})
            </button>
          ))}
        </div>

        {loading ? (
          <SkeletonList count={3} height="h-24" />
        ) : filtered.length === 0 ? (
          <EmptyState icon={<Ticket size={48} />} title={`No ${filter !== 'all' ? filter : ''} bookings found`} />
        ) : (
          <div className="space-y-4">
            {filtered.map((b) => (
              <div key={b._id} className="glass rounded-2xl overflow-hidden">
                {/* Collapsed row */}
                <div className="p-5 cursor-pointer" onClick={() => setExpanded(expanded === b._id ? null : b._id)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: b.status === 'confirmed' ? 'rgba(0,229,160,0.1)' : 'rgba(255,80,80,0.1)' }}>
                        <Plane size={18} style={{ color: b.status === 'confirmed' ? '#00E5A0' : '#ff5050' }} />
                      </div>
                      <div>
                        <div className="font-semibold">{b.event?.origin} → {b.event?.destination}</div>
                        <div className="text-white/40 text-xs flex items-center gap-2 mt-0.5">
                          <Calendar size={11} />
                          {b.event?.departureTime && format(new Date(b.event.departureTime), 'EEE, dd MMM yyyy · HH:mm')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge status={b.status} />
                      {expanded === b._id ? <ChevronUp size={16} className="text-white/30" /> : <ChevronDown size={16} className="text-white/30" />}
                    </div>
                  </div>
                </div>

                {/* Expanded details */}
                {expanded === b._id && (
                  <div className="px-5 pb-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="pt-4 space-y-3">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <DetailItem label="Flight" value={b.event?.flightNumber || b.event?.airline} />
                        <DetailItem label="Total Paid" value={`₹${(b.totalAmount / 100).toLocaleString('en-IN')}`} gold />
                        <DetailItem label="Booked On" value={format(new Date(b.createdAt), 'dd MMM yyyy')} />
                        <DetailItem label="Booking ID" value={b._id.slice(-8).toUpperCase()} mono />
                      </div>

                      <div>
                        <span className="text-white/30 text-xs block mb-2">Seats</span>
                        <div className="flex gap-2 flex-wrap">
                          {b.seats?.map((s) => (
                            <div key={s.seatId} className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: 'rgba(79,142,247,0.1)', color: '#4F8EF7', border: '1px solid rgba(79,142,247,0.2)' }}>
                              {s.seatNumber} · {s.class}
                            </div>
                          ))}
                        </div>
                      </div>

                      {b.status === 'confirmed' && (
                        <button
                          className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 mt-2 transition-all disabled:opacity-50"
                          onClick={() => handleCancel(b._id)}
                          disabled={cancelling === b._id}
                        >
                          {cancelling === b._id
                            ? <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                            : <X size={14} />}
                          Cancel Booking (Full Refund)
                        </button>
                      )}
                      {b.status === 'cancelled' && b.refundedAt && (
                        <p className="text-xs text-blue-400">Refunded on {format(new Date(b.refundedAt || b.cancelledAt), 'dd MMM yyyy')}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function DetailItem({ label, value, gold, mono }) {
  return (
    <div>
      <span className="text-white/30 text-xs block mb-1">{label}</span>
      <span className={`font-medium ${gold ? 'gold-text' : ''} ${mono ? 'text-xs font-mono text-white/50' : ''}`}>{value}</span>
    </div>
  )
}
