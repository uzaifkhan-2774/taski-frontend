import { Link, useNavigate } from 'react-router-dom'
import { Plane, Clock, ArrowRight } from 'lucide-react'

const ROUTES = [
  { from: 'Mumbai', to: 'Delhi', code: 'BOM→DEL', price: '₹4,500', duration: '2h 10m' },
  { from: 'Bangalore', to: 'Hyderabad', code: 'BLR→HYD', price: '₹3,200', duration: '1h 20m' },
  { from: 'Chennai', to: 'Kolkata', code: 'MAA→CCU', price: '₹5,800', duration: '2h 35m' },
  { from: 'Delhi', to: 'Mumbai', code: 'DEL→BOM', price: '₹4,200', duration: '2h 05m' },
]

export default function PopularRoutes() {
  const navigate = useNavigate()

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold">Popular Routes</h2>
        <Link to="/flights" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
          All flights <ArrowRight size={13} />
        </Link>
      </div>
      <div className="space-y-3">
        {ROUTES.map((route) => (
          <div
            key={route.code}
            className="flex items-center justify-between p-4 rounded-xl glass-hover cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            onClick={() => navigate('/flights')}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(79,142,247,0.1)', color: '#4F8EF7' }}>
                <Plane size={16} />
              </div>
              <div>
                <div className="font-semibold text-sm">{route.from} → {route.to}</div>
                <div className="text-white/40 text-xs flex items-center gap-1 mt-0.5">
                  <Clock size={10} /> {route.duration}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold gold-text">{route.price}</div>
              <div className="text-white/30 text-xs">onwards</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
