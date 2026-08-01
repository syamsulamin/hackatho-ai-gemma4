<script setup lang="ts">
import { ref, nextTick } from 'vue'
import type { AIRecommendationResponse, CategoryType } from '~/types/brebes'
import HeroSection from '~/components/HeroSection.vue'
import PromptForm from '~/components/PromptForm.vue'
import LoadingSkeleton from '~/components/LoadingSkeleton.vue'
import ErrorAlert from '~/components/ErrorAlert.vue'
import RecommendationList from '~/components/RecommendationList.vue'

const loading = ref(false)
const error = ref<string | null>(null)
const aiResponse = ref<AIRecommendationResponse | null>(null)
const currentPrompt = ref('')
const currentCategory = ref<CategoryType>('all')

const resultsAnchor = ref<HTMLElement | null>(null)

async function handleGenerate(payload: { prompt: string; category: CategoryType }) {
  loading.value = true
  error.value = null
  currentPrompt.value = payload.prompt
  currentCategory.value = payload.category

  try {
    const res = await $fetch<{ status: string; data: AIRecommendationResponse }>('/api/generate', {
      method: 'POST',
      body: {
        prompt: payload.prompt,
        category: payload.category
      }
    })

    if (res.status === 'success' && res.data) {
      aiResponse.value = res.data

      // Scroll smoothly to results
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
    category: currentCategory.value
  })
}

function handleRetry() {
  if (currentPrompt.value) {
    handleGenerate({
      prompt: currentPrompt.value,
      category: currentCategory.value
    })
  }
}
</script>

<template>
  <div class="space-y-8 pb-12">
    <!-- Hero Section -->
    <HeroSection />

    <!-- Prompt Form Area -->
    <PromptForm
      :loading="loading"
      @submit="handleGenerate"
      @clear="handleClear"
    />

    <!-- Anchor for scrolling to results -->
    <div ref="resultsAnchor" class="scroll-mt-20"></div>

    <!-- Loading State -->
    <LoadingSkeleton v-if="loading" />

    <!-- Error State -->
    <ErrorAlert
      v-else-if="error"
      :message="error"
      @retry="handleRetry"
    />

    <!-- AI Results Card List -->
    <RecommendationList
      v-else-if="aiResponse"
      :response="aiResponse"
      @followup="handleFollowup"
    />

    <!-- Initial Welcome State (if no response yet and not loading/error) -->
    <div v-else class="max-w-2xl mx-auto px-4 pt-6 text-center text-xs text-slate-500">
      <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800">
        <UIcon name="i-heroicons-information-circle" class="w-4 h-4 text-emerald-400" />
        <span>Pilih inspirasi prompt di atas atau ketik pencarianmu untuk memulai</span>
      </div>
    </div>
  </div>
</template>
