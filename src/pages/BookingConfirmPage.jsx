import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { confirmBooking } from '../store/slices/eventsSlice'
import { fetchWallet } from '../store/slices/walletSlice'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'
import { differenceInSeconds, format } from 'date-fns'
import Navbar from '../components/layout/Navbar'
import ReservationTimer from '../components/booking/ReservationTimer'
import BookingConfirmed from '../components/booking/BookingConfirmed'
import Spinner from '../components/ui/Spinner'
import { Check, Plane, Wallet, AlertTriangle } from 'lucide-react'

export default function BookingConfirmPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { balance } = useSelector((s) => s.wallet)
  const { reservation, eventId, event } = location.state || {}
  const [confirming, setConfirming] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300)

  useEffect(() => {
    dispatch(fetchWallet())
    if (!reservation) { navigate('/flights'); return }
    if (reservation.expiry) {
      const timer = setInterval(() => {
        const secs = differenceInSeconds(new Date(reservation.expiry), new Date())
        setTimeLeft(Math.max(0, secs))
        if (secs <= 0) { clearInterval(timer); toast.error('Reservation expired!'); navigate('/flights') }
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [reservation])

  if (!reservation) return null

  const totalAmount = reservation.seats?.reduce((s, seat) => s + seat.price, 0) || 0

  const handleConfirm = async () => {
    setConfirming(true)
    const result = await dispatch(confirmBooking({
      eventId,
      seatIds: reservation.seats.map((s) => s.seatId),
      idempotencyKey: uuidv4(),
    }))
    setConfirming(false)
    if (result.meta.requestStatus === 'fulfilled') {
      setConfirmed(true)
      dispatch(fetchWallet())
    } else {
      toast.error(result.payload || 'Booking failed')
    }
  }

  if (confirmed) return <BookingConfirmed reservation={reservation} totalAmount={totalAmount} />

  return (
    <div style={{ background: 'var(--taski-dark)', minHeight: '100vh' }}>
      <Navbar />
      <div className="max-w-lg mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Confirm Booking</h1>
        <p className="text-white/40 mb-6">Review and pay for your seats</p>

        <ReservationTimer timeLeft={timeLeft} />

        {/* Flight info */}
        {event && (
          <div className="glass rounded-2xl p-5 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <Plane size={18} className="text-blue-400" />
              <span className="font-semibold">{event.origin} → {event.destination}</span>
            </div>
            <div className="text-sm text-white/40">
              {event.flightNumber} · {event.departureTime && format(new Date(event.departureTime), 'EEE, dd MMM yyyy HH:mm')}
            </div>
          </div>
        )}

        {/* Seats */}
        <div className="glass rounded-2xl p-5 mb-4">
          <h4 className="font-semibold mb-4">Selected Seats</h4>
          <div className="space-y-2">
            {reservation.seats?.map((s) => (
              <div key={s.seatId} className="flex justify-between items-center p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(79,142,247,0.15)', color: '#4F8EF7', border: '1px solid rgba(79,142,247,0.2)' }}>
                    {s.seatNumber}
                  </div>
                  <span className="text-sm capitalize text-white/60">{s.class} class</span>
                </div>
                <span className="font-semibold">₹{(s.price / 100).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
          <div className="pt-4 mt-3 flex justify-between font-bold text-lg" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <span>Total</span>
            <span className="gold-text">₹{(totalAmount / 100).toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Payment */}
        <div className="glass rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Wallet size={16} className="text-yellow-400" />
            <span className="font-semibold">Pay via Wallet</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/50">Available balance</span>
            <span className={`font-semibold ${balance >= totalAmount ? 'text-green-400' : 'text-red-400'}`}>
              ₹{(balance / 100).toLocaleString('en-IN')}
            </span>
          </div>
          {balance < totalAmount ? (
            <div className="flex items-start gap-2 p-3 rounded-xl mt-3" style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.2)' }}>
              <AlertTriangle size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-red-400 text-xs">
                Insufficient balance. Need ₹{((totalAmount - balance) / 100).toLocaleString('en-IN')} more.{' '}
                <button className="underline" onClick={() => navigate('/wallet')}>Add money</button>
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-3 rounded-xl mt-3 text-sm text-green-400" style={{ background: 'rgba(0,229,160,0.08)', border: '1px solid rgba(0,229,160,0.2)' }}>
              <Check size={14} /> Sufficient balance available
            </div>
          )}
        </div>

        <button
          className="btn-gold w-full flex items-center justify-center gap-2"
          disabled={confirming || balance < totalAmount || timeLeft === 0}
          onClick={handleConfirm}
        >
          {confirming
            ? <><Spinner color="border-black/30" /> Processing...</>
            : <><Check size={16} /> Confirm & Pay ₹{(totalAmount / 100).toLocaleString('en-IN')}</>
          }
        </button>
      </div>
    </div>
  )
}
