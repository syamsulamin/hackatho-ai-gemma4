<script setup lang="ts">
import { ref } from 'vue'
import type { BrebesItem } from '~/types/brebes'
import { useAuth } from '~/composables/useAuth'

const props = defineProps<{
  item: BrebesItem
}>()

const emit = defineEmits<{
  (e: 'book', item: BrebesItem): void
  (e: 'review', item: BrebesItem): void
}>()

const { isFavorite, toggleFavorite } = useAuth()
const copied = ref(false)

function copyInfo() {
  const text = `📌 ${props.item.name} (${props.item.location})\n⭐ Rating: ${props.item.rating}\n💰 Price: ${props.item.priceRange}\n💡 Info: ${props.item.description}\n📍 Maps: ${props.item.mapsUrl}`
  navigator.clipboard.writeText(text)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}

function getCategoryColor(category: string) {
  switch (category) {
    case 'wisata':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    case 'kuliner':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    case 'umkm':
      return 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    default:
      return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
  }
}

function getCategoryLabel(category: string) {
  switch (category) {
    case 'wisata':
      return 'Wisata Alam'
    case 'kuliner':
      return 'Kuliner Legendaris'
    case 'umkm':
      return 'UMKM & Oleh-Oleh'
    default:
      return 'Rekomendasi'
  }
}
</script>

<template>
  <div class="glass-card rounded-2xl p-5 sm:p-6 flex flex-col justify-between h-full relative group">
    <div>
      <!-- Card Banner / Gradient Banner -->
      <div
        class="h-28 sm:h-32 rounded-xl bg-gradient-to-r p-4 flex flex-col justify-between mb-4 relative overflow-hidden shadow-inner"
        :class="item.gradient || 'from-emerald-700 to-teal-900'"
      >
        <div class="flex items-center justify-between z-10">
          <span
            class="px-2.5 py-1 rounded-lg text-xs font-bold border backdrop-blur-md uppercase tracking-wider"
            :class="getCategoryColor(item.category)"
          >
            {{ getCategoryLabel(item.category) }}
          </span>

          <div class="flex items-center gap-1.5 z-10">
            <button
              type="button"
              @click="toggleFavorite(item.id)"
              class="w-7 h-7 rounded-lg bg-slate-950/80 hover:bg-slate-900 backdrop-blur-md border border-white/20 flex items-center justify-center text-rose-400 transition"
              :title="isFavorite(item.id) ? 'Hapus Favorit' : 'Tambah Favorit'"
            >
              <UIcon :name="isFavorite(item.id) ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'" class="w-4 h-4 text-rose-400" />
            </button>

            <span
              v-if="item.matchScore"
              class="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-950/80 text-emerald-400 border border-emerald-500/30 shadow-md"
            >
              🎯 {{ item.matchScore }}% Cocok
            </span>
          </div>
        </div>

        <div class="flex items-end justify-between z-10">
          <div class="text-white/90 text-xs font-semibold flex items-center gap-1">
            <UIcon name="i-heroicons-map-pin" class="w-3.5 h-3.5 text-emerald-300" />
            <span>{{ item.location }}</span>
          </div>

          <div class="w-8 h-8 rounded-lg bg-slate-950/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white">
            <UIcon :name="item.icon" class="w-4 h-4" />
          </div>
        </div>
      </div>

      <!-- Title & Rating -->
      <div class="flex items-start justify-between gap-2 mb-2">
        <h3 class="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
          {{ item.name }}
        </h3>
        <button
          type="button"
          @click="emit('review', item)"
          class="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md text-amber-400 text-xs font-extrabold shrink-0 hover:bg-amber-500/20 transition"
        >
          <span>⭐ {{ item.rating }}</span>
        </button>
      </div>

      <!-- Highlight Quote -->
      <p class="text-xs font-semibold text-emerald-400 mb-3 line-clamp-1 italic">
        "{{ item.highlight }}"
      </p>

      <!-- Description -->
      <p class="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4 line-clamp-3">
        {{ item.description }}
      </p>

      <!-- Metadata Attributes -->
      <div class="space-y-1.5 text-xs text-slate-400 mb-4 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div class="flex items-center justify-between">
          <span class="text-slate-500">Estimasi Biaya:</span>
          <span class="font-semibold text-slate-200">{{ item.priceRange }}</span>
        </div>
        <div v-if="item.bestTime" class="flex items-center justify-between">
          <span class="text-slate-500">Waktu Terbaik:</span>
          <span class="font-semibold text-slate-200">{{ item.bestTime }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-slate-500">Alamat:</span>
          <span class="font-medium text-slate-300 truncate max-w-[180px]">{{ item.address }}</span>
        </div>
      </div>

      <!-- AI Note Callout Box -->
      <div v-if="item.aiNote" class="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-200 mb-4 flex items-start gap-2">
        <UIcon name="i-heroicons-light-bulb" class="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span class="font-bold text-emerald-300 block mb-0.5">Catatan Gemma AI:</span>
          <span>{{ item.aiNote }}</span>
        </div>
      </div>

      <!-- Tags -->
      <div class="flex flex-wrap gap-1.5 mb-5">
        <span
          v-for="tag in item.tags"
          :key="tag"
          class="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-400 border border-slate-700/50"
        >
          #{{ tag }}
        </span>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="pt-3 border-t border-slate-800/80 flex items-center gap-2 flex-wrap">
      <button
        type="button"
        @click="emit('book', item)"
        class="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition shadow-md shadow-emerald-500/20 shrink-0"
      >
        <UIcon name="i-heroicons-ticket" class="w-4 h-4" />
        <span>Pesan Tiket</span>
      </button>

      <a
        :href="item.mapsUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center justify-center p-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
        title="Buka Google Maps"
      >
        <UIcon name="i-heroicons-map" class="w-4 h-4" />
      </a>

      <button
        type="button"
        @click="copyInfo"
        class="inline-flex items-center justify-center p-2 rounded-xl text-xs font-semibold border transition"
        :class="copied ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'"
        :title="copied ? 'Tersalin!' : 'Salin Info'"
      >
        <UIcon :name="copied ? 'i-heroicons-check' : 'i-heroicons-clipboard-document'" class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>
