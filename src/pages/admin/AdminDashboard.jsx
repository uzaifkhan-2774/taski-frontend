import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAdminStats } from '../../store/slices/adminSlice'
import AdminLayout from '../../components/layout/AdminLayout'
import StatsGrid from '../../components/admin/StatsGrid'
import BookingBreakdown from '../../components/admin/BookingBreakdown'

export default function AdminDashboard() {
  const dispatch = useDispatch()
  const { stats, loading } = useSelector((s) => s.admin)

  useEffect(() => { dispatch(fetchAdminStats()) }, [dispatch])

  return (
    <AdminLayout title="Dashboard">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Overview</h2>
          <p className="text-white/40 mt-1">Real-time platform stats</p>
        </div>
        <StatsGrid stats={stats} loading={loading} />
        <BookingBreakdown stats={stats} />
      </div>
    </AdminLayout>
  )
}
