import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchAdminStats = createAsyncThunk('admin/stats', async (_, { rejectWithValue }) => {
  try { const res = await api.get('/admin/stats'); return res.data }
  catch (err) { return rejectWithValue(err.response?.data?.message) }
})

export const fetchAdminEvents = createAsyncThunk('admin/events', async (_, { rejectWithValue }) => {
  try { const res = await api.get('/admin/events'); return res.data }
  catch (err) { return rejectWithValue(err.response?.data?.message) }
})

export const createEvent = createAsyncThunk('admin/createEvent', async (data, { rejectWithValue }) => {
  try { const res = await api.post('/admin/events', data); return res.data }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed') }
})

export const updateEvent = createAsyncThunk('admin/updateEvent', async ({ id, data }, { rejectWithValue }) => {
  try { const res = await api.put(`/admin/events/${id}`, data); return res.data }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed') }
})

export const deleteEvent = createAsyncThunk('admin/deleteEvent', async (id, { rejectWithValue }) => {
  try { await api.delete(`/admin/events/${id}`); return id }
  catch (err) { return rejectWithValue(err.response?.data?.message) }
})

export const bulkCreateSeats = createAsyncThunk('admin/bulkSeats', async ({ id, data }, { rejectWithValue }) => {
  try { const res = await api.post(`/admin/events/${id}/seats`, data); return res.data }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed') }
})

export const fetchAdminBookings = createAsyncThunk('admin/bookings', async (params = {}, { rejectWithValue }) => {
  try { const res = await api.get('/admin/bookings', { params }); return res.data }
  catch (err) { return rejectWithValue(err.response?.data?.message) }
})

export const adminCancelBooking = createAsyncThunk('admin/cancelBooking', async ({ id, reason }, { rejectWithValue }) => {
  try { const res = await api.post(`/admin/bookings/${id}/cancel`, { reason }); return res.data }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed') }
})

export const fetchAdminTransactions = createAsyncThunk('admin/transactions', async (_, { rejectWithValue }) => {
  try { const res = await api.get('/admin/transactions'); return res.data }
  catch (err) { return rejectWithValue(err.response?.data?.message) }
})

const adminSlice = createSlice({
  name: 'admin',
  initialState: { stats: null, events: [], bookings: [], transactions: [], loading: false, error: null },
  reducers: { clearError: (state) => { state.error = null } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminStats.fulfilled, (state, a) => { state.stats = a.payload })
      .addCase(fetchAdminEvents.fulfilled, (state, a) => { state.events = a.payload })
      .addCase(createEvent.fulfilled, (state, a) => { state.events.unshift(a.payload) })
      .addCase(updateEvent.fulfilled, (state, a) => {
        const i = state.events.findIndex((e) => e._id === a.payload._id)
        if (i !== -1) state.events[i] = a.payload
      })
      .addCase(deleteEvent.fulfilled, (state, a) => { state.events = state.events.filter((e) => e._id !== a.payload) })
      .addCase(fetchAdminBookings.fulfilled, (state, a) => { state.bookings = a.payload })
      .addCase(adminCancelBooking.fulfilled, (state, a) => {
        const i = state.bookings.findIndex((b) => b._id === a.payload.booking._id)
        if (i !== -1) state.bookings[i] = a.payload.booking
      })
      .addCase(fetchAdminTransactions.fulfilled, (state, a) => { state.transactions = a.payload })
      .addMatcher(
        (action) => action.type.startsWith('admin/') && action.type.endsWith('/pending'),
        (state) => { state.loading = true; state.error = null }
      )
      .addMatcher(
        (action) => action.type.startsWith('admin/') && (action.type.endsWith('/fulfilled') || action.type.endsWith('/rejected')),
        (state) => { state.loading = false }
      )
  },
})

export const { clearError } = adminSlice.actions
export default adminSlice.reducer
