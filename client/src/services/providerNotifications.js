import { api } from './api'

export const fetchProviderNotifications = async (token) => {
  const data = await api.get('/notifications', { token })
  return data?.notifications || []
}

export const markProviderNotificationsSeen = async ({ token, ids, markAll }) => {
  await api.post('/notifications/seen', {
    token,
    body: { ids, markAll }
  })
}
