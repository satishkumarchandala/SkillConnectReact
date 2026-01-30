import { useEffect } from 'react'
import { getSocket } from '../services/socket'

const useSocketNotifications = ({ userId, onNotification, onMessage }) => {
  useEffect(() => {
    if (!userId) return undefined

    const socket = getSocket()
    socket.connect()
    socket.emit('join', userId)

    const handleNotification = (payload) => {
      if (onNotification) onNotification(payload)
    }

    const handleMessage = (payload) => {
      if (onMessage) onMessage(payload)
    }

    socket.on('notification:new', handleNotification)
    socket.on('message:new', handleMessage)

    return () => {
      socket.off('notification:new', handleNotification)
      socket.off('message:new', handleMessage)
      socket.disconnect()
    }
  }, [onMessage, onNotification, userId])
}

export default useSocketNotifications
