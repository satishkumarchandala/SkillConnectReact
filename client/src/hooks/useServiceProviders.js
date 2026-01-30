import { useEffect, useState } from 'react'
import { getLocalProviders, searchProviders } from '../services/providers'

const useServiceProviders = (filters = null) => {
  const [providers, setProviders] = useState([])
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true
    const localProviders = getLocalProviders()
    if (localProviders.length) {
      setProviders(localProviders)
    }

    const fetchProviders = async () => {
      try {
        setStatus('loading')
        setError('')
        const results = await searchProviders(filters || undefined)
        if (isMounted && results.length) {
          setProviders(results)
          setStatus('ready')
          return
        }
        setStatus('empty')
      } catch (error) {
        if (isMounted && !localProviders.length) {
          setProviders([])
          setStatus('error')
          setError(error.message || 'Failed to load providers')
        }
      }
    }

    fetchProviders()
    return () => {
      isMounted = false
    }
  }, [filters])

  return { providers, status, error }
}

export default useServiceProviders
