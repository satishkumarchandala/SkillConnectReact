import React from 'react'
import './ServicesFilters.css'

const ServicesFilters = ({
  serviceTypes,
  locations,
  serviceType,
  setServiceType,
  location,
  setLocation,
  search,
  setSearch,
  sortBy,
  setSortBy,
  priceMin,
  priceMax,
  setPriceMin,
  setPriceMax,
  availabilityOnly,
  setAvailabilityOnly,
  ratingOnly,
  setRatingOnly,
  viewMode,
  setViewMode
}) => {
  return (
    <section className="services-filters">
      <div className="services-filter-row">
        <div>
          <label>Service Type</label>
          <select
            value={serviceType}
            onChange={(event) => setServiceType(event.target.value)}
            className="services-input"
          >
            {serviceTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Location</label>
          <select
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            className="services-input"
          >
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Search</label>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name or keywords"
            className="services-input"
          />
        </div>
        <div>
          <label>Sort by</label>
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="services-input"
          >
            <option value="rating-desc">Rating (highest)</option>
            <option value="price-asc">Price (low to high)</option>
            <option value="price-desc">Price (high to low)</option>
            <option value="experience-desc">Experience</option>
            <option value="nearest">Nearest</option>
            <option value="most-booked">Most booked</option>
          </select>
        </div>
      </div>

      <div className="services-filter-row">
        <div>
          <label>
            Price Range (${priceMin} - ${priceMax})
          </label>
          <div className="services-range">
            <input
              type="range"
              min="10"
              max="120"
              value={priceMin}
              onChange={(event) =>
                setPriceMin(Math.min(Number(event.target.value), priceMax - 5))
              }
              className="services-range-input"
            />
            <input
              type="range"
              min="20"
              max="150"
              value={priceMax}
              onChange={(event) =>
                setPriceMax(Math.max(Number(event.target.value), priceMin + 5))
              }
              className="services-range-input"
            />
          </div>
        </div>
        <div className="services-filter-group">
          <label>Filters</label>
          <div className="services-checkboxes">
            <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={availabilityOnly}
                onChange={(event) => setAvailabilityOnly(event.target.checked)}
              />
              Available only
            </label>
            <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={ratingOnly}
                onChange={(event) => setRatingOnly(event.target.checked)}
              />
              4★+ rating
            </label>
          </div>
        </div>
        <div className="services-filter-group">
          <label>View</label>
          <div className="services-toggle">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`services-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            >
              List
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`services-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
            >
              Grid
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ServicesFilters
