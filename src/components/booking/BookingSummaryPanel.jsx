import { Info, AlertCircle, Check } from 'lucide-react'
import Spinner from '../ui/Spinner'

export default function BookingSummaryPanel({ selectedSeats, balance, reserving, onReserve }) {
  const totalPrice = selectedSeats.reduce((s, seat) => s + seat.price, 0)
  const canPay = balance >= totalPrice

  return (
    <div className="space-y-4">
      {/* Seat list */}
      <div className="glass rounded-2xl p-5">
        <h4 className="font-bold mb-4">Booking Summary</h4>
        {selectedSeats.length === 0 ? (
          <div className="text-center py-6">
            <Info size={30} className="mx-auto text-white/10 mb-3" />
            <p className="text-white/30 text-sm">Select seats from the map</p>
          </div>
        ) : (
          <div className="space-y-3">
            {selectedSeats.map((s) => (
              <div key={s._id} className="flex justify-between items-center text-sm">
                <div>
                  <span className="font-medium">Seat {s.seatNumber}</span>
                  <span className="text-white/40 ml-2 capitalize text-xs">{s.class}</span>
                </div>
                <span className="font-semibold">₹{(s.price / 100).toLocaleString()}</span>
              </div>
            ))}
            <div className="pt-3 mt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="gold-text">₹{(totalPrice / 100).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Wallet */}
      <div className="glass rounded-2xl p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/40">Wallet Balance</span>
          <span className={`font-bold ${canPay ? 'text-green-400' : 'text-red-400'}`}>
            ₹{(balance / 100).toLocaleString('en-IN')}
          </span>
        </div>
        {totalPrice > 0 && !canPay && (
          <div className="mt-3 p-3 rounded-xl flex items-start gap-2" style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.2)' }}>
            <AlertCircle size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-red-400 text-xs">Insufficient balance. Add ₹{(((totalPrice - balance) / 100)).toLocaleString('en-IN')} more.</p>
          </div>
        )}
      </div>

      <button
        className="btn-gold w-full flex items-center justify-center gap-2"
        disabled={!selectedSeats.length || reserving || !canPay}
        onClick={onReserve}
      >
        {reserving ? (
          <><Spinner color="border-black/30" /> Reserving...</>
        ) : (
          <><Check size={16} /> Reserve {selectedSeats.length} Seat{selectedSeats.length !== 1 ? 's' : ''}</>
        )}
      </button>
      <p className="text-center text-xs text-white/30">Seats held for 5 minutes after reservation</p>
    </div>
  )
}
