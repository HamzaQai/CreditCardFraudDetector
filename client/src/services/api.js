import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authService = {
  signup: async (data) => {
    const response = await api.post('/auth/signup', data)
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
    }
    return response.data
  },

  login: async (data) => {
    const response = await api.post('/auth/login', data)
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
    }
    return response.data
  },

  logout: () => {
    localStorage.removeItem('token')
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me')
    return response.data.user
  },
}

export const supplementsService = {
  getAll: async (params) => {
    const response = await api.get('/supplements', { params })
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/supplements/${id}`)
    return response.data
  },
}

export const userSupplementsService = {
  getAll: async () => {
    const response = await api.get('/user/supplements')
    return response.data
  },

  create: async (data) => {
    const response = await api.post('/user/supplements', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await api.patch(`/user/supplements/${id}`, data)
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(`/user/supplements/${id}`)
    return response.data
  },

  logIntake: async (id, data) => {
    const response = await api.post(`/user/supplements/${id}/log`, data)
    return response.data
  },
}

export const dashboardService = {
  getToday: async () => {
    const response = await api.get('/dashboard/today')
    return response.data
  },

  getStats: async (period = 'week') => {
    const response = await api.get('/dashboard/stats', { params: { period } })
    return response.data
  },
}

export default api
