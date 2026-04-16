import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchEvents = createAsyncThunk('events/fetch', async (params = {}, { rejectWithValue }) => {
  try {
    const res = await api.get('/events', { params })
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const fetchEvent = createAsyncThunk('events/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/events/${id}`)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const reserveSeats = createAsyncThunk('events/reserve', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/bookings/reserve', data)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to reserve seats')
  }
})

export const confirmBooking = createAsyncThunk('events/confirm', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/bookings/confirm', data)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Booking failed')
  }
})

const eventsSlice = createSlice({
  name: 'events',
  initialState: { list: [], current: null, loading: false, error: null, reservation: null, booking: null },
  reducers: {
    clearReservation: (state) => { state.reservation = null },
    clearBooking: (state) => { state.booking = null },
    clearError: (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => { state.loading = true })
      .addCase(fetchEvents.fulfilled, (state, action) => { state.loading = false; state.list = action.payload })
      .addCase(fetchEvents.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(fetchEvent.pending, (state) => { state.loading = true })
      .addCase(fetchEvent.fulfilled, (state, action) => { state.loading = false; state.current = action.payload })
      .addCase(fetchEvent.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(reserveSeats.fulfilled, (state, action) => { state.reservation = action.payload })
      .addCase(reserveSeats.rejected, (state, action) => { state.error = action.payload })
      .addCase(confirmBooking.fulfilled, (state, action) => { state.booking = action.payload; state.reservation = null })
      .addCase(confirmBooking.rejected, (state, action) => { state.error = action.payload })
  },
})

export const { clearReservation, clearBooking, clearError } = eventsSlice.actions
export default eventsSlice.reducer
