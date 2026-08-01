<script setup lang="ts">
import { ref, nextTick } from 'vue'
import type { AIRecommendationResponse, BrebesItem, CategoryType, SearchModeType } from '~/types/brebes'
import AppHeader from '~/components/AppHeader.vue'
import HeroSection from '~/components/HeroSection.vue'
import PromptForm from '~/components/PromptForm.vue'
import LoadingSkeleton from '~/components/LoadingSkeleton.vue'
import ErrorAlert from '~/components/ErrorAlert.vue'
import RecommendationList from '~/components/RecommendationList.vue'
import AIPersonalizationFeed from '~/components/AIPersonalizationFeed.vue'
import AuthModal from '~/components/AuthModal.vue'
import BookingModal from '~/components/BookingModal.vue'
import ReviewsModal from '~/components/ReviewsModal.vue'
import UserBookingsModal from '~/components/UserBookingsModal.vue'
import BusinessPortalView from '~/components/BusinessPortalView.vue'
import AdminDashboardView from '~/components/AdminDashboardView.vue'
import { useBooking } from '~/composables/useBooking'

const activeView = ref<'tourist' | 'business' | 'admin'>('tourist')

const loading = ref(false)
const error = ref<string | null>(null)
const aiResponse = ref<AIRecommendationResponse | null>(null)
const currentPrompt = ref('')
const currentCategory = ref<CategoryType>('all')
const currentMode = ref<SearchModeType>('recommendation')

const resultsAnchor = ref<HTMLElement | null>(null)

const { openBookingModal } = useBooking()

const reviewItem = ref<BrebesItem | null>(null)
const isReviewModalOpen = ref(false)
const isUserBookingsModalOpen = ref(false)

async function handleGenerate(payload: { prompt: string; category: CategoryType; mode?: SearchModeType }) {
  loading.value = true
  error.value = null
  currentPrompt.value = payload.prompt
  currentCategory.value = payload.category
  if (payload.mode) currentMode.value = payload.mode

  try {
    const res = await $fetch<{ status: string; data: AIRecommendationResponse }>('/api/generate', {
      method: 'POST',
      body: {
        prompt: payload.prompt,
        category: payload.category,
        mode: currentMode.value
      }
    })

    if (res.status === 'success' && res.data) {
      aiResponse.value = res.data

      await nextTick()
      if (resultsAnchor.value) {
        resultsAnchor.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    } else {
      throw new Error('Format respon AI tidak valid.')
    }
  } catch (err: any) {
    console.error('Error generating AI recommendation:', err)
    error.value = err?.data?.statusMessage || err?.message || 'Terjadi kesalahan saat memproses permintaan AI. Silakan coba lagi.'
  } finally {
    loading.value = false
  }
}

function handleClear() {
  aiResponse.value = null
  error.value = null
}

function handleFollowup(prompt: string) {
  handleGenerate({
    prompt,
    category: currentCategory.value,
    mode: currentMode.value
  })
}

function handleRetry() {
  if (currentPrompt.value) {
    handleGenerate({
      prompt: currentPrompt.value,
      category: currentCategory.value,
      mode: currentMode.value
    })
  }
}

function handleOpenBooking(item: BrebesItem) {
  openBookingModal(item)
}

function handleOpenReview(item: BrebesItem) {
  reviewItem.value = item
  isReviewModalOpen.value = true
}
</script>

<template>
  <div>
    <!-- Sticky App Header with Portal Switcher -->
    <AppHeader
      :activeView="activeView"
      @changeView="activeView = $event"
      @openBookings="isUserBookingsModalOpen = true"
    />

    <!-- VIEW 1: TOURIST PORTAL -->
    <div v-if="activeView === 'tourist'" class="space-y-8 pb-12">
      <HeroSection />

      <!-- AI Personalization Feed Widget -->
      <AIPersonalizationFeed
        @openBooking="handleOpenBooking"
      />

      <PromptForm
        :loading="loading"
        @submit="handleGenerate"
        @clear="handleClear"
      />

      <div ref="resultsAnchor" class="scroll-mt-20"></div>

      <LoadingSkeleton v-if="loading" />

      <ErrorAlert
        v-else-if="error"
        :message="error"
        @retry="handleRetry"
      />

      <RecommendationList
        v-else-if="aiResponse"
        :response="aiResponse"
        @followup="handleFollowup"
        @book="handleOpenBooking"
        @review="handleOpenReview"
      />

      <div v-else class="max-w-2xl mx-auto px-4 pt-6 text-center text-xs text-slate-500">
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800">
          <UIcon name="i-heroicons-information-circle" class="w-4 h-4 text-emerald-400" />
          <span>Pilih inspirasi prompt di atas atau ketik pencarianmu untuk memulai</span>
        </div>
      </div>
    </div>

    <!-- VIEW 2: BUSINESS OWNER PORTAL -->
    <BusinessPortalView v-else-if="activeView === 'business'" />

    <!-- VIEW 3: GOVERNMENT ADMIN DASHBOARD -->
    <AdminDashboardView v-else-if="activeView === 'admin'" />

    <!-- Modals -->
    <AuthModal />

    <BookingModal />

    <ReviewsModal
      :item="reviewItem"
      :isOpen="isReviewModalOpen"
      @close="isReviewModalOpen = false"
    />

    <UserBookingsModal
      :isOpen="isUserBookingsModalOpen"
      @close="isUserBookingsModalOpen = false"
    />
  </div>
</template>
