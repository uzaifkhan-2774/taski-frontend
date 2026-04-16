import { useNavigate } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import Navbar from '../layout/Navbar'

export default function BookingConfirmed({ reservation, totalAmount }) {
  const navigate = useNavigate()

  return (
    <div style={{ background: 'var(--taski-dark)', minHeight: '100vh' }}>
      <Navbar />
      <div className="max-w-md mx-auto px-4 py-16 text-center fade-up">
        <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 pulse-gold" style={{ background: 'linear-gradient(135deg, rgba(0,229,160,0.2), rgba(0,229,160,0.1))', border: '2px solid #00E5A0' }}>
          <CheckCircle size={40} className="text-green-400" />
        </div>
        <h2 className="text-3xl font-bold mb-3">Booking Confirmed!</h2>
        <p className="text-white/40 mb-8">Your seats have been booked successfully. Have a great flight!</p>

        <div className="glass rounded-2xl p-5 mb-6 text-left space-y-3">
          {reservation.seats?.map((s) => (
            <div key={s.seatId} className="flex justify-between text-sm">
              <span className="text-white/60">Seat {s.seatNumber} ({s.class})</span>
              <span className="font-medium">₹{(s.price / 100).toLocaleString()}</span>
            </div>
          ))}
          <div className="pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex justify-between font-bold">
              <span>Total Paid</span>
              <span className="gold-text">₹{(totalAmount / 100).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="btn-blue flex-1" onClick={() => navigate('/bookings')}>View My Trips</button>
          <button
            className="flex-1 py-3 rounded-xl text-white/50 hover:text-white transition-all"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
            onClick={() => navigate('/flights')}
          >
            Book More
          </button>
        </div>
      </div>
    </div>
  )
}
