import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchMyBookings = createAsyncThunk('bookings/fetchMy', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/bookings/my')
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const cancelBooking = createAsyncThunk('bookings/cancel', async (id, { rejectWithValue }) => {
  try {
    const res = await api.post(`/bookings/${id}/cancel`)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Cancel failed')
  }
})

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyBookings.pending, (state) => { state.loading = true })
      .addCase(fetchMyBookings.fulfilled, (state, action) => { state.loading = false; state.list = action.payload })
      .addCase(fetchMyBookings.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        const idx = state.list.findIndex((b) => b._id === action.payload.booking._id)
        if (idx !== -1) state.list[idx] = action.payload.booking
      })
  },
})

export default bookingsSlice.reducer
