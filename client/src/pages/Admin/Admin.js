import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  fetchDisputes,
  resolveDispute,
  suspendProvider,
  reinstateProvider,
  removeReview
} from '../../services/admin'
import { getAuthToken, setAuthToken } from '../../utils/auth'
import './Admin.css'

const Admin = () => {
  const [token, setToken] = useState(getAuthToken())
  const [disputes, setDisputes] = useState([])
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [resolveForm, setResolveForm] = useState({
    id: '',
    status: 'under_review',
    resolution: ''
  })
  const [providerAction, setProviderAction] = useState({ id: '' })
  const [reviewAction, setReviewAction] = useState({ id: '' })

  const canFetch = useMemo(() => token.trim().length > 0, [token])

  const loadDisputes = useCallback(async () => {
    if (!canFetch) return
    setStatus('loading')
    setError('')
    try {
      const results = await fetchDisputes(token)
      setDisputes(results)
      setStatus('ready')
    } catch (err) {
      setError(err.message || 'Failed to load disputes')
      setStatus('error')
    }
  }, [canFetch, token])

  useEffect(() => {
    loadDisputes()
  }, [loadDisputes])

  const handleResolve = async (event) => {
    event.preventDefault()
    setError('')
    try {
      await resolveDispute({
        token,
        id: resolveForm.id,
        status: resolveForm.status,
        resolution: resolveForm.resolution
      })
      await loadDisputes()
      setResolveForm({ id: '', status: 'under_review', resolution: '' })
    } catch (err) {
      setError(err.message || 'Failed to resolve dispute')
    }
  }

  const handleSuspend = async () => {
    setError('')
    try {
      await suspendProvider({ token, id: providerAction.id })
      setProviderAction({ id: '' })
    } catch (err) {
      setError(err.message || 'Failed to suspend provider')
    }
  }

  const handleReinstate = async () => {
    setError('')
    try {
      await reinstateProvider({ token, id: providerAction.id })
      setProviderAction({ id: '' })
    } catch (err) {
      setError(err.message || 'Failed to reinstate provider')
    }
  }

  const handleRemoveReview = async () => {
    setError('')
    try {
      await removeReview({ token, id: reviewAction.id })
      setReviewAction({ id: '' })
    } catch (err) {
      setError(err.message || 'Failed to remove review')
    }
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1>Admin Moderation</h1>
        <p>Review disputes, manage providers, and moderate reviews.</p>
      </header>

      <section className="admin-section">
        <h2>Admin Token</h2>
        <p className="admin-hint">Paste an admin JWT to enable API actions.</p>
        <input
          className="admin-input"
          type="password"
          placeholder="Admin JWT"
          value={token}
          onChange={(event) => {
            setToken(event.target.value)
            setAuthToken(event.target.value)
          }}
        />
        <button type="button" onClick={loadDisputes} disabled={!canFetch}>
          Refresh Disputes
        </button>
        {error ? <p className="admin-error">{error}</p> : null}
      </section>

      <section className="admin-section">
        <h2>Disputes</h2>
        {status === 'loading' ? <p>Loading disputes...</p> : null}
        {!disputes.length && status !== 'loading' ? (
          <p>No disputes found.</p>
        ) : (
          <div className="admin-table">
            <div className="admin-table-row admin-table-header">
              <span>ID</span>
              <span>Status</span>
              <span>Reason</span>
              <span>Raised By</span>
            </div>
            {disputes.map((dispute) => (
              <div key={dispute._id} className="admin-table-row">
                <span>{dispute._id}</span>
                <span>{dispute.status}</span>
                <span>{dispute.reason}</span>
                <span>{dispute.raisedBy}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="admin-section">
        <h2>Resolve Dispute</h2>
        <form className="admin-form" onSubmit={handleResolve}>
          <input
            className="admin-input"
            type="text"
            placeholder="Dispute ID"
            value={resolveForm.id}
            onChange={(event) =>
              setResolveForm((prev) => ({ ...prev, id: event.target.value }))
            }
          />
          <select
            className="admin-input"
            value={resolveForm.status}
            onChange={(event) =>
              setResolveForm((prev) => ({
                ...prev,
                status: event.target.value
              }))
            }
          >
            <option value="under_review">Under Review</option>
            <option value="resolved">Resolved</option>
          </select>
          <textarea
            className="admin-input"
            placeholder="Resolution notes"
            value={resolveForm.resolution}
            onChange={(event) =>
              setResolveForm((prev) => ({
                ...prev,
                resolution: event.target.value
              }))
            }
          />
          <button type="submit" disabled={!canFetch}>
            Resolve Dispute
          </button>
        </form>
      </section>

      <section className="admin-section">
        <h2>Provider Actions</h2>
        <input
          className="admin-input"
          type="text"
          placeholder="Provider ID"
          value={providerAction.id}
          onChange={(event) => setProviderAction({ id: event.target.value })}
        />
        <div className="admin-actions">
          <button type="button" onClick={handleSuspend} disabled={!canFetch}>
            Suspend Provider
          </button>
          <button type="button" onClick={handleReinstate} disabled={!canFetch}>
            Reinstate Provider
          </button>
        </div>
      </section>

      <section className="admin-section">
        <h2>Review Actions</h2>
        <input
          className="admin-input"
          type="text"
          placeholder="Review ID"
          value={reviewAction.id}
          onChange={(event) => setReviewAction({ id: event.target.value })}
        />
        <div className="admin-actions">
          <button type="button" onClick={handleRemoveReview} disabled={!canFetch}>
            Remove Review
          </button>
        </div>
      </section>
    </div>
  )
}

export default Admin
