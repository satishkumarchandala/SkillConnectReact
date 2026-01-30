import { api } from './api'

export const fetchCustomerBookings = async (token) => {
  const data = await api.get('/bookings', { token })
  return data?.bookings || []
}

export const fetchNotifications = async (token) => {
  const data = await api.get('/notifications', { token })
  return data?.notifications || []
}

export const fetchConversations = async (token) => {
  const data = await api.get('/conversations', { token })
  return data?.conversations || []
}

export const markNotificationsSeen = async ({ token, ids, markAll }) => {
  await api.post('/notifications/seen', {
    token,
    body: { ids, markAll }
  })
}
