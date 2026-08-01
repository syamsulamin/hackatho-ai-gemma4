<script setup lang="ts">
import { ref } from 'vue'
import { useReviews } from '~/composables/useReviews'
import type { BrebesItem } from '~/types/brebes'

const props = defineProps<{
  item: BrebesItem | null
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { getReviewsForItem, addReview } = useReviews()

const newRating = ref(5)
const newComment = ref('')

function handleSubmitReview() {
  if (!props.item || !newComment.value.trim()) return
  addReview(props.item.id, newRating.value, newComment.value.trim())
  newComment.value = ''
}
</script>

<template>
  <div v-if="isOpen && item" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
    <div class="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/30 shadow-2xl max-w-lg w-full relative bg-slate-900/95 max-h-[90vh] overflow-y-auto custom-scrollbar space-y-6">
      <!-- Close Button -->
      <button
        type="button"
        @click="emit('close')"
        class="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
      >
        <UIcon name="i-heroicons-x-mark" class="w-5 h-5" />
      </button>

      <!-- Header -->
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
          <UIcon name="i-heroicons-star" class="w-5 h-5" />
        </div>
        <div>
          <span class="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Ulasan & Sentimen AI</span>
          <h3 class="text-lg font-bold text-white">{{ item.name }}</h3>
        </div>
      </div>

      <!-- Submit New Review Form -->
      <form @submit.prevent="handleSubmitReview" class="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-3">
        <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Berikan Rating & Ulasan</label>
        
        <!-- Star Picker -->
        <div class="flex items-center gap-1">
          <button
            v-for="star in 5"
            :key="star"
            type="button"
            @click="newRating = star"
            class="p-1 transition text-lg"
          >
            <span :class="star <= newRating ? 'text-amber-400' : 'text-slate-600'">⭐</span>
          </button>
        </div>

        <textarea
          v-model="newComment"
          rows="2"
          placeholder="Bagikan pengalamanmu di tempat ini..."
          class="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500 resize-none"
        ></textarea>

        <div class="flex justify-end">
          <button
            type="submit"
            :disabled="!newComment.trim()"
            class="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs transition"
          >
            Kirim Ulasan
          </button>
        </div>
      </form>

      <!-- Existing Reviews List -->
      <div class="space-y-3">
        <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Daftar Ulasan Pengunjung</h4>

        <div
          v-for="rev in getReviewsForItem(item.id)"
          :key="rev.id"
          class="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 space-y-2 text-xs"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <img :src="rev.userAvatar" :alt="rev.userName" class="w-6 h-6 rounded-full object-cover" />
              <span class="font-bold text-white">{{ rev.userName }}</span>
            </div>
            <span class="text-amber-400 font-bold">⭐ {{ rev.rating }}/5</span>
          </div>

          <p class="text-slate-300 leading-relaxed">{{ rev.comment }}</p>

          <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/40 text-emerald-300 border border-emerald-500/20 text-[10px]">
            <UIcon name="i-heroicons-sparkles" class="w-3.5 h-3.5 text-emerald-400" />
            <span>{{ rev.aiSentimentTag }}</span>
          </div>
        </div>

        <div v-if="getReviewsForItem(item.id).length === 0" class="text-center py-4 text-xs text-slate-500">
          Belum ada ulasan. Jadilah pengunjung pertama yang memberikan ulasan!
        </div>
      </div>
    </div>
  </div>
</template>
