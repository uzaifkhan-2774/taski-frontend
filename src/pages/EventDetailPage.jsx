import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEvent, reserveSeats } from '../store/slices/eventsSlice'
import { toast } from 'react-toastify'
import Navbar from '../components/layout/Navbar'
import FlightInfoHeader from '../components/flights/FlightInfoHeader'
import SeatMap from '../components/booking/SeatMap'
import BookingSummaryPanel from '../components/booking/BookingSummaryPanel'
import SkeletonList from '../components/ui/SkeletonList'

export default function EventDetailPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { current: event, loading, reservation } = useSelector((s) => s.events)
  const { balance } = useSelector((s) => s.wallet)
  const [selectedSeats, setSelectedSeats] = useState([])
  const [reserving, setReserving] = useState(false)

  useEffect(() => { dispatch(fetchEvent(id)) }, [id, dispatch])

  useEffect(() => {
    if (reservation) {
      navigate('/booking/confirm', { state: { reservation, eventId: id, event } })
    }
  }, [reservation])

  const toggleSeat = (seat) => {
    if (seat.status !== 'available') return
    setSelectedSeats((prev) =>
      prev.find((s) => s._id === seat._id)
        ? prev.filter((s) => s._id !== seat._id)
        : [...prev, seat]
    )
  }

  const handleReserve = async () => {
    if (!selectedSeats.length) { toast.error('Select at least one seat'); return }
    const totalPrice = selectedSeats.reduce((s, seat) => s + seat.price, 0)
    if (balance < totalPrice) { toast.error('Insufficient wallet balance'); return }
    setReserving(true)
    const result = await dispatch(reserveSeats({ eventId: id, seatIds: selectedSeats.map((s) => s._id) }))
    setReserving(false)
    if (result.meta.requestStatus === 'rejected') toast.error(result.payload)
  }

  if (loading || !event) {
    return (
      <div style={{ background: 'var(--taski-dark)', minHeight: '100vh' }}>
        <Navbar />
        <div className="max-w-5xl mx-auto px-8 py-8 space-y-4">
          <SkeletonList count={2} height="h-40" />
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--taski-dark)', minHeight: '100vh' }}>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
        <FlightInfoHeader event={event} />
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <SeatMap
              seats={event.seats}
              selectedSeats={selectedSeats}
              onToggle={toggleSeat}
            />
          </div>
          <BookingSummaryPanel
            selectedSeats={selectedSeats}
            balance={balance}
            reserving={reserving}
            onReserve={handleReserve}
          />
        </div>
      </div>
    </div>
  )
}
