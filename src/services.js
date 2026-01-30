import React, { useMemo, useState } from 'react'
import ServiceProviderCard from './components/ServiceProviderCard'
import ServicesFilters from './components/ServicesFilters'
import ServiceDetailsModal from './components/ServiceDetailsModal'
import BookingModal from './components/BookingModal'
import Stars from './components/Stars'
import useServiceProviders from './hooks/useServiceProviders'
import './services.css'

const availabilityColors = {
  'Available Now': '#16a34a',
  Busy: '#f59e0b',
  Offline: '#6b7280'
}

const initialBookingData = {
  serviceType: '',
  date: '',
  timeSlot: '',
  location: '',
  duration: 2,
  description: '',
  photos: [],
  requirements: ''
}

const Services = () => {
  const providers = useServiceProviders()
  const [viewMode, setViewMode] = useState('list')
  const [serviceType, setServiceType] = useState('All')
  const [location, setLocation] = useState('All')
  const [availabilityOnly, setAvailabilityOnly] = useState(false)
  const [ratingOnly, setRatingOnly] = useState(false)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('rating-desc')
  const [priceMin, setPriceMin] = useState(20)
  const [priceMax, setPriceMax] = useState(120)
  const [selectedProvider, setSelectedProvider] = useState(null)
  const [bookingProvider, setBookingProvider] = useState(null)
  const [bookingStep, setBookingStep] = useState(1)
  const [bookingData, setBookingData] = useState(initialBookingData)

  const serviceTypes = useMemo(() => {
    const set = new Set(providers.map((p) => p.serviceType))
    return ['All', ...Array.from(set)]
  }, [providers])

  const locations = useMemo(() => {
    const set = new Set(providers.map((p) => p.location))
    return ['All', ...Array.from(set)]
  }, [providers])

  const filteredProviders = useMemo(() => {
    let list = [...providers]
    if (serviceType !== 'All') {
      list = list.filter((p) => p.serviceType === serviceType)
    }
    if (location !== 'All') {
      list = list.filter((p) => p.location === location)
    }
    if (availabilityOnly) {
      list = list.filter((p) => p.availability === 'Available Now')
    }
    if (ratingOnly) {
      list = list.filter((p) => p.rating >= 4)
    }
    list = list.filter(
      (p) => p.rate >= priceMin && p.rate <= priceMax
    )
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.serviceType.toLowerCase().includes(q) ||
          p.bio.toLowerCase().includes(q) ||
          p.offerings.some((o) => o.toLowerCase().includes(q))
      )
    }

    switch (sortBy) {
      case 'rating-desc':
        list.sort((a, b) => b.rating - a.rating)
        break
      case 'price-asc':
        list.sort((a, b) => a.rate - b.rate)
        break
      case 'price-desc':
        list.sort((a, b) => b.rate - a.rate)
        break
      case 'experience-desc':
        list.sort((a, b) => b.experience - a.experience)
        break
      case 'nearest':
        list.sort((a, b) => a.distanceKm - b.distanceKm)
        break
      case 'most-booked':
        list.sort((a, b) => b.bookings - a.bookings)
        break
      default:
        break
    }

    return list
  }, [
    availabilityOnly,
    location,
    priceMax,
    priceMin,
    ratingOnly,
    search,
    serviceType,
    sortBy,
    providers
  ])

  const openDetails = (provider) => {
    setSelectedProvider(provider)
  }

  const closeDetails = () => {
    setSelectedProvider(null)
  }

  const startBooking = (provider) => {
    setBookingProvider(provider)
    setBookingStep(1)
    setBookingData((prev) => ({
      ...prev,
      serviceType: provider.offerings[0] || provider.serviceType,
      date: provider.availableDates[0] || '',
      timeSlot:
        provider.availableSlots[provider.availableDates[0]]?.[0] || ''
    }))
  }

  const closeBooking = () => {
    setBookingProvider(null)
    setBookingStep(1)
    setBookingData(initialBookingData)
  }

  const updateBooking = (updates) => {
    setBookingData((prev) => ({ ...prev, ...updates }))
  }

  const confirmBooking = () => {
    setBookingStep(4)
  }

  const estimateCost = () => {
    if (!bookingProvider) return 0
    return bookingProvider.rate * bookingData.duration
  }

  return (
    <div className="services-page">
      <div className="services-container">
        <header className="services-header">
          <h1>Find trusted service providers</h1>
          <p>Browse, filter, and book skilled professionals near you.</p>
        </header>

        <ServicesFilters
          serviceTypes={serviceTypes}
          locations={locations}
          serviceType={serviceType}
          setServiceType={setServiceType}
          location={location}
          setLocation={setLocation}
          search={search}
          setSearch={setSearch}
          sortBy={sortBy}
          setSortBy={setSortBy}
          priceMin={priceMin}
          priceMax={priceMax}
          setPriceMin={setPriceMin}
          setPriceMax={setPriceMax}
          availabilityOnly={availabilityOnly}
          setAvailabilityOnly={setAvailabilityOnly}
          ratingOnly={ratingOnly}
          setRatingOnly={setRatingOnly}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        <section
          className={`services-grid ${viewMode === 'grid' ? 'grid' : 'list'}`}
        >
          {filteredProviders.map((provider) => (
            <ServiceProviderCard
              key={provider.id}
              provider={provider}
              viewMode={viewMode}
              availabilityColors={availabilityColors}
              onViewDetails={() => openDetails(provider)}
              onBookNow={() => startBooking(provider)}
              renderStars={(rating) => <Stars rating={rating} />}
            />
          ))}
          {filteredProviders.length === 0 && (
            <div className="services-empty">
              No providers match your filters. Add providers to local storage to get started.
            </div>
          )}
        </section>
      </div>

      <ServiceDetailsModal
        provider={selectedProvider}
        onClose={closeDetails}
        onBookNow={() => startBooking(selectedProvider)}
        bookingData={bookingData}
        onBookingUpdate={updateBooking}
        availabilityColors={availabilityColors}
      />

      <BookingModal
        provider={bookingProvider}
        bookingStep={bookingStep}
        bookingData={bookingData}
        onClose={closeBooking}
        onUpdate={updateBooking}
        onStepChange={setBookingStep}
        onConfirm={confirmBooking}
        estimateCost={estimateCost}
      />
    </div>
  )
}

export default Services