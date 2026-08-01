import { ref, computed } from 'vue'
import type { UserProfile, UserRole } from '~/types/brebes'

const currentUser = ref<UserProfile | null>({
  id: 'user-001',
  name: 'Budi Santoso',
  email: 'budi@example.com',
  role: 'tourist',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
  personaTags: ['Sejuk & Alam', 'Pecinta Pedas', 'Keluarga'],
  favorites: ['wisata-kaligua', 'kuliner-sate-blengong']
})

const isAuthModalOpen = ref(false)
const authMode = ref<'login' | 'register'>('login')

export function useAuth() {
  const isAuthenticated = computed(() => currentUser.value !== null)
  const userRole = computed<UserRole>(() => currentUser.value?.role || 'tourist')

  function openAuthModal(mode: 'login' | 'register' = 'login') {
    authMode.value = mode
    isAuthModalOpen.value = true
  }

  function closeAuthModal() {
    isAuthModalOpen.value = false
  }

  function loginAs(role: UserRole) {
    if (role === 'tourist') {
      currentUser.value = {
        id: 'user-tourist',
        name: 'Siti Rahma (Wisatawan)',
        email: 'siti@wisata.id',
        role: 'tourist',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
        personaTags: ['Pecinta Kuliner', 'Oleh-Oleh UMKM', 'FotoGenic'],
        favorites: ['wisata-kaligua', 'kuliner-sate-blengong']
      }
    } else if (role === 'business') {
      currentUser.value = {
        id: 'user-biz',
        name: 'Mas Yanto (Pengelola Sate Blengong)',
        email: 'yanto@sateblengong.com',
        role: 'business',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
        businessName: 'Sate Blengong & Kupat Glabed Mas Yanto',
        favorites: []
      }
    } else if (role === 'admin') {
      currentUser.value = {
        id: 'user-admin',
        name: 'Admin Dinas Pariwisata Brebes',
        email: 'admin@pariwisata.brebeskab.go.id',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        favorites: []
      }
    }
    isAuthModalOpen.value = false
  }

  function logout() {
    currentUser.value = null
  }

  function toggleFavorite(itemId: string) {
    if (!currentUser.value) {
      openAuthModal()
      return
    }
    if (!currentUser.value.favorites) currentUser.value.favorites = []
    const idx = currentUser.value.favorites.indexOf(itemId)
    if (idx >= 0) {
      currentUser.value.favorites.splice(idx, 1)
    } else {
      currentUser.value.favorites.push(itemId)
    }
  }

  function isFavorite(itemId: string): boolean {
    return currentUser.value?.favorites?.includes(itemId) || false
  }

  return {
    currentUser,
    isAuthenticated,
    userRole,
    isAuthModalOpen,
    authMode,
    openAuthModal,
    closeAuthModal,
    loginAs,
    logout,
    toggleFavorite,
    isFavorite
  }
}
