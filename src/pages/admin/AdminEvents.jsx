import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchAdminEvents, createEvent, updateEvent, deleteEvent } from '../../store/slices/adminSlice'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import AdminLayout from '../../components/layout/AdminLayout'
import EventModal, { EMPTY } from '../../components/admin/EventModal'
import SkeletonList from '../../components/ui/SkeletonList'
import InputField from '../../components/ui/InputField'
import { Plus, Edit2, Trash2, Settings, Plane, Search } from 'lucide-react'

export default function AdminEvents() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { events, loading } = useSelector((s) => s.admin)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => { dispatch(fetchAdminEvents()) }, [dispatch])

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true) }
  const openEdit = (ev) => {
    setEditing(ev._id)
    setForm({
      title: ev.title, origin: ev.origin, destination: ev.destination,
      originCode: ev.originCode || '', destinationCode: ev.destinationCode || '',
      departureTime: ev.departureTime ? ev.departureTime.slice(0, 16) : '',
      arrivalTime: ev.arrivalTime ? ev.arrivalTime.slice(0, 16) : '',
      airline: ev.airline || '', flightNumber: ev.flightNumber || '',
      description: ev.description || '', status: ev.status,
    })
    setModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const result = editing
      ? await dispatch(updateEvent({ id: editing, data: form }))
      : await dispatch(createEvent(form))
    setSaving(false)
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success(editing ? 'Flight updated!' : 'Flight created!')
      setModal(false)
    } else {
      toast.error(result.payload || 'Failed')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this flight?')) return
    const result = await dispatch(deleteEvent(id))
    if (result.meta.requestStatus === 'fulfilled') toast.success('Flight deleted')
    else toast.error(result.payload || 'Failed')
  }

  const filtered = events.filter((ev) =>
    !search ||
    ev.title?.toLowerCase().includes(search.toLowerCase()) ||
    ev.origin?.toLowerCase().includes(search.toLowerCase()) ||
    ev.destination?.toLowerCase().includes(search.toLowerCase()) ||
    ev.flightNumber?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AdminLayout title="Flight Management">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="w-64">
            <InputField
              placeholder="Search flights..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search size={15} />}
            />
          </div>
          <button className="btn-gold flex items-center gap-2" onClick={openCreate}>
            <Plus size={16} /> Add Flight
          </button>
        </div>

        {loading ? (
          <SkeletonList count={3} height="h-20" />
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Plane size={40} className="mx-auto text-white/10 mb-4" />
            <p className="text-white/30">No flights found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((ev) => (
              <div key={ev._id} className="glass rounded-2xl p-5 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(79,142,247,0.1)', color: '#4F8EF7' }}>
                  <Plane size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{ev.origin} → {ev.destination}</div>
                  <div className="text-white/40 text-xs mt-0.5">
                    {ev.flightNumber} · {ev.airline} · {ev.departureTime && format(new Date(ev.departureTime), 'dd MMM yyyy HH:mm')}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className={`badge ${ev.status === 'active' ? 'badge-green' : 'badge-red'}`}>{ev.status}</span>
                  <span className="text-white/30">{ev.availableSeats ?? '?'} seats</span>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-2 rounded-xl text-white/40 hover:text-blue-400 hover:bg-blue-400/10 transition-all"
                    onClick={() => navigate(`/admin/events/${ev._id}/seats`)} title="Manage seats">
                    <Settings size={16} />
                  </button>
                  <button className="p-2 rounded-xl text-white/40 hover:text-yellow-400 hover:bg-yellow-400/10 transition-all"
                    onClick={() => openEdit(ev)}>
                    <Edit2 size={16} />
                  </button>
                  <button className="p-2 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all"
                    onClick={() => handleDelete(ev._id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal && (
        <EventModal
          form={form} setForm={setForm}
          editing={editing} saving={saving}
          onSubmit={handleSubmit}
          onClose={() => setModal(false)}
        />
      )}
    </AdminLayout>
  )
}
