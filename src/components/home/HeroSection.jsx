import { Link } from 'react-router-dom'
import { Plane, ArrowRight } from 'lucide-react'

export default function HeroSection({ user }) {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening'

  return (
    <div
      className="relative rounded-3xl overflow-hidden mb-8 p-8 md:p-12"
      style={{ background: 'linear-gradient(135deg, #0F1629 0%, #1A2744 60%, #0F1629 100%)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <div className="absolute top-0 right-0 w-96 h-96 opacity-10" style={{ background: 'radial-gradient(circle at 80% 20%, #4F8EF7, transparent 60%)' }} />
      <div className="absolute bottom-0 left-20 w-64 h-64 opacity-5" style={{ background: 'radial-gradient(circle, #F5A623, transparent 60%)' }} />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <p className="text-white/40 mb-2 font-medium">Good {greeting},</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>
            {user?.name?.split(' ')[0]} <span className="gold-text">✈</span>
          </h1>
          <p className="text-white/50 text-lg">Where are you flying today?</p>
          <Link to="/flights" className="btn-gold inline-flex items-center gap-2 mt-6">
            Search Flights <ArrowRight size={16} />
          </Link>
        </div>
        <div className="float-anim">
          <div className="w-32 h-32 rounded-3xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(245,166,35,0.15), rgba(79,142,247,0.15))', border: '1px solid rgba(245,166,35,0.2)' }}>
            <Plane size={60} className="text-yellow-400" />
          </div>
        </div>
      </div>
    </div>
  )
}
