export const STORAGE_KEY = 'serviceProviders'

export const normalizeProvider = (provider, index) => ({
  id: provider?.id || `sp-${index + 1}`,
  name: provider?.name || 'Unnamed Provider',
  serviceType: provider?.serviceType || 'Service',
  rating: Number(provider?.rating) || 0,
  reviewsCount: Number(provider?.reviewsCount) || provider?.reviews?.length || 0,
  experience: Number(provider?.experience) || 0,
  availability: provider?.availability || 'Offline',
  rate: Number(provider?.rate) || 0,
  location: provider?.location || 'Unknown',
  distanceKm: Number(provider?.distanceKm) || 0,
  bookings: Number(provider?.bookings) || 0,
  avatar: provider?.avatar || 'https://via.placeholder.com/150',
  bio: provider?.bio || 'No description provided.',
  skills: provider?.skills || [],
  certifications: provider?.certifications || [],
  serviceAreas: provider?.serviceAreas || [],
  packages: provider?.packages || [],
  additionalCharges: provider?.additionalCharges || '',
  gallery: provider?.gallery || [],
  reviews: provider?.reviews || [],
  availableDates: provider?.availableDates || [],
  availableSlots: provider?.availableSlots || {},
  offerings: provider?.offerings || []
})

export const mapProviderApiToUi = (provider = {}, index = 0) => {
  const profile = provider.profile || {}
  const providerProfile = provider.providerProfile || {}
  const nextAvailableSlot = provider.nextAvailableSlot
    ? new Date(provider.nextAvailableSlot).toLocaleString()
    : ''

  return {
    id: provider._id || `sp-${index + 1}`,
    name: profile.name || 'Unnamed Provider',
    serviceType: providerProfile.skills?.[0] || 'Service',
    rating: Number(providerProfile.ratingAvg) || 0,
    reviewsCount: Number(providerProfile.ratingCount) || 0,
    experience: Number(providerProfile.experience) || 0,
    availability: providerProfile.availability || 'Offline',
    rate: Number(providerProfile.hourlyRate) || 0,
    location: profile.locationName || 'Unknown',
    distanceKm: Number(provider.distanceMeters)
      ? Number((provider.distanceMeters / 1000).toFixed(2))
      : 0,
    bookings: Number(providerProfile.bookings) || 0,
    avatar: profile.avatar || 'https://via.placeholder.com/150',
    bio: providerProfile.bio || 'No description provided.',
    skills: providerProfile.skills || [],
    certifications: providerProfile.certifications || [],
    serviceAreas: providerProfile.serviceAreas || [],
    packages: providerProfile.packages || [],
    additionalCharges: providerProfile.additionalCharges || '',
    gallery: providerProfile.gallery || [],
    reviews: providerProfile.reviews || [],
    availableDates: providerProfile.availableDates || [],
    availableSlots: providerProfile.availableSlots || {},
    offerings: providerProfile.skills || [],
    nextAvailableSlot
  }
}
