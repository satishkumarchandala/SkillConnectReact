import { api } from './api'

export const createBooking = async ({ token, providerId, startAt, endAt, price, currency }) => {
  const data = await api.post('/bookings', {
    token,
    body: { providerId, startAt, endAt, price, currency }
  })
  return data?.booking
}

export const confirmBooking = async ({ token, bookingId }) => {
  const data = await api.patch(`/bookings/${bookingId}/confirm`, { token })
  return data?.booking
}

export const completeBooking = async ({ token, bookingId }) => {
  const data = await api.patch(`/bookings/${bookingId}/complete`, { token })
  return data?.booking
}

export const payBooking = async ({ token, bookingId }) => {
  const data = await api.patch(`/bookings/${bookingId}/pay`, { token })
  return data?.booking
}
