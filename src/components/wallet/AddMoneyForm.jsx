import { useState } from 'react'
import { Plus, IndianRupee } from 'lucide-react'
import Spinner from '../ui/Spinner'
import InputField from '../ui/InputField'

const QUICK_AMOUNTS = [500, 1000, 2000, 5000]

export default function AddMoneyForm({ onAdd, loading }) {
  const [amount, setAmount] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const val = parseFloat(amount)
    if (!val || val <= 0) return
    onAdd(val)
    setAmount('')
  }

  const numAmount = parseFloat(amount) || 0

  return (
    <div className="glass rounded-3xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <Plus size={18} className="text-yellow-400" />
        <h3 className="font-bold">Add Money</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount input */}
        <div>
          <label className="text-xs text-white/40 mb-2 block">Amount (₹)</label>
          <InputField
            type="number"
            placeholder="Enter amount e.g. 500"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            icon={<IndianRupee size={15} />}
            min="1"
            max="100000"
          />
          {numAmount > 0 && (
            <p className="text-xs text-white/30 mt-1.5 ml-1">
              ₹{numAmount.toLocaleString('en-IN')} wallet Balance
            </p>
          )}
        </div>

        {/* Quick select */}
        <div className="grid grid-cols-2 gap-2">
          {QUICK_AMOUNTS.map((a) => (
            <button
              type="button" key={a}
              onClick={() => setAmount(String(a))}
              className="text-sm py-2.5 px-3 rounded-xl transition-all font-medium"
              style={{
                background: numAmount === a ? 'rgba(245,166,35,0.2)' : 'rgba(255,255,255,0.05)',
                color: numAmount === a ? '#F5A623' : 'rgba(255,255,255,0.5)',
                border: `1px solid ${numAmount === a ? 'rgba(245,166,35,0.3)' : 'rgba(255,255,255,0.07)'}`,
              }}
            >
              ₹{a.toLocaleString('en-IN')}
            </button>
          ))}
        </div>

        <button
          type="submit"
          className="btn-gold w-full flex items-center justify-center gap-2"
          disabled={loading || !amount || numAmount <= 0}
        >
          {loading ? (
            <><Spinner color="border-black/30" /> Adding...</>
          ) : numAmount > 0 ? (
            `Add ₹${numAmount.toLocaleString('en-IN')}`
          ) : (
            'Add Money'
          )}
        </button>
      </form>

      
     
    </div>
  )
}
