import { X } from 'lucide-react'
import Spinner from '../ui/Spinner'

const EMPTY = {
  title: '', origin: '', destination: '', originCode: '', destinationCode: '',
  departureTime: '', arrivalTime: '', airline: '', flightNumber: '', description: '', status: 'active',
}

export default function EventModal({ form, setForm, editing, saving, onSubmit, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <div className="glass rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" style={{ border: '1px solid rgba(255,255,255,0.12)' }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">{editing ? 'Edit Flight' : 'Add New Flight'}</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-all"><X size={20} /></button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Flight Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
            <Field label="Flight Number" value={form.flightNumber} onChange={(v) => setForm({ ...form, flightNumber: v })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Origin City" value={form.origin} onChange={(v) => setForm({ ...form, origin: v })} required />
            <Field label="Origin Code (e.g. BOM)" value={form.originCode} onChange={(v) => setForm({ ...form, originCode: v })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Destination City" value={form.destination} onChange={(v) => setForm({ ...form, destination: v })} required />
            <Field label="Destination Code (e.g. DEL)" value={form.destinationCode} onChange={(v) => setForm({ ...form, destinationCode: v })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Departure Time" type="datetime-local" value={form.departureTime} onChange={(v) => setForm({ ...form, departureTime: v })} required />
            <Field label="Arrival Time" type="datetime-local" value={form.arrivalTime} onChange={(v) => setForm({ ...form, arrivalTime: v })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Airline" value={form.airline} onChange={(v) => setForm({ ...form, airline: v })} />
            <div>
              <label className="text-xs text-white/40 mb-2 block">Status</label>
              <select className="input-dark" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="active">Active</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          <Field label="Description (optional)" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl text-white/50 hover:text-white transition-all" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
              Cancel
            </button>
            <button type="submit" className="btn-gold flex-1 flex items-center justify-center gap-2" disabled={saving}>
              {saving ? <><Spinner color="border-black/30" /> Saving...</> : (editing ? 'Save Changes' : 'Create Flight')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', required }) {
  return (
    <div>
      <label className="text-xs text-white/40 mb-2 block">{label}</label>
      <input
        type={type} className="input-dark" value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
    </div>
  )
}

export { EMPTY }
