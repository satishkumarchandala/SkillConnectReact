import { api } from './api'

export const submitReview = async ({ token, bookingId, rating, comment }) => {
  const data = await api.post('/reviews', {
    token,
    body: { bookingId, rating, comment }
  })
  return data?.review
}

export const createDispute = async ({ token, bookingId, reason }) => {
  const data = await api.post('/disputes', {
    token,
    body: { bookingId, reason }
  })
  return data?.dispute
}
