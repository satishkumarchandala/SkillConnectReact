import { api } from './api'

export const createPaymentIntent = async ({ token, bookingId }) => {
  const data = await api.post('/payments/intent', {
    token,
    body: { bookingId }
  })
  return data?.payment
}
