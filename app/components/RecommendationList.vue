<script setup lang="ts">
import type { AIRecommendationResponse } from '~/types/brebes'
import RecommendationCard from './RecommendationCard.vue'

const props = defineProps<{
  response: AIRecommendationResponse
}>()

const emit = defineEmits<{
  (e: 'followup', prompt: string): void
}>()
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <!-- Executive AI Summary Banner -->
    <div class="glass-panel p-6 sm:p-8 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/30 via-slate-900/60 to-cyan-950/30 shadow-2xl relative overflow-hidden">
      <div class="glow-blob-emerald -top-20 -left-20"></div>

      <div class="relative z-10 space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <UIcon name="i-heroicons-sparkles" class="w-5 h-5" />
            </span>
            <span class="text-xs font-extrabold uppercase tracking-wider text-emerald-400">Hasil Analisis Gemma AI</span>
          </div>

          <span class="text-xs font-semibold text-slate-400 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800">
            {{ response.categoryLabel }}
          </span>
        </div>

        <h2 class="text-xl sm:text-2xl font-bold text-white leading-snug">
          {{ response.summary }}
        </h2>

        <p class="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
          <strong class="text-emerald-300 font-semibold">Alasan AI:</strong> {{ response.reasoning }}
        </p>

        <!-- Query Tags -->
        <div v-if="response.queryTags?.length" class="flex flex-wrap items-center gap-2 pt-1">
          <span class="text-xs text-slate-500 font-semibold">Tag Pencarian:</span>
          <span
            v-for="tag in response.queryTags"
            :key="tag"
            class="text-xs font-medium px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </div>

    <!-- Recommendations Grid -->
    <div>
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-bold text-white flex items-center gap-2">
          <span>Rekomendasi Pilihan Terbaik</span>
          <span class="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-emerald-400 border border-slate-700">
            {{ response.recommendations.length }} Tempat
          </span>
        </h3>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <RecommendationCard
          v-for="item in response.recommendations"
          :key="item.id"
          :item="item"
        />
      </div>
    </div>

    <!-- Suggested Follow-up Prompts -->
    <div v-if="response.suggestedFollowups?.length" class="glass-panel p-5 rounded-2xl border border-slate-800">
      <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
        <UIcon name="i-heroicons-chat-bubble-left-right" class="w-4 h-4 text-cyan-400" />
        <span>Pertanyaan Lanjutan AI</span>
      </h4>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="(followup, idx) in response.suggestedFollowups"
          :key="idx"
          type="button"
          @click="emit('followup', followup)"
          class="text-xs bg-slate-800/80 hover:bg-emerald-950/50 border border-slate-700 hover:border-emerald-500/40 text-slate-200 hover:text-emerald-300 px-3.5 py-2 rounded-xl text-left transition flex items-center gap-2"
        >
          <span>{{ followup }}</span>
          <UIcon name="i-heroicons-arrow-right" class="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        </button>
      </div>
    </div>
  </div>
</template>
