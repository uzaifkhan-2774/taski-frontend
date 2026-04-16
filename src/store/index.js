import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import walletReducer from './slices/walletSlice'
import eventsReducer from './slices/eventsSlice'
import bookingsReducer from './slices/bookingsSlice'
import adminReducer from './slices/adminSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    wallet: walletReducer,
    events: eventsReducer,
    bookings: bookingsReducer,
    admin: adminReducer,
  },
})
