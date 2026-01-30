const TOKEN_KEY = 'skillconnect_token'
const USER_KEY = 'skillconnect_user'

export const getAuthToken = () => localStorage.getItem(TOKEN_KEY) || ''

export const setAuthToken = (token) => {
  if (!token) return
  localStorage.setItem(TOKEN_KEY, token)
}

export const clearAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export const setAuthUser = (user) => {
  if (!user) return
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export const getAuthUser = () => {
  const stored = localStorage.getItem(USER_KEY)
  if (!stored) return null
  try {
    return JSON.parse(stored)
  } catch (error) {
    return null
  }
}
