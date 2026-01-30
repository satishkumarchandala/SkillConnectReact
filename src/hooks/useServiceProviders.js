import { useEffect, useState } from 'react'
import { normalizeProvider, STORAGE_KEY } from '../utils/serviceProviders'

const useServiceProviders = () => {
  const [providers, setProviders] = useState([])

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      setProviders([])
      return
    }
    try {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) {
        setProviders(parsed.map((provider, index) => normalizeProvider(provider, index)))
      } else {
        setProviders([])
      }
    } catch (error) {
      setProviders([])
    }
  }, [])

  return providers
}

export default useServiceProviders
