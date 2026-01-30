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
