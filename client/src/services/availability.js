import { api } from './api'

export const fetchAvailability = async ({ token, providerId }) => {
  const data = await api.get(`/providers/${providerId}/availability`, { token })
  return data?.slots || []
}

export const fetchPublicAvailability = async (providerId) => {
  const data = await api.get(`/providers/${providerId}/availability/public`)
  return data?.slots || []
}

export const createAvailabilitySlot = async ({ token, providerId, startAt, endAt }) => {
  const data = await api.post(`/providers/${providerId}/availability`, {
    token,
    body: { startAt, endAt }
  })
  return data?.slot
}

export const deleteAvailabilitySlot = async ({ token, providerId, slotId }) => {
  await api.delete(`/providers/${providerId}/availability/${slotId}`, { token })
}
