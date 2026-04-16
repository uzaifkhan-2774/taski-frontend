import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { bulkCreateSeats } from '../../store/slices/adminSlice'
import { toast } from 'react-toastify'
import AdminLayout from '../../components/layout/AdminLayout'
import Spinner from '../../components/ui/Spinner'
import api from '../../services/api'
import { ArrowLeft, Plus, Layers } from 'lucide-react'

const DEFAULT_CLASSES = [
  { class: 'first', rows: 'A,B', price: 1500000 },
  { class: 'business', rows: 'C,D,E', price: 800000 },
  { class: 'economy', rows: 'F,G,H,I,J', price: 450000 },
]

const CLASS_COLORS = { first: '#F5A623', business: '#4F8EF7', economy: '#00E5A0' }

export default function AdminSeats() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [event, setEvent] = useState(null)
  const [loadingEvent, setLoadingEvent] = useState(true)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ seatsPerRow: 6, classes: DEFAULT_CLASSES })

  useEffect(() => {
    api.get('/admin/events').then((res) => {
      setEvent(res.data.find((e) => e._id === id))
      setLoadingEvent(false)
    })
  }, [id])

  const updateClass = (i, field, val) => {
    const classes = [...form.classes]
    classes[i] = { ...classes[i], [field]: val }
    setForm({ ...form, classes })
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setCreating(true)
    const data = {
      seatsPerRow: parseInt(form.seatsPerRow),
      classes: form.classes.map((c) => ({
        class: c.class,
        rows: c.rows.split(',').map((r) => r.trim()).filter(Boolean),
        price: parseInt(c.price),
      })),
    }
    const result = await dispatch(bulkCreateSeats({ id, data }))
    setCreating(false)
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Seats created!')
      setEvent(result.payload.event)
    } else {
      toast.error(result.payload || 'Failed')
    }
  }

  const seatsByClass = event?.seats?.reduce((acc, s) => {
    acc[s.class] = acc[s.class] || { available: 0, reserved: 0, booked: 0 }
    acc[s.class][s.status]++
    return acc
  }, {}) || {}

  return (
    <AdminLayout title="Seat Management">
      <div className="max-w-4xl mx-auto">
        <button className="flex items-center gap-2 text-white/40 hover:text-white mb-5 transition-all" onClick={() => navigate('/admin/events')}>
          <ArrowLeft size={16} /> Back to Flights
        </button>

        {/* Event info */}
        {loadingEvent ? (
          <div className="skeleton h-20 rounded-2xl mb-6" />
        ) : event ? (
          <div className="glass rounded-2xl p-5 mb-6">
            <h2 className="font-bold text-lg">{event.title}</h2>
            <p className="text-white/40 text-sm">{event.flightNumber} · {event.origin} → {event.destination}</p>
            <div className="flex gap-4 mt-3 text-sm">
              <span className="text-white/50">Total: <span className="text-white">{event.totalSeats}</span></span>
              <span className="text-green-400">Available: {event.availableSeats}</span>
              <span style={{ color: '#F5A623' }}>Reserved: {event.seats?.filter((s) => s.status === 'reserved').length}</span>
              <span className="text-red-400">Booked: {event.seats?.filter((s) => s.status === 'booked').length}</span>
            </div>
          </div>
        ) : null}

        {/* Class breakdown */}
        {Object.entries(seatsByClass).length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            {Object.entries(seatsByClass).map(([cls, counts]) => (
              <div key={cls} className="glass rounded-2xl p-4">
                <div className="capitalize font-bold mb-3" style={{ color: CLASS_COLORS[cls] || '#fff' }}>{cls}</div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-white/40">Available</span><span className="text-green-400">{counts.available}</span></div>
                  <div className="flex justify-between"><span className="text-white/40">Reserved</span><span className="text-yellow-400">{counts.reserved}</span></div>
                  <div className="flex justify-between"><span className="text-white/40">Booked</span><span className="text-red-400">{counts.booked}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bulk create form */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Layers size={18} className="text-blue-400" />
            <h3 className="font-bold">Bulk Create Seats</h3>
          </div>
          <form onSubmit={handleCreate} className="space-y-5">
            <div className="w-40">
              <label className="text-xs text-white/40 mb-1.5 block">Seats per Row</label>
              <input type="number" className="input-dark" min={1} max={12} value={form.seatsPerRow} onChange={(e) => setForm({ ...form, seatsPerRow: e.target.value })} />
            </div>

            <div className="space-y-3">
              <label className="text-xs text-white/40 block uppercase tracking-wider">Class Configuration</label>
              {form.classes.map((cls, i) => (
                <div key={i} className="grid grid-cols-3 gap-3 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div>
                    <label className="text-xs text-white/30 mb-1 block">Class</label>
                    <select className="input-dark" value={cls.class} onChange={(e) => updateClass(i, 'class', e.target.value)}>
                      <option value="economy">Economy</option>
                      <option value="business">Business</option>
                      <option value="first">First</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-white/30 mb-1 block">Rows (comma-separated)</label>
                    <input className="input-dark" placeholder="A,B,C" value={cls.rows} onChange={(e) => updateClass(i, 'rows', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-white/30 mb-1 block">Price (paise)</label>
                    <input type="number" className="input-dark" placeholder="500000" value={cls.price} onChange={(e) => updateClass(i, 'price', e.target.value)} />
                    <p className="text-xs text-white/25 mt-1">= ₹{(cls.price / 100).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            <button type="submit" className="btn-gold flex items-center gap-2" disabled={creating}>
              {creating ? <><Spinner color="border-black/30" /> Creating...</> : <><Plus size={16} /> Create Seats</>}
            </button>
          </form>
        </div>

        {/* Seat map preview */}
        {event?.seats?.length > 0 && (
          <div className="glass rounded-2xl p-6 mt-6">
            <h3 className="font-bold mb-4">Seat Map Preview</h3>
            <div className="flex gap-3 mb-4 flex-wrap">
              {[['available', '#00E5A0', 'Available'], ['reserved', '#F5A623', 'Reserved'], ['booked', '#ff5050', 'Booked']].map(([s, c, l]) => (
                <div key={s} className="flex items-center gap-1.5 text-xs text-white/40">
                  <div className="w-3 h-3 rounded-sm" style={{ background: `${c}30`, border: `1px solid ${c}` }} />
                  {l}
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-1 max-h-48 overflow-y-auto">
              {event.seats.map((seat) => (
                <div
                  key={seat._id}
                  className="w-8 h-8 rounded flex items-center justify-center font-medium"
                  title={`${seat.seatNumber} - ${seat.class} - ₹${(seat.price / 100).toLocaleString()} - ${seat.status}`}
                  style={{
                    background: seat.status === 'available' ? 'rgba(0,229,160,0.1)' : seat.status === 'reserved' ? 'rgba(245,166,35,0.1)' : 'rgba(255,80,80,0.1)',
                    border: `1px solid ${seat.status === 'available' ? '#00E5A0' : seat.status === 'reserved' ? '#F5A623' : '#ff5050'}`,
                    color: seat.status === 'available' ? '#00E5A0' : seat.status === 'reserved' ? '#F5A623' : '#ff5050',
                    fontSize: '9px',
                  }}
                >
                  {seat.seatNumber}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
