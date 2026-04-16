import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEvents } from '../store/slices/eventsSlice'
import Navbar from '../components/layout/Navbar'
import FlightSearchBar from '../components/flights/FlightSearchBar'
import FlightCard from '../components/flights/FlightCard'
import SkeletonList from '../components/ui/SkeletonList'
import EmptyState from '../components/ui/EmptyState'
import { Plane } from 'lucide-react'

export default function EventsPage() {
  const dispatch = useDispatch()
  const { list: events, loading } = useSelector((s) => s.events)

  useEffect(() => { dispatch(fetchEvents()) }, [dispatch])

  const handleSearch = (params) => dispatch(fetchEvents(params))

  return (
    <div style={{ background: 'var(--taski-dark)', minHeight: '100vh' }}>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        <FlightSearchBar onSearch={handleSearch} />

        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold">
            {loading ? 'Searching...' : `${events.length} flights available`}
          </h3>
        </div>

        {loading ? (
          <SkeletonList count={3} height="h-32" />
        ) : events.length === 0 ? (
          <EmptyState
            icon={<Plane size={50} />}
            title="No flights found"
            subtitle="Try different search criteria"
          />
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <FlightCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
