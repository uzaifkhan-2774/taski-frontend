import { ArrowDownLeft, ArrowUpRight, RefreshCw, CreditCard, TrendingUp } from 'lucide-react'
import { format } from 'date-fns'

function TxIcon({ type }) {
  const map = {
    credit: { icon: <ArrowDownLeft size={16} />, color: '#00E5A0', bg: 'rgba(0,229,160,0.1)' },
    refund: { icon: <RefreshCw size={16} />, color: '#4F8EF7', bg: 'rgba(79,142,247,0.1)' },
    debit: { icon: <ArrowUpRight size={16} />, color: '#ff5050', bg: 'rgba(255,80,80,0.1)' },
  }
  const { icon, color, bg } = map[type] || map.debit
  return (
    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg, color }}>
      {icon}
    </div>
  )
}

export default function TransactionList({ transactions }) {
  return (
    <div className="glass rounded-3xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp size={18} className="text-blue-400" />
        <h3 className="font-bold text-lg">Transaction History</h3>
        <span className="badge badge-blue ml-2">{transactions.length}</span>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-12">
          <CreditCard size={40} className="mx-auto text-white/10 mb-4" />
          <p className="text-white/30">No transactions yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {[...transactions].reverse().map((t, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl transition-all hover:bg-white/3" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <TxIcon type={t.type} />
              <div className="flex-1">
                <div className="text-sm font-medium">{t.description}</div>
                <div className="text-white/30 text-xs mt-0.5">
                  {t.createdAt && format(new Date(t.createdAt), 'dd MMM yyyy, hh:mm a')}
                </div>
              </div>
              <div className={`font-bold text-base ${t.type === 'credit' ? 'text-green-400' : t.type === 'refund' ? 'text-blue-400' : 'text-red-400'}`}>
                {t.type === 'debit' ? '-' : '+'}₹{(t.amount / 100).toLocaleString('en-IN')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
