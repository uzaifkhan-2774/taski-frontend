import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAdminTransactions } from '../../store/slices/adminSlice'
import { format } from 'date-fns'
import AdminLayout from '../../components/layout/AdminLayout'
import SkeletonList from '../../components/ui/SkeletonList'
import InputField from '../../components/ui/InputField'
import { ArrowUpRight, ArrowDownLeft, RefreshCw, Search } from 'lucide-react'

const TYPE_COLOR = { credit: '#00E5A0', debit: '#ff5050', refund: '#4F8EF7' }
const TYPE_ICON = {
  credit: <ArrowDownLeft size={14} />,
  debit: <ArrowUpRight size={14} />,
  refund: <RefreshCw size={14} />,
}

export default function AdminTransactions() {
  const dispatch = useDispatch()
  const { transactions, loading } = useSelector((s) => s.admin)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  useEffect(() => { dispatch(fetchAdminTransactions()) }, [dispatch])

  const filtered = transactions.filter((t) => {
    if (typeFilter !== 'all' && t.type !== typeFilter) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        t.userName?.toLowerCase().includes(q) ||
        t.userEmail?.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q)
      )
    }
    return true
  })

  const totalCredit = transactions.filter((t) => t.type === 'credit').reduce((s, t) => s + t.amount, 0)
  const totalDebit = transactions.filter((t) => t.type === 'debit').reduce((s, t) => s + t.amount, 0)
  const totalRefund = transactions.filter((t) => t.type === 'refund').reduce((s, t) => s + t.amount, 0)

  return (
    <AdminLayout title="Transactions">
      <div className="max-w-5xl mx-auto">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Added', value: totalCredit, color: '#00E5A0', icon: <ArrowDownLeft size={18} /> },
            { label: 'Total Spent', value: totalDebit, color: '#ff5050', icon: <ArrowUpRight size={18} /> },
            { label: 'Total Refunded', value: totalRefund, color: '#4F8EF7', icon: <RefreshCw size={18} /> },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2" style={{ color: stat.color }}>
                {stat.icon}
                <span className="text-xs">{stat.label}</span>
              </div>
              <div className="text-xl font-bold" style={{ color: stat.color }}>
                ₹{(stat.value / 100).toLocaleString('en-IN')}
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-5 flex-wrap">
          <div className="flex-1">
            <InputField
              placeholder="Search user or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search size={15} />}
            />
          </div>
          <div className="flex gap-2">
            {['all', 'credit', 'debit', 'refund'].map((f) => (
              <button key={f} onClick={() => setTypeFilter(f)}
                className="px-3 py-2 rounded-xl text-sm font-medium capitalize transition-all"
                style={{
                  background: typeFilter === f ? `${TYPE_COLOR[f] || '#4F8EF7'}20` : 'rgba(255,255,255,0.05)',
                  color: typeFilter === f ? (TYPE_COLOR[f] || '#4F8EF7') : 'rgba(255,255,255,0.5)',
                  border: `1px solid ${typeFilter === f ? `${TYPE_COLOR[f] || '#4F8EF7'}40` : 'transparent'}`,
                }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="text-white/40 text-sm mb-4">{filtered.length} transactions</div>

        {loading ? (
          <SkeletonList count={5} height="h-14" />
        ) : (
          <div className="glass rounded-2xl overflow-hidden">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-white/30">No transactions found</div>
            ) : (
              <div>
                {filtered.map((t, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 transition-all"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${TYPE_COLOR[t.type]}15`, color: TYPE_COLOR[t.type] }}>
                      {TYPE_ICON[t.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{t.description}</div>
                      <div className="text-xs text-white/30 mt-0.5">
                        {t.userName} · {t.createdAt && format(new Date(t.createdAt), 'dd MMM yyyy, HH:mm')}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold" style={{ color: TYPE_COLOR[t.type] }}>
                        {t.type === 'debit' ? '-' : '+'}₹{(t.amount / 100).toLocaleString('en-IN')}
                      </div>
                      <span className={`badge text-xs ${t.type === 'credit' ? 'badge-green' : t.type === 'refund' ? 'badge-blue' : 'badge-red'}`}>
                        {t.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
