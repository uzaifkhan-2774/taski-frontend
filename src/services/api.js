import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://taski-backend-flbook.onrender.com/api'
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const url = err.config?.url || ''

    const isAuthRoute = url.includes('/auth/me') || 
                        url.includes('/auth/login') || 
                        url.includes('/me')
    if (err.response?.status === 401 && !isAuthRoute) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
