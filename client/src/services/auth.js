import { api } from './api'

export const login = async ({ email, password }) => {
  const data = await api.post('/auth/login', {
    body: { email, password }
  })
  return data
}

export const register = async ({ name, email, password, phone, role }) => {
  const data = await api.post('/auth/register', {
    body: { name, email, password, phone, role }
  })
  return data
}
