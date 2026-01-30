import { api } from './api'
import { normalizeProvider, mapProviderApiToUi } from '../utils/serviceProviders'

export const searchProviders = async (filters = {}) => {
  const data = await api.get('/providers/search', { params: filters })
  const results = Array.isArray(data?.results) ? data.results : []
  return results.map((provider, index) => mapProviderApiToUi(provider, index))
}

export const getProviderById = async (id) => {
  const data = await api.get(`/providers/${id}`)
  return mapProviderApiToUi(data?.provider || {}, 0)
}

export const getLocalProviders = () => {
  const stored = localStorage.getItem('serviceProviders')
  if (!stored) return []
  try {
    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed)) return []
    return parsed.map((provider, index) => normalizeProvider(provider, index))
  } catch (error) {
    return []
  }
}
