import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchWallet = createAsyncThunk('wallet/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/wallet')
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const addMoney = createAsyncThunk('wallet/add', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/wallet/add', data)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to add money')
  }
})

const walletSlice = createSlice({
  name: 'wallet',
  initialState: { balance: 0, transactions: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWallet.pending, (state) => { state.loading = true })
      .addCase(fetchWallet.fulfilled, (state, action) => { state.loading = false; state.balance = action.payload.balance; state.transactions = action.payload.transactions })
      .addCase(fetchWallet.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(addMoney.pending, (state) => { state.loading = true })
      .addCase(addMoney.fulfilled, (state, action) => { state.loading = false; state.balance = action.payload.balance; state.transactions = action.payload.transactions })
      .addCase(addMoney.rejected, (state, action) => { state.loading = false; state.error = action.payload })
  },
})

export default walletSlice.reducer
