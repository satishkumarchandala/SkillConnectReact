import React from 'react'
import Stars from './Stars'
import ReviewsBreakdown from './ReviewsBreakdown'

const ServiceDetailsModal = ({
  provider,
  onClose,
  onBookNow,
  bookingData,
  onBookingUpdate,
  availabilityColors
}) => {
  if (!provider) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="services-modal-backdrop"
      onClick={onClose}
    >
      <div
        className="services-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="services-modal-header">
          <div className="services-modal-profile">
            <img
              src={provider.avatar}
              alt={provider.name}
              className="services-modal-avatar"
            />
            <div>
              <h2>{provider.name}</h2>
              <span className="services-badge">{provider.serviceType}</span>
              <div className="services-rating">
                <Stars rating={provider.rating} />
                <span>
                  {provider.rating}/5 ({provider.reviewsCount} reviews)
                </span>
              </div>
              <div
                className="services-availability"
                style={{ color: availabilityColors[provider.availability] }}
              >
                {provider.availability}
              </div>
            </div>
          </div>
          <div className="services-modal-actions">
            <button type="button" onClick={onBookNow} className="btn btn-primary">
              Book Now
            </button>
            <button type="button" onClick={onClose} className="btn btn-muted">
              Close
            </button>
          </div>
        </div>

        <div className="services-modal-body">
          <div className="services-modal-left">
            <section>
              <h3>About</h3>
              <p className="services-muted">{provider.bio}</p>
              <div className="services-inline">
                <div>Experience: {provider.experience} yrs</div>
                <div>Service areas: {provider.serviceAreas.join(', ')}</div>
              </div>
              <div className="services-muted">
                Certifications: {provider.certifications.join(', ')}
              </div>
            </section>

            <section>
              <h3>Pricing</h3>
              <p className="services-muted">Base rate: ${provider.rate}/hr</p>
              <div className="services-stack">
                {provider.packages.map((pkg) => (
                  <div key={pkg.name} className="services-package">
                    <div>
                      <strong>{pkg.name}</strong>
                      <p className="services-muted">{pkg.desc}</p>
                    </div>
                    <div>${pkg.price}</div>
                  </div>
                ))}
              </div>
              <p className="services-muted">{provider.additionalCharges}</p>
            </section>

            <section>
              <h3>Reviews & Ratings</h3>
              <ReviewsBreakdown reviews={provider.reviews} />
              <div className="services-stack">
                {provider.reviews.map((review, idx) => (
                  <div key={`${review.reviewer}-${idx}`} className="services-review">
                    <strong>{review.reviewer}</strong>
                    <div className="services-review-date">{review.date}</div>
                    <div>
                      <Stars rating={review.rating} />
                    </div>
                    <p className="services-muted">{review.comment}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="services-modal-right">
            <section>
              <h3>Gallery</h3>
              <div className="services-gallery">
                {provider.gallery.map((img, idx) => (
                  <img
                    key={`${provider.id}-gallery-${idx}`}
                    src={img}
                    alt="Work sample"
                    className="services-gallery-img"
                  />
                ))}
              </div>
            </section>
            <section>
              <h3>Availability</h3>
              <div className="services-stack">
                <input
                  type="date"
                  value={bookingData.date}
                  min={provider.availableDates[0]}
                  onChange={(event) => onBookingUpdate({ date: event.target.value })}
                  className="services-input"
                />
                <div className="services-slots">
                  {(provider.availableSlots[bookingData.date] || []).map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => onBookingUpdate({ timeSlot: slot })}
                      className={`services-slot ${
                        bookingData.timeSlot === slot ? 'active' : ''
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                  {(provider.availableSlots[bookingData.date] || []).length === 0 && (
                    <span className="services-muted">No slots selected.</span>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceDetailsModal
