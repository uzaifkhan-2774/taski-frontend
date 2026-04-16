import { Wallet, ArrowDownLeft, ArrowUpRight, RefreshCw } from 'lucide-react'

export default function BalanceCard({ balance, transactions }) {
  const totalCredit = transactions.filter((t) => t.type === 'credit').reduce((s, t) => s + t.amount, 0)
  const totalDebit = transactions.filter((t) => t.type === 'debit').reduce((s, t) => s + t.amount, 0)
  const totalRefund = transactions.filter((t) => t.type === 'refund').reduce((s, t) => s + t.amount, 0)

  const stats = [
    { label: 'Added', value: totalCredit, icon: <ArrowDownLeft size={14} />, color: '#00E5A0' },
    { label: 'Spent', value: totalDebit, icon: <ArrowUpRight size={14} />, color: '#ff5050' },
    { label: 'Refunds', value: totalRefund, icon: <RefreshCw size={14} />, color: '#4F8EF7' },
  ]

  return (
    <div className="md:col-span-2 rounded-3xl p-8 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1A2744, #0F1629)', border: '1px solid rgba(245,166,35,0.2)' }}>
      <div className="absolute top-0 right-0 w-48 h-48 opacity-10" style={{ background: 'radial-gradient(circle at 80% 20%, #F5A623, transparent 60%)' }} />
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center pulse-gold" style={{ background: 'linear-gradient(135deg, #F5A623, #e8941a)' }}>
            <Wallet size={22} className="text-black" />
          </div>
          <div>
            <p className="text-white/40 text-sm">Available Balance</p>
            <p className="text-xs text-white/25">Taski Wallet</p>
          </div>
        </div>
        <div className="text-5xl font-bold gold-text mb-1">
          ₹{(balance / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </div>
        <p className="text-white/30 text-sm">Stored in paise for precision</p>

        <div className="grid grid-cols-3 gap-4 mt-8">
          {stats.map((stat) => (
            <div key={stat.label} className="glass rounded-2xl p-3">
              <div className="flex items-center gap-1 mb-1" style={{ color: stat.color }}>
                {stat.icon}
                <span className="text-xs">{stat.label}</span>
              </div>
              <div className="font-bold text-sm" style={{ color: stat.color }}>
                ₹{(stat.value / 100).toLocaleString('en-IN')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
