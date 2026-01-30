import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  fetchProviderAnalytics,
  fetchProviderBookings,
  fetchProviderConversations
} from '../../services/providerDashboard'
import {
  fetchProviderNotifications,
  markProviderNotificationsSeen
} from '../../services/providerNotifications'
import { fetchMessages, sendMessage, createConversation } from '../../services/messaging'
import { confirmBooking, completeBooking } from '../../services/bookings'
import {
  fetchAvailability,
  createAvailabilitySlot,
  deleteAvailabilitySlot
} from '../../services/availability'
import { getAuthToken, setAuthToken } from '../../utils/auth'
import useSocketNotifications from '../../hooks/useSocketNotifications'
import './ProviderDashboard.css'

const ProviderDashboard = () => {
  const [token, setToken] = useState(getAuthToken())
  const [analytics, setAnalytics] = useState(null)
  const [bookings, setBookings] = useState([])
  const [notifications, setNotifications] = useState([])
  const [conversations, setConversations] = useState([])
  const [activeConversationId, setActiveConversationId] = useState('')
  const [messages, setMessages] = useState([])
  const [newConversationId, setNewConversationId] = useState('')
  const [messageDraft, setMessageDraft] = useState('')
  const [availabilitySlots, setAvailabilitySlots] = useState([])
  const [availabilityForm, setAvailabilityForm] = useState({ startAt: '', endAt: '' })
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  const userId = useMemo(() => {
    try {
      const payload = token.split('.')[1]
      if (!payload) return ''
      const decoded = JSON.parse(atob(payload))
      return decoded?.id || ''
    } catch (err) {
      return ''
    }
  }, [token])

  const loadDashboard = useCallback(async () => {
    if (!token.trim() || !userId) return
    setStatus('loading')
    setError('')
    try {
      const [analyticsData, bookingData, notificationData, conversationData, slotsData] = await Promise.all([
        fetchProviderAnalytics(token),
        fetchProviderBookings(token),
        fetchProviderNotifications(token),
        fetchProviderConversations(token),
        fetchAvailability({ token, providerId: userId })
      ])
      setAnalytics(analyticsData)
      setBookings(bookingData)
      setNotifications(notificationData)
      setConversations(conversationData)
      setAvailabilitySlots(slotsData)
      setStatus('ready')
    } catch (err) {
      setError(err.message || 'Failed to load provider dashboard')
      setStatus('error')
    }
  }, [token, userId])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  useSocketNotifications({
    userId,
    onNotification: (payload) =>
      setNotifications((prev) => [payload, ...prev]),
    onMessage: () => {
      loadDashboard()
      if (activeConversationId) {
        loadMessages(activeConversationId)
      }
    }
  })

  const loadMessages = async (conversationId) => {
    if (!token.trim() || !conversationId) return
    try {
      const data = await fetchMessages({ token, conversationId })
      setMessages(data)
    } catch (err) {
      setError(err.message || 'Failed to load messages')
    }
  }

  const handleSelectConversation = (conversationId) => {
    setActiveConversationId(conversationId)
    loadMessages(conversationId)
  }

  const handleSendMessage = async (event) => {
    event.preventDefault()
    if (!messageDraft.trim() || !activeConversationId) return
    try {
      const message = await sendMessage({
        token,
        conversationId: activeConversationId,
        body: messageDraft.trim()
      })
      setMessages((prev) => [...prev, message])
      setMessageDraft('')
    } catch (err) {
      setError(err.message || 'Failed to send message')
    }
  }

  const handleCreateConversation = async (event) => {
    event.preventDefault()
    if (!newConversationId.trim()) return
    try {
      const conversation = await createConversation({
        token,
        participantId: newConversationId.trim()
      })
      setConversations((prev) => [conversation, ...prev])
      setNewConversationId('')
    } catch (err) {
      setError(err.message || 'Failed to create conversation')
    }
  }

  const handleCreateSlot = async (event) => {
    event.preventDefault()
    if (!availabilityForm.startAt || !availabilityForm.endAt) return
    try {
      const startAt = new Date(availabilityForm.startAt).toISOString()
      const endAt = new Date(availabilityForm.endAt).toISOString()
      await createAvailabilitySlot({
        token,
        providerId: userId,
        startAt,
        endAt
      })
      setAvailabilityForm({ startAt: '', endAt: '' })
      const slotsData = await fetchAvailability({ token, providerId: userId })
      setAvailabilitySlots(slotsData)
    } catch (err) {
      setError(err.message || 'Failed to create availability slot')
    }
  }

  const handleDeleteSlot = async (slotId) => {
    try {
      await deleteAvailabilitySlot({ token, providerId: userId, slotId })
      setAvailabilitySlots((prev) => prev.filter((slot) => slot._id !== slotId))
    } catch (err) {
      setError(err.message || 'Failed to delete slot')
    }
  }

  const markAllSeen = async () => {
    if (!token.trim()) return
    await markProviderNotificationsSeen({ token, markAll: true })
    setNotifications((prev) => prev.map((note) => ({ ...note, isRead: true })))
  }

  const handleConfirmBooking = async (bookingId) => {
    try {
      await confirmBooking({ token, bookingId })
      await loadDashboard()
    } catch (err) {
      setError(err.message || 'Failed to confirm booking')
    }
  }

  const handleCompleteBooking = async (bookingId) => {
    try {
      await completeBooking({ token, bookingId })
      await loadDashboard()
    } catch (err) {
      setError(err.message || 'Failed to complete booking')
    }
  }

  return (
    <div className="provider-dashboard">
      <header className="provider-header">
        <h1>Provider Dashboard</h1>
        <p>Track bookings, revenue, and response metrics.</p>
      </header>

      <section className="provider-section">
        <h2>Provider Token</h2>
        <input
          className="provider-input"
          type="password"
          placeholder="Provider JWT"
          value={token}
          onChange={(event) => {
            setToken(event.target.value)
            setAuthToken(event.target.value)
          }}
        />
        <button type="button" onClick={loadDashboard} disabled={!token.trim()}>
          Refresh Dashboard
        </button>
        {error ? <p className="provider-error">{error}</p> : null}
      </section>

      <section className="provider-section">
        <h2>Analytics</h2>
        {status === 'loading' ? <p>Loading analytics...</p> : null}
        {analytics ? (
          <div className="provider-metrics">
            <div className="provider-metric">
              <span>Total Earnings</span>
              <strong>${analytics.totalEarnings?.toFixed(2) || '0.00'}</strong>
            </div>
            <div className="provider-metric">
              <span>Response Time (avg)</span>
              <strong>{analytics.responseTimeAvgMinutes || 0} min</strong>
            </div>
            <div className="provider-metric">
              <span>Conversion Rate</span>
              <strong>{analytics.conversionRate || 0}</strong>
            </div>
          </div>
        ) : (
          <p>No analytics available yet.</p>
        )}
      </section>

      <section className="provider-section">
        <h2>Recent Bookings</h2>
        {!bookings.length ? (
          <p>No bookings found.</p>
        ) : (
          <div className="provider-table">
            <div className="provider-row provider-header-row">
              <span>ID</span>
              <span>Status</span>
              <span>Start</span>
              <span>Price</span>
              <span>Actions</span>
            </div>
            {bookings.map((booking) => (
              <div key={booking._id} className="provider-row">
                <span>{booking._id}</span>
                <span>{booking.status}</span>
                <span>{new Date(booking.startAt).toLocaleString()}</span>
                <span>${booking.price}</span>
                <div className="provider-row-actions">
                  {booking.status === 'requested' ? (
                    <button
                      type="button"
                      onClick={() => handleConfirmBooking(booking._id)}
                    >
                      Confirm
                    </button>
                  ) : null}
                  {booking.status === 'confirmed' ? (
                    <button
                      type="button"
                      onClick={() => handleCompleteBooking(booking._id)}
                    >
                      Complete
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="provider-section">
        <div className="provider-notifications-header">
          <h2>Notifications</h2>
          <button type="button" onClick={markAllSeen} disabled={!notifications.length}>
            Mark all as read
          </button>
        </div>
        {!notifications.length ? (
          <p>No notifications.</p>
        ) : (
          <ul className="provider-list">
            {notifications.map((note) => (
              <li key={note._id} className={note.isRead ? 'read' : ''}>
                <strong>{note.title || 'Notification'}</strong> — {note.body}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="provider-section">
        <h2>Conversations</h2>
        <form className="provider-form" onSubmit={handleCreateConversation}>
          <input
            className="provider-input"
            type="text"
            placeholder="Customer ID to message"
            value={newConversationId}
            onChange={(event) => setNewConversationId(event.target.value)}
          />
          <button type="submit" disabled={!newConversationId.trim()}>
            Start Conversation
          </button>
        </form>
        {!conversations.length ? (
          <p>No conversations.</p>
        ) : (
          <div className="provider-messaging">
            <ul className="provider-list">
              {conversations.map((conversation) => (
                <li
                  key={conversation._id}
                  className={
                    conversation._id === activeConversationId ? 'active' : ''
                  }
                >
                  <button
                    type="button"
                    onClick={() => handleSelectConversation(conversation._id)}
                  >
                    <strong>{conversation._id}</strong>
                    <span>
                      {conversation.lastMessageAt
                        ? new Date(conversation.lastMessageAt).toLocaleString()
                        : 'No messages yet'}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="provider-messages">
              {activeConversationId ? (
                <>
                  <div className="provider-messages-list">
                    {!messages.length ? (
                      <p>No messages yet.</p>
                    ) : (
                      messages.map((message) => (
                        <div key={message._id} className="provider-message">
                          <span>{message.body}</span>
                          <small>
                            {new Date(message.createdAt).toLocaleString()}
                          </small>
                        </div>
                      ))
                    )}
                  </div>
                  <form className="provider-message-form" onSubmit={handleSendMessage}>
                    <input
                      className="provider-input"
                      type="text"
                      placeholder="Type a message"
                      value={messageDraft}
                      onChange={(event) => setMessageDraft(event.target.value)}
                    />
                    <button type="submit" disabled={!messageDraft.trim()}>
                      Send
                    </button>
                  </form>
                </>
              ) : (
                <p>Select a conversation to view messages.</p>
              )}
            </div>
          </div>
        )}
      </section>

      <section className="provider-section">
        <h2>Availability</h2>
        <form className="provider-form" onSubmit={handleCreateSlot}>
          <input
            className="provider-input"
            type="datetime-local"
            value={availabilityForm.startAt}
            onChange={(event) =>
              setAvailabilityForm((prev) => ({
                ...prev,
                startAt: event.target.value
              }))
            }
          />
          <input
            className="provider-input"
            type="datetime-local"
            value={availabilityForm.endAt}
            onChange={(event) =>
              setAvailabilityForm((prev) => ({
                ...prev,
                endAt: event.target.value
              }))
            }
          />
          <button type="submit" disabled={!availabilityForm.startAt || !availabilityForm.endAt}>
            Add Slot
          </button>
        </form>

        {!availabilitySlots.length ? (
          <p>No availability slots set.</p>
        ) : (
          <div className="provider-table">
            <div className="provider-row provider-header-row">
              <span>ID</span>
              <span>Start</span>
              <span>End</span>
              <span>Status</span>
              <span>Actions</span>
            </div>
            {availabilitySlots.map((slot) => (
              <div key={slot._id} className="provider-row">
                <span>{slot._id}</span>
                <span>{new Date(slot.startAt).toLocaleString()}</span>
                <span>{new Date(slot.endAt).toLocaleString()}</span>
                <span>{slot.isBooked ? 'Booked' : 'Open'}</span>
                <div className="provider-row-actions">
                  <button type="button" onClick={() => handleDeleteSlot(slot._id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default ProviderDashboard
