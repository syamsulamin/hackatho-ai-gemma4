import { ref, computed } from 'vue'
import type { LocaleType } from '~/types/brebes'

const currentLocale = ref<LocaleType>('id')

const translations: Record<LocaleType, Record<string, string>> = {
  id: {
    heroTitle: 'Eksplorasi Wisata, Kuliner & UMKM Brebes',
    heroTagline: 'Ditenagai Gemma AI — Temukan tempat menarik, oleh-oleh khas, dan susun itinerary liburan cerdas.',
    recommendationMode: '🎯 Rekomendasi Tempat',
    itineraryMode: '🗓️ Itinerary Planner (1-3 Hari)',
    searchCategory: 'Pilih Fokus Kategori',
    allCategories: 'Semua Kategori',
    wisataCategory: 'Wisata Alam',
    kulinerCategory: 'Kuliner Khas',
    umkmCategory: 'UMKM & Oleh-oleh',
    planButton: 'Rencanakan dengan AI ✨',
    itineraryButton: 'Susun Itinerary dengan AI 🗓️',
    analyzingText: 'Menganalisis dengan Gemma AI...',
    businessPortal: 'Portal UMKM',
    adminDashboard: 'Dashboard Pemda',
    loginText: 'Masuk / Daftar',
    logoutText: 'Keluar',
    myBookings: 'Tiket & Pesanan Saya',
    myFavorites: 'Favorit Saya',
    reviewsCountText: 'Ulasan Pengunjung',
    bookTicket: 'Pesan Tiket / Order',
    writeReview: 'Tulis Ulasan'
  },
  jv: {
    heroTitle: 'Eksplorasi Wisata, Kuliner & UMKM Brebes',
    heroTagline: 'Kanggo Gemma AI — Nemu panggonan apik, oleh-oleh khas, lan ngerancang liburan pinter.',
    recommendationMode: '🎯 Rekomendasi Panggonan',
    itineraryMode: '🗓️ Rencana Trip (1-3 Dina)',
    searchCategory: 'Pilih Fokus Kategori',
    allCategories: 'Kabeh Kategori',
    wisataCategory: 'Wisata Alam',
    kulinerCategory: 'Panganan Khas',
    umkmCategory: 'UMKM & Oleh-oleh',
    planButton: 'Rancang Karo AI ✨',
    itineraryButton: 'Gawe Jadwal Karo AI 🗓️',
    analyzingText: 'Maca data karo Gemma AI...',
    businessPortal: 'Portal Pelaku Usaha',
    adminDashboard: 'Dashboard Pemda',
    loginText: 'Mlebu / Daftar',
    logoutText: 'Metu',
    myBookings: 'Tiket & Pesanan Isun',
    myFavorites: 'Pilihan Isun',
    reviewsCountText: 'Ulasan Pengunjung',
    bookTicket: 'Pesen Tiket / Order',
    writeReview: 'Tulis Ulasan'
  },
  en: {
    heroTitle: 'Explore Brebes Tourism, Culinary & Local SMEs',
    heroTagline: 'Powered by Gemma AI — Discover top destinations, authentic souvenirs, and smart multi-day itineraries.',
    recommendationMode: '🎯 Spot Recommendations',
    itineraryMode: '🗓️ Itinerary Planner (1-3 Days)',
    searchCategory: 'Select Category Focus',
    allCategories: 'All Categories',
    wisataCategory: 'Nature Tourism',
    kulinerCategory: 'Local Culinary',
    umkmCategory: 'Local SME Souvenirs',
    planButton: 'Plan with AI ✨',
    itineraryButton: 'Generate Itinerary with AI 🗓️',
    analyzingText: 'Analyzing with Gemma AI...',
    businessPortal: 'Business Portal',
    adminDashboard: 'Gov Dashboard',
    loginText: 'Sign In / Register',
    logoutText: 'Sign Out',
    myBookings: 'My Tickets & Orders',
    myFavorites: 'My Favorites',
    reviewsCountText: 'Visitor Reviews',
    bookTicket: 'Book Ticket / Order',
    writeReview: 'Write Review'
  }
}

export function useI18n() {
  function setLocale(locale: LocaleType) {
    currentLocale.value = locale
  }

  function t(key: string): string {
    return translations[currentLocale.value]?.[key] || translations['id']?.[key] || key
  }

  return {
    currentLocale,
    setLocale,
    t
  }
}
