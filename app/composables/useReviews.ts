import { ref } from 'vue'
import type { ReviewItem } from '~/types/brebes'
import { useAuth } from './useAuth'

const reviewsList = ref<ReviewItem[]>([
  {
    id: 'rev-1',
    itemId: 'wisata-kaligua',
    userName: 'Dewi Lestari',
    userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
    rating: 5,
    date: '2026-07-28',
    comment: 'Pemandangan kebun tehnya sangat asri dan sejuk. Sangat direkomendasikan datang sebelum jam 9 pagi!',
    aiSentimentTag: '😊 98% Sangat Puas — Suasana Sejuk & Asri',
    helpfulCount: 24
  },
  {
    id: 'rev-2',
    itemId: 'kuliner-sate-blengong',
    userName: 'Ahmad Fauzi',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    rating: 5,
    date: '2026-07-30',
    comment: 'Sate Blengongnya empuk sekali, bumbunya meresap sampai ke serat daging. Wajib dipadu Kupat Glabed!',
    aiSentimentTag: '🔥 99% Favorit Wisatawan — Cita Rasa Otentik',
    helpfulCount: 42
  }
])

export function useReviews() {
  const { currentUser } = useAuth()

  function getReviewsForItem(itemId: string): ReviewItem[] {
    return reviewsList.value.filter(r => r.itemId === itemId)
  }

  function addReview(itemId: string, rating: number, comment: string) {
    const newReview: ReviewItem = {
      id: 'rev-' + Date.now(),
      itemId,
      userName: currentUser.value?.name || 'Wisatawan Brebes',
      userAvatar: currentUser.value?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      rating,
      date: new Date().toISOString().split('T')[0] as string,
      comment,
      aiSentimentTag: `✨ ${rating >= 4 ? 'Sangat Direkomendasikan' : 'Cukup Baik'} — Analisis Gemma AI`,
      helpfulCount: 1
    }
    reviewsList.value.unshift(newReview)
  }

  return {
    reviewsList,
    getReviewsForItem,
    addReview
  }
}
