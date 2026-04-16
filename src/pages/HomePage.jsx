import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchWallet } from '../store/slices/walletSlice'
import { fetchMyBookings } from '../store/slices/bookingsSlice'
import Navbar from '../components/layout/Navbar'
import HeroSection from '../components/home/HeroSection'
import StatsRow from '../components/home/StatsRow'
import PopularRoutes from '../components/home/PopularRoutes'
import RecentActivity from '../components/home/RecentActivity'

export default function HomePage() {
  const dispatch = useDispatch()
  const { user } = useSelector((s) => s.auth)
  const { balance, transactions } = useSelector((s) => s.wallet)
  const { list: bookings } = useSelector((s) => s.bookings)

  useEffect(() => {
    dispatch(fetchWallet())
    dispatch(fetchMyBookings())
  }, [dispatch])

  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed')

  return (
    <div style={{ background: 'var(--taski-dark)', minHeight: '100vh' }}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <HeroSection user={user} />
        <StatsRow
          balance={balance}
          confirmedCount={confirmedBookings.length}
          totalTrips={bookings.length}
          txCount={transactions.length}
        />
        <div className="grid md:grid-cols-2 gap-6">
          <PopularRoutes />
          <RecentActivity bookings={bookings} />
        </div>
      </div>
    </div>
  )
}
