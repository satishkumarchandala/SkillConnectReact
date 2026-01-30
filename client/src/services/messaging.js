import { api } from './api'

export const fetchMessages = async ({ token, conversationId }) => {
  const data = await api.get(`/conversations/${conversationId}/messages`, { token })
  return data?.messages || []
}

export const sendMessage = async ({ token, conversationId, body }) => {
  const data = await api.post(`/conversations/${conversationId}/messages`, {
    token,
    body: { body }
  })
  return data?.message
}

export const createConversation = async ({ token, participantId }) => {
  const data = await api.post('/conversations', {
    token,
    body: { participantId }
  })
  return data?.conversation
}
