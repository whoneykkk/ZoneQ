import axios from 'axios'
import { useAuthStore } from '../stores/authStore'

const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

const client = axios.create({
  baseURL: BASE,
  withCredentials: true,
})

let isRefreshing = false
let failedQueue = []

function processQueue(error, token = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve(token)
  })
  failedQueue = []
}

client.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState()
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`
  return config
})

client.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error)
    }
    original._retry = true

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`
        return client(original)
      })
    }

    isRefreshing = true
    try {
      const { data } = await axios.post(`${BASE}/auth/refresh`, {}, { withCredentials: true })
      useAuthStore.getState().setAuth(data.accessToken, data.user)
      processQueue(null, data.accessToken)
      original.headers.Authorization = `Bearer ${data.accessToken}`
      return client(original)
    } catch (err) {
      processQueue(err, null)
      useAuthStore.getState().clearAuth()
      window.location.href = '/login'
      return Promise.reject(err)
    } finally {
      isRefreshing = false
    }
  }
)

export default client
