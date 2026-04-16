import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { fetchMe } from './store/slices/authSlice'

import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import WalletPage from './pages/WalletPage'
import EventsPage from './pages/EventsPage'
import EventDetailPage from './pages/EventDetailPage'
import BookingConfirmPage from './pages/BookingConfirmPage'
import BookingHistoryPage from './pages/BookingHistoryPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminEvents from './pages/admin/AdminEvents'
import AdminBookings from './pages/admin/AdminBookings'
import AdminTransactions from './pages/admin/AdminTransactions'
import AdminSeats from './pages/admin/AdminSeats'

function PrivateRoute({ children, adminOnly = false }) {
  const { user, token } = useSelector((s) => s.auth)
  if (!token) return <Navigate to="/login" />
  if (adminOnly && user?.role !== 'admin') return <Navigate to="/" />
  return children
}

export default function App() {
  const dispatch = useDispatch()
  const { token } = useSelector((s) => s.auth)

  useEffect(() => {
    if (token) dispatch(fetchMe())
  }, [token, dispatch])

  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
        toastStyle={{ background: '#0F1629', border: '1px solid rgba(255,255,255,0.1)' }}
      />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route path="/wallet" element={<PrivateRoute><WalletPage /></PrivateRoute>} />
        <Route path="/flights" element={<PrivateRoute><EventsPage /></PrivateRoute>} />
        <Route path="/flights/:id" element={<PrivateRoute><EventDetailPage /></PrivateRoute>} />
        <Route path="/booking/confirm" element={<PrivateRoute><BookingConfirmPage /></PrivateRoute>} />
        <Route path="/bookings" element={<PrivateRoute><BookingHistoryPage /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>} />
        <Route path="/admin/events" element={<PrivateRoute adminOnly><AdminEvents /></PrivateRoute>} />
        <Route path="/admin/events/:id/seats" element={<PrivateRoute adminOnly><AdminSeats /></PrivateRoute>} />
        <Route path="/admin/bookings" element={<PrivateRoute adminOnly><AdminBookings /></PrivateRoute>} />
        <Route path="/admin/transactions" element={<PrivateRoute adminOnly><AdminTransactions /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}
