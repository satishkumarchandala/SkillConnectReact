import { api } from './api'

export const fetchProviderAnalytics = async (token) => {
  const data = await api.get('/analytics/overview', { token })
  return data?.analytics
}

export const fetchProviderBookings = async (token) => {
  const data = await api.get('/bookings', { token })
  return data?.bookings || []
}

export const fetchProviderConversations = async (token) => {
  const data = await api.get('/conversations', { token })
  return data?.conversations || []
}
