import { useState } from 'react'
import { MapPin, Calendar, Search } from 'lucide-react'
import InputField from '../ui/InputField'

export default function FlightSearchBar({ onSearch }) {
  const [form, setForm] = useState({ origin: '', destination: '', date: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(form)
  }

  return (
    <div className="glass rounded-3xl p-6 mb-8">
      <h2 className="text-xl font-bold mb-5">Search Flights</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <InputField
            placeholder="From (city/airport)"
            value={form.origin}
            onChange={(e) => setForm({ ...form, origin: e.target.value })}
            icon={<MapPin size={16} />}
          />
          <InputField
            placeholder="To (city/airport)"
            value={form.destination}
            onChange={(e) => setForm({ ...form, destination: e.target.value })}
            icon={<MapPin size={16} />}
          />
          <InputField
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            icon={<Calendar size={16} />}
          />
          <button type="submit" className="btn-gold flex items-center justify-center gap-2">
            <Search size={16} /> Search
          </button>
        </div>
      </form>
    </div>
  )
}
