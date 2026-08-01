export type CategoryType = 'all' | 'wisata' | 'kuliner' | 'umkm'
export type SearchModeType = 'recommendation' | 'itinerary'
export type UserRole = 'tourist' | 'business' | 'admin'
export type LocaleType = 'id' | 'jv' | 'en'
export type BookingStatus = 'pending' | 'paid' | 'cancelled' | 'completed'
export type PaymentMethod = 'qris' | 'gopay' | 'ovo' | 'shopeepay' | 'bank_transfer' | 'credit_card'

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
  priceNumber?: number
  tags: string[]
  description: string
  highlight: string
  address: string
  mapsUrl: string
  bestTime?: string
  icon: string
  gradient: string
  aiNote?: string
  aiReason?: string
  matchScore?: number
  coordinates?: BrebesCoordinates
  businessOwnerId?: string
  stockCount?: number
  isBookable?: boolean
}

export interface UserProfile {
  id: string
  name: string
  email: string
  role: UserRole
  avatar: string
  personaTags?: string[]
  businessName?: string
  favorites?: string[]
}

export interface ReviewItem {
  id: string
  itemId: string
  userName: string
  userAvatar: string
  rating: number
  date: string
  comment: string
  aiSentimentTag: string
  helpfulCount: number
}

export interface BookingItem {
  id: string
  bookingCode: string
  itemId: string
  itemName: string
  itemCategory: CategoryType
  userId: string
  userName: string
  userEmail: string
  date: string
  timeSlot?: string
  quantity: number
  unitPrice: number
  totalPrice: number
  paymentMethod: PaymentMethod
  paymentStatus: BookingStatus
  qrCodeUrl: string
  createdAt: string
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

export interface OriginRouteInfo {
  originCity: string
  travelDuration: string
  recommendedTransport: string
  estimatedCostInfo?: string
  tipsFromOrigin: string
}

export interface AIRecommendationRequest {
  prompt: string
  category?: CategoryType
  mode?: SearchModeType
  days?: number
  personaTags?: string[]
  originCity?: string
}

export interface AIRecommendationResponse {
  summary: string
  reasoning: string
  categoryLabel: string
  recommendations: BrebesItem[]
  itinerary?: ItineraryDay[]
  originRoute?: OriginRouteInfo
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
