export type CategoryType = 'all' | 'wisata' | 'kuliner' | 'umkm'

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
}

export interface AIRecommendationRequest {
  prompt: string
  category?: CategoryType
}

export interface AIRecommendationResponse {
  summary: string
  reasoning: string
  categoryLabel: string
  recommendations: BrebesItem[]
  queryTags: string[]
  suggestedFollowups: string[]
  generatedAt: string
}

export interface PromptPreset {
  id: string
  label: string
  prompt: string
  category: CategoryType
  icon: string
}
