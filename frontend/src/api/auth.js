import axios from 'axios'
import client from './client'

const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

export const fetchLogin = (email, password) =>
  client.post('/auth/login', { email, password }).then((r) => r.data)

export const fetchRefresh = () =>
  axios.post(`${BASE}/auth/refresh`, {}, { withCredentials: true }).then((r) => r.data)

export const fetchLogout = () =>
  client.post('/auth/logout').then((r) => r.data)
