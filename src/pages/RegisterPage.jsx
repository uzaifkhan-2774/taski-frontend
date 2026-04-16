import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { register, clearError } from '../store/slices/authSlice'
import { toast } from 'react-toastify'
import { Plane, Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import Spinner from '../components/ui/Spinner'
import InputField from '../components/ui/InputField'

export default function RegisterPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, token } = useSelector((s) => s.auth)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPass, setShowPass] = useState(false)

  useEffect(() => { if (token) navigate('/') }, [token, navigate])
  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()) } }, [error, dispatch])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    dispatch(register(form))
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--taski-dark)' }}>
      <div className="w-full max-w-md fade-up">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F5A623, #e8941a)' }}>
            <Plane size={16} className="text-black" />
          </div>
          <span className="font-bold text-xl" style={{ fontFamily: 'Syne, sans-serif' }}>ta<span className="gold-text">ski</span></span>
        </div>

        <h2 className="text-3xl font-bold mb-2">Create account</h2>
        <p className="text-white/40 mb-8">Start booking flights today</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-white/50 mb-2 block">Full Name</label>
            <InputField
              placeholder="John Doe" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              icon={<User size={16} />} required
            />
          </div>
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
              type={showPass ? 'text' : 'password'} placeholder="Min 6 characters"
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              icon={<Lock size={16} />}
              rightEl={<button type="button" onClick={() => setShowPass(!showPass)}>{showPass ? <EyeOff size={16} /> : <Eye size={16} />}</button>}
              required
            />
          </div>
          <button type="submit" className="btn-gold w-full mt-6 flex items-center justify-center gap-2" disabled={loading}>
            {loading ? <><Spinner color="border-black/30" /> Creating account...</> : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-6 text-white/40 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
