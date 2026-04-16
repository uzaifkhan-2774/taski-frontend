import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { login, clearError } from '../store/slices/authSlice'
import { toast } from 'react-toastify'
import { Plane, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import Spinner from '../components/ui/Spinner'
import InputField from '../components/ui/InputField'

export default function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, token } = useSelector((s) => s.auth)
  const [form, setForm] = useState({ email: '', password: '' })

  const [showPass, setShowPass] = useState(false)

  useEffect(() => { if (token) navigate('/') }, [token, navigate])
  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()) } }, [error, dispatch])

  const handleSubmit = (e) => { e.preventDefault(); dispatch(login(form)) }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--taski-dark)' }}>
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col items-center justify-center p-12"
        style={{ background: 'linear-gradient(135deg, #0F1629 0%, #1A2744 50%, #0F1629 100%)' }}>
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #4F8EF7, transparent)' }} />
        <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #F5A623, transparent)' }} />
        <div className="relative z-10 text-center">
          <div className="float-anim mb-8">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ background: 'linear-gradient(135deg, #F5A623, #e8941a)', boxShadow: '0 20px 60px rgba(245,166,35,0.3)' }}>
              <Plane size={36} className="text-black" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
            Your Journey<br /><span className="gold-text">Starts Here</span>
          </h1>
          <p className="text-white/50 text-lg max-w-xs mx-auto leading-relaxed">Book flights, manage your wallet, and travel smarter with Taski.</p>
          <div className="mt-12 grid grid-cols-3 gap-4">
            {[['500+', 'Destinations'], ['2M+', 'Passengers'], ['99.9%', 'Uptime']].map(([val, label]) => (
              <div key={label} className="glass rounded-2xl p-4">
                <div className="text-2xl font-bold gold-text">{val}</div>
                <div className="text-white/40 text-xs mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md fade-up">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F5A623, #e8941a)' }}>
              <Plane size={16} className="text-black" />
            </div>
            <span className="font-bold text-xl" style={{ fontFamily: 'Syne, sans-serif' }}>ta<span className="gold-text">ski</span></span>
          </div>

          <h2 className="text-3xl font-bold mb-2">Welcome back</h2>
          <p className="text-white/40 mb-8">Sign in to continue your journey</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-white/50 mb-2 block">Email Address</label>
              <InputField
                type="email" placeholder="you@example.com"
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                icon={<Mail size={16} />} required
              />
            </div>
            <div>
              <label className="text-sm text-white/50 mb-2 block">Password</label>
              <InputField
                type={showPass ? 'text' : 'password'} placeholder="Enter your password"
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                icon={<Lock size={16} />}
                rightEl={<button type="button" onClick={() => setShowPass(!showPass)}>{showPass ? <EyeOff size={16} /> : <Eye size={16} />}</button>}
                required
              />
            </div>
            <button type="submit" className="btn-gold w-full mt-6 flex items-center justify-center gap-2" disabled={loading}>
              {loading ? <><Spinner color="border-black/30" /> Signing in...</> : 'Sign In'}
            </button>
          </form>


          <p className="text-center mt-6 text-white/40 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-semibold">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
