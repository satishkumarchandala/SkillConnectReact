import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  fetchCustomerBookings,
  fetchNotifications,
  fetchConversations,
  markNotificationsSeen
} from '../../services/customerDashboard'
import { fetchMessages, sendMessage, createConversation } from '../../services/messaging'
import { payBooking } from '../../services/bookings'
import { submitReview, createDispute } from '../../services/reviews'
import { createPaymentIntent } from '../../services/payments'
import { getAuthToken, setAuthToken } from '../../utils/auth'
import useSocketNotifications from '../../hooks/useSocketNotifications'
import './CustomerDashboard.css'

const CustomerDashboard = () => {
  const [token, setToken] = useState(getAuthToken())
  const [bookings, setBookings] = useState([])
  const [notifications, setNotifications] = useState([])
  const [conversations, setConversations] = useState([])
  const [activeConversationId, setActiveConversationId] = useState('')
  const [messages, setMessages] = useState([])
  const [messageDraft, setMessageDraft] = useState('')
  const [newConversationId, setNewConversationId] = useState('')
  const [paymentStatus, setPaymentStatus] = useState({})
  const [reviewForm, setReviewForm] = useState({ bookingId: '', rating: 5, comment: '' })
  const [disputeForm, setDisputeForm] = useState({ bookingId: '', reason: '' })
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
    if (!token.trim()) return
    setStatus('loading')
    setError('')
    try {
      const [bookingData, notificationData, conversationData] = await Promise.all([
        fetchCustomerBookings(token),
        fetchNotifications(token),
        fetchConversations(token)
      ])
      setBookings(bookingData)
      setNotifications(notificationData)
      setConversations(conversationData)
      setStatus('ready')
    } catch (err) {
      setError(err.message || 'Failed to load customer dashboard')
      setStatus('error')
    }
  }, [token])

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

  const handlePayBooking = async (bookingId) => {
    try {
      await payBooking({ token, bookingId })
      await loadDashboard()
      setPaymentStatus((prev) => ({ ...prev, [bookingId]: 'paid' }))
    } catch (err) {
      setError(err.message || 'Failed to pay for booking')
    }
  }

  const handleAuthorizePayment = async (bookingId) => {
    try {
      const payment = await createPaymentIntent({ token, bookingId })
      setPaymentStatus((prev) => ({
        ...prev,
        [bookingId]: payment?.status || 'authorized'
      }))
    } catch (err) {
      setError(err.message || 'Failed to authorize payment')
    }
  }

  const handleSubmitReview = async (event) => {
    event.preventDefault()
    try {
      await submitReview({
        token,
        bookingId: reviewForm.bookingId,
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment
      })
      setReviewForm({ bookingId: '', rating: 5, comment: '' })
    } catch (err) {
      setError(err.message || 'Failed to submit review')
    }
  }

  const handleCreateDispute = async (event) => {
    event.preventDefault()
    try {
      await createDispute({
        token,
        bookingId: disputeForm.bookingId,
        reason: disputeForm.reason
      })
      setDisputeForm({ bookingId: '', reason: '' })
    } catch (err) {
      setError(err.message || 'Failed to create dispute')
    }
  }

  const markAllSeen = async () => {
    if (!token.trim()) return
    await markNotificationsSeen({ token, markAll: true })
    setNotifications((prev) => prev.map((note) => ({ ...note, isRead: true })))
  }

  return (
    <div className="customer-dashboard">
      <header className="customer-header">
        <h1>Customer Dashboard</h1>
        <p>Track bookings, messages, and notifications.</p>
      </header>

      <section className="customer-section">
        <h2>Customer Token</h2>
        <input
          className="customer-input"
          type="password"
          placeholder="Customer JWT"
          value={token}
          onChange={(event) => {
            setToken(event.target.value)
            setAuthToken(event.target.value)
          }}
        />
        <button type="button" onClick={loadDashboard} disabled={!token.trim()}>
          Refresh Dashboard
        </button>
        {error ? <p className="customer-error">{error}</p> : null}
      </section>

      <section className="customer-section">
        <h2>Bookings</h2>
        {status === 'loading' ? <p>Loading bookings...</p> : null}
        {!bookings.length && status !== 'loading' ? (
          <p>No bookings found.</p>
        ) : (
          <div className="customer-table">
            <div className="customer-row customer-header-row">
              <span>ID</span>
              <span>Status</span>
              <span>Start</span>
              <span>Price</span>
              <span>Payment</span>
              <span>Actions</span>
            </div>
            {bookings.map((booking) => (
              <div key={booking._id} className="customer-row">
                <span>{booking._id}</span>
                <span>{booking.status}</span>
                <span>{new Date(booking.startAt).toLocaleString()}</span>
                <span>${booking.price}</span>
                <span>{paymentStatus[booking._id] || 'n/a'}</span>
                <div className="customer-row-actions">
                  {booking.status === 'confirmed' ? (
                    <button
                      type="button"
                      onClick={() => handleAuthorizePayment(booking._id)}
                    >
                      Authorize
                    </button>
                  ) : null}
                  {booking.status === 'completed' ? (
                    <button
                      type="button"
                      onClick={() => handlePayBooking(booking._id)}
                    >
                      Pay
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="customer-section">
        <div className="customer-notifications-header">
          <h2>Notifications</h2>
          <button type="button" onClick={markAllSeen} disabled={!notifications.length}>
            Mark all as read
          </button>
        </div>
        {!notifications.length ? (
          <p>No notifications.</p>
        ) : (
          <ul className="customer-list">
            {notifications.map((note) => (
              <li key={note._id} className={note.isRead ? 'read' : ''}>
                <strong>{note.title || 'Notification'}</strong> — {note.body}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="customer-section">
        <h2>Conversations</h2>
        <form className="customer-form" onSubmit={handleCreateConversation}>
          <input
            className="customer-input"
            type="text"
            placeholder="Provider ID to message"
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
          <div className="customer-messaging">
            <ul className="customer-list">
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
            <div className="customer-messages">
              {activeConversationId ? (
                <>
                  <div className="customer-messages-list">
                    {!messages.length ? (
                      <p>No messages yet.</p>
                    ) : (
                      messages.map((message) => (
                        <div key={message._id} className="customer-message">
                          <span>{message.body}</span>
                          <small>
                            {new Date(message.createdAt).toLocaleString()}
                          </small>
                        </div>
                      ))
                    )}
                  </div>
                  <form className="customer-message-form" onSubmit={handleSendMessage}>
                    <input
                      className="customer-input"
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

      <section className="customer-section">
        <h2>Leave a Review</h2>
        <form className="customer-form" onSubmit={handleSubmitReview}>
          <input
            className="customer-input"
            type="text"
            placeholder="Booking ID"
            value={reviewForm.bookingId}
            onChange={(event) =>
              setReviewForm((prev) => ({ ...prev, bookingId: event.target.value }))
            }
          />
          <select
            className="customer-input"
            value={reviewForm.rating}
            onChange={(event) =>
              setReviewForm((prev) => ({ ...prev, rating: event.target.value }))
            }
          >
            {[5, 4, 3, 2, 1].map((value) => (
              <option key={value} value={value}>
                {value} Stars
              </option>
            ))}
          </select>
          <textarea
            className="customer-input"
            placeholder="Review comment"
            value={reviewForm.comment}
            onChange={(event) =>
              setReviewForm((prev) => ({ ...prev, comment: event.target.value }))
            }
          />
          <button type="submit" disabled={!reviewForm.bookingId.trim()}>
            Submit Review
          </button>
        </form>
      </section>

      <section className="customer-section">
        <h2>Report a Dispute</h2>
        <form className="customer-form" onSubmit={handleCreateDispute}>
          <input
            className="customer-input"
            type="text"
            placeholder="Booking ID"
            value={disputeForm.bookingId}
            onChange={(event) =>
              setDisputeForm((prev) => ({ ...prev, bookingId: event.target.value }))
            }
          />
          <textarea
            className="customer-input"
            placeholder="Describe the issue"
            value={disputeForm.reason}
            onChange={(event) =>
              setDisputeForm((prev) => ({ ...prev, reason: event.target.value }))
            }
          />
          <button type="submit" disabled={!disputeForm.bookingId.trim()}>
            Submit Dispute
          </button>
        </form>
      </section>
    </div>
  )
}

export default CustomerDashboard
