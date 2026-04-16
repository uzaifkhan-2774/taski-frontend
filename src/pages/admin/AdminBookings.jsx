import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAdminBookings, adminCancelBooking } from '../../store/slices/adminSlice'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import AdminLayout from '../../components/layout/AdminLayout'
import SkeletonList from '../../components/ui/SkeletonList'
import Badge from '../../components/ui/Badge'
import InputField from '../../components/ui/InputField'
import { Search, X, ChevronDown, ChevronUp } from 'lucide-react'

const FILTERS = ['all', 'confirmed', 'cancelled']

export default function AdminBookings() {
  const dispatch = useDispatch()
  const { bookings, loading } = useSelector((s) => s.admin)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(null)
  const [cancelling, setCancelling] = useState(null)

  useEffect(() => { dispatch(fetchAdminBookings()) }, [dispatch])

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking and issue refund?')) return
    setCancelling(id)
    const result = await dispatch(adminCancelBooking({ id, reason: 'Admin cancellation' }))
    setCancelling(null)
    if (result.meta.requestStatus === 'fulfilled') toast.success('Booking cancelled and refunded')
    else toast.error(result.payload || 'Failed')
  }

  const filtered = bookings.filter((b) => {
    if (filter !== 'all' && b.status !== filter) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        b.user?.name?.toLowerCase().includes(q) ||
        b.user?.email?.toLowerCase().includes(q) ||
        b.event?.origin?.toLowerCase().includes(q) ||
        b.event?.destination?.toLowerCase().includes(q) ||
        b._id?.toLowerCase().includes(q)
      )
    }
    return true
  })

  return (
    <AdminLayout title="Booking Management">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="flex-1">
            <InputField
              placeholder="Search by user, route, booking ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search size={15} />}
            />
          </div>
          <div className="flex gap-2">
            {FILTERS.map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className="px-3 py-2 rounded-xl text-sm font-medium capitalize transition-all"
                style={{
                  background: filter === f ? 'rgba(79,142,247,0.2)' : 'rgba(255,255,255,0.05)',
                  color: filter === f ? '#4F8EF7' : 'rgba(255,255,255,0.5)',
                  border: `1px solid ${filter === f ? 'rgba(79,142,247,0.3)' : 'transparent'}`,
                }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="text-white/40 text-sm mb-4">{filtered.length} bookings found</div>

        {loading ? (
          <SkeletonList count={4} height="h-16" />
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-white/30">No bookings found</div>
        ) : (
          <div className="space-y-2">
            {filtered.map((b) => (
              <div key={b._id} className="glass rounded-xl overflow-hidden">
                <div className="p-4 cursor-pointer flex items-center gap-3"
                  onClick={() => setExpanded(expanded === b._id ? null : b._id)}>
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <div><span className="text-white/30 text-xs block">Passenger</span><span className="font-medium">{b.user?.name}</span></div>
                    <div><span className="text-white/30 text-xs block">Route</span><span>{b.event?.origin} → {b.event?.destination}</span></div>
                    <div><span className="text-white/30 text-xs block">Amount</span><span className="gold-text font-bold">₹{(b.totalAmount / 100).toLocaleString('en-IN')}</span></div>
                    <div><span className="text-white/30 text-xs block">Date</span><span className="text-white/60">{format(new Date(b.createdAt), 'dd MMM yyyy')}</span></div>
                  </div>
                  <Badge status={b.status} />
                  {expanded === b._id
                    ? <ChevronUp size={14} className="text-white/30 flex-shrink-0" />
                    : <ChevronDown size={14} className="text-white/30 flex-shrink-0" />}
                </div>

                {expanded === b._id && (
                  <div className="px-4 pb-4 pt-2 space-y-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      <div><span className="text-white/30 block">Booking ID</span><span className="font-mono">{b._id.slice(-12).toUpperCase()}</span></div>
                      <div><span className="text-white/30 block">Email</span><span>{b.user?.email}</span></div>
                      <div><span className="text-white/30 block">Flight</span><span>{b.event?.flightNumber}</span></div>
                      <div><span className="text-white/30 block">Payment</span>
                        <span className={b.paymentStatus === 'paid' ? 'text-green-400' : 'text-yellow-400'}>{b.paymentStatus}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-white/30 text-xs block mb-2">Seats</span>
                      <div className="flex gap-2 flex-wrap">
                        {b.seats?.map((s) => (
                          <div key={s.seatId} className="px-2 py-1 rounded text-xs font-medium"
                            style={{ background: 'rgba(79,142,247,0.1)', color: '#4F8EF7', border: '1px solid rgba(79,142,247,0.2)' }}>
                            {s.seatNumber} ({s.class})
                          </div>
                        ))}
                      </div>
                    </div>
                    {b.status === 'confirmed' && (
                      <button onClick={() => handleCancel(b._id)} disabled={cancelling === b._id}
                        className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-all disabled:opacity-50">
                        {cancelling === b._id
                          ? <div className="w-3 h-3 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                          : <X size={13} />}
                        Cancel & Refund
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
