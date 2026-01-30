import React from 'react'
import './ServiceProviderCard.css'

const ServiceProviderCard = ({
  provider,
  viewMode,
  availabilityColors,
  onViewDetails,
  onBookNow,
  renderStars
}) => {
  return (
    <div
      className={`sp-card ${viewMode}`}
      onClick={onViewDetails}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter') onViewDetails()
      }}
    >
      <img className="sp-card-avatar" src={provider.avatar} alt={provider.name} />
      <div className="sp-card-body">
        <div className="sp-card-header">
          <div>
            <h3>{provider.name}</h3>
            <p className="sp-card-type">{provider.serviceType}</p>
            <div className="sp-card-rating">
              {renderStars(provider.rating)}
              <span>
                {provider.rating}/5 ({provider.reviewsCount})
              </span>
            </div>
          </div>
          <span
            className="sp-card-status"
            style={{
              background: `${availabilityColors[provider.availability]}1A`,
              color: availabilityColors[provider.availability]
            }}
          >
            {provider.availability}
          </span>
        </div>

        <div className={`sp-card-meta ${viewMode}`}>
          <div>Experience: {provider.experience} yrs</div>
          <div>Rate: ${provider.rate}/hr</div>
          <div>Area: {provider.location}</div>
          <div>Distance: {provider.distanceKm} km</div>
        </div>

        <div className="sp-card-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={(event) => {
              event.stopPropagation()
              onBookNow()
            }}
          >
            Book Now
          </button>
          <button
            type="button"
            className="btn btn-muted"
            onClick={(event) => {
              event.stopPropagation()
              onViewDetails()
            }}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  )
}

export default ServiceProviderCard
