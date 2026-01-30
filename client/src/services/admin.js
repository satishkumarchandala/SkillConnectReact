import { api } from './api'

export const fetchDisputes = async (token) => {
  const data = await api.get('/disputes', { token })
  return data?.disputes || []
}

export const resolveDispute = async ({ token, id, status, resolution }) => {
  const data = await api.patch(`/disputes/${id}/resolve`, {
    token,
    body: { status, resolution }
  })
  return data?.dispute
}

export const suspendProvider = async ({ token, id }) => {
  const data = await api.patch(`/admin/providers/${id}/suspend`, { token })
  return data?.user
}

export const reinstateProvider = async ({ token, id }) => {
  const data = await api.patch(`/admin/providers/${id}/reinstate`, { token })
  return data?.user
}

export const removeReview = async ({ token, id }) => {
  const data = await api.patch(`/admin/reviews/${id}/remove`, { token })
  return data?.review
}
