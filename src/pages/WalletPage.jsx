import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchWallet, addMoney } from '../store/slices/walletSlice'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'
import Navbar from '../components/layout/Navbar'
import BalanceCard from '../components/wallet/BalanceCard'
import AddMoneyForm from '../components/wallet/AddMoneyForm'
import TransactionList from '../components/wallet/TransactionList'

export default function WalletPage() {
  const dispatch = useDispatch()
  const { balance, transactions, loading } = useSelector((s) => s.wallet)

  useEffect(() => { dispatch(fetchWallet()) }, [dispatch])

  const handleAdd = async (amount) => {
    if (!amount || amount <= 0) { toast.error('Enter valid amount'); return }
    if (amount > 100000) { toast.error('Max ₹1,00,000 per transaction'); return }
    const result = await dispatch(addMoney({ amount, idempotencyKey: uuidv4() }))
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success(`₹${amount.toLocaleString()} added to wallet!`)
    } else {
      toast.error(result.payload || 'Failed to add money')
    }
  }

  return (
    <div style={{ background: 'var(--taski-dark)', minHeight: '100vh' }}>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
        <h1 className="text-3xl font-bold mb-2">My Wallet</h1>
        <p className="text-white/40 mb-8">Manage your travel funds</p>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <BalanceCard balance={balance} transactions={transactions} />
          <AddMoneyForm onAdd={handleAdd} loading={loading} />
        </div>

        <TransactionList transactions={transactions} />
      </div>
    </div>
  )
}
