export type CategoryType = 'all' | 'wisata' | 'kuliner' | 'umkm'
export type SearchModeType = 'recommendation' | 'itinerary'

export interface BrebesCoordinates {
  lat: number
  lng: number
}

export interface BrebesItem {
  id: string
  name: string
  category: 'wisata' | 'kuliner' | 'umkm'
  rating: number
  reviewsCount?: number
  location: string
  priceRange: string
  tags: string[]
  description: string
  highlight: string
  address: string
  mapsUrl: string
  bestTime?: string
  icon: string
  gradient: string
  aiNote?: string
  matchScore?: number
  coordinates?: BrebesCoordinates
}

export interface ItinerarySlot {
  time: string
  title: string
  itemId?: string
  locationName: string
  activity: string
  estimatedCost: string
  tips?: string
}

export interface ItineraryDay {
  dayNumber: number
  dayTitle: string
  slots: ItinerarySlot[]
}

export interface AIRecommendationRequest {
  prompt: string
  category?: CategoryType
  mode?: SearchModeType
  days?: number
}

export interface AIRecommendationResponse {
  summary: string
  reasoning: string
  categoryLabel: string
  recommendations: BrebesItem[]
  itinerary?: ItineraryDay[]
  queryTags: string[]
  suggestedFollowups: string[]
  generatedAt: string
}

export interface PromptPreset {
  id: string
  label: string
  prompt: string
  category: CategoryType
  mode?: SearchModeType
  icon: string
}

