import React from 'react'

const BookingModal = ({
  provider,
  bookingStep,
  bookingData,
  onClose,
  onUpdate,
  onStepChange,
  onConfirm,
  estimateCost
}) => {
  if (!provider) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="services-modal-backdrop"
      onClick={onClose}
    >
      <div className="services-modal" onClick={(event) => event.stopPropagation()}>
        <div className="services-modal-header">
          <div>
            <h2>Booking</h2>
            <p className="services-muted">
              {provider.name} • {provider.serviceType}
            </p>
          </div>
          <button type="button" onClick={onClose} className="btn btn-muted">
            Close
          </button>
        </div>

        <div className="services-steps">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={`step-${step}`}
              className={`services-step ${bookingStep >= step ? 'active' : ''}`}
            >
              Step {step}
            </div>
          ))}
        </div>

        {bookingStep === 1 && (
          <div className="services-form">
            <div>
              <label>Service Type</label>
              <select
                value={bookingData.serviceType}
                onChange={(event) => onUpdate({ serviceType: event.target.value })}
                className="services-input"
              >
                {provider.offerings.map((offer) => (
                  <option key={offer} value={offer}>
                    {offer}
                  </option>
                ))}
              </select>
            </div>
            <div className="services-two-col">
              <div>
                <label>Date</label>
                <input
                  type="date"
                  value={bookingData.date}
                  onChange={(event) => onUpdate({ date: event.target.value })}
                  className="services-input"
                />
              </div>
              <div>
                <label>Time Slot</label>
                <select
                  value={bookingData.timeSlot}
                  onChange={(event) => onUpdate({ timeSlot: event.target.value })}
                  className="services-input"
                >
                  {(provider.availableSlots[bookingData.date] || []).map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label>Service Location</label>
              <input
                value={bookingData.location}
                onChange={(event) => onUpdate({ location: event.target.value })}
                placeholder="Address"
                className="services-input"
              />
            </div>
            <div>
              <label>Estimated Duration (hours)</label>
              <input
                type="number"
                min="1"
                max="8"
                value={bookingData.duration}
                onChange={(event) => onUpdate({ duration: Number(event.target.value) })}
                className="services-input"
              />
            </div>
            <div className="services-actions">
              <button
                type="button"
                onClick={() => onStepChange(2)}
                className="btn btn-primary"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {bookingStep === 2 && (
          <div className="services-form">
            <div>
              <label>Problem Description</label>
              <textarea
                value={bookingData.description}
                onChange={(event) => onUpdate({ description: event.target.value })}
                rows="4"
                className="services-input"
              />
            </div>
            <div>
              <label>Upload Photos (optional)</label>
              <input
                type="file"
                multiple
                onChange={(event) =>
                  onUpdate({ photos: Array.from(event.target.files || []) })
                }
              />
            </div>
            <div>
              <label>Special Requirements</label>
              <input
                value={bookingData.requirements}
                onChange={(event) => onUpdate({ requirements: event.target.value })}
                className="services-input"
              />
            </div>
            <div className="services-actions between">
              <button
                type="button"
                onClick={() => onStepChange(1)}
                className="btn btn-muted"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => onStepChange(3)}
                className="btn btn-primary"
              >
                Review
              </button>
            </div>
          </div>
        )}

        {bookingStep === 3 && (
          <div className="services-form">
            <div className="services-review-header">
              <img
                src={provider.avatar}
                alt={provider.name}
                className="services-review-avatar"
              />
              <div>
                <strong>{provider.name}</strong>
                <div className="services-muted">{provider.serviceType}</div>
              </div>
            </div>
            <div className="services-summary">
              <div>Service: {bookingData.serviceType}</div>
              <div>
                Date & Time: {bookingData.date} • {bookingData.timeSlot}
              </div>
              <div>Location: {bookingData.location || 'Not provided'}</div>
              <div>Estimated duration: {bookingData.duration} hours</div>
              <div>Estimated cost: ${estimateCost()}</div>
            </div>
            <div className="services-actions between">
              <button
                type="button"
                onClick={() => onStepChange(2)}
                className="btn btn-muted"
              >
                Back
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="btn btn-success"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        )}

        {bookingStep === 4 && (
          <div className="services-confirm">
            <h3>Booking Confirmed 🎉</h3>
            <p className="services-muted">
              Your booking is confirmed. We’ve sent details to the provider.
            </p>
            <div className="services-confirm-id">
              Booking ID: BK-{Date.now().toString().slice(-6)}
            </div>
            <div className="services-muted">
              Provider contact: {provider.name} • support@skillconnect.com
            </div>
            <div className="services-actions center">
              <button
                type="button"
                onClick={() => onStepChange(2)}
                className="btn btn-muted"
              >
                Edit Booking
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-danger"
              >
                Cancel Booking
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BookingModal
