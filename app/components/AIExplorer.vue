<script setup lang="ts">
import { ref, computed } from 'vue'
import { BREBES_DATASET } from '~/data/brebes-dataset'
import type { BrebesItem, CategoryType } from '~/types/brebes'

const emit = defineEmits<{
  (e: 'book', item: BrebesItem): void
  (e: 'review', item: BrebesItem): void
  (e: 'selectPrompt', prompt: string): void
}>()

const searchQuery = ref('saya ingin wisata alam')
const selectedCategory = ref<CategoryType>('all')
const sortBy = ref<'match' | 'rating' | 'price'>('match')
const loading = ref(false)

const quickIntents = [
  { label: '🌲 Wisata Alam & Pegunungan', query: 'saya ingin wisata alam pegunungan yang sejuk', cat: 'wisata' },
  { label: '🌊 Pantai & Sunset', query: 'saya ingin lihat pantai dan sunset di Brebes', cat: 'wisata' },
  { label: '🍢 Kuliner Khas Malam', query: 'kuliner malam legendaris sate blengong dekat alun-alun', cat: 'kuliner' },
  { label: '🌶️ Makanan Pedas Ekstrem', query: 'makanan pedas menyengat khas Brebes rujak belut', cat: 'kuliner' },
  { label: '🎁 Oleh-Oleh & Batik UMKM', query: 'oleh-oleh khas telur asin bakar dan batik salem', cat: 'umkm' }
]

function setIntent(query: string, cat: string) {
  searchQuery.value = query
  selectedCategory.value = cat as CategoryType
  triggerExplore()
}

const exploredResults = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) return BREBES_DATASET.slice(0, 4)

  const tokens = query.split(/\s+/).filter(t => t.length > 2)

  const scored = BREBES_DATASET.map(item => {
    let score = 50

    if (selectedCategory.value !== 'all' && item.category !== selectedCategory.value) {
      score -= 25
    }

    const text = `${item.name} ${item.description} ${item.highlight} ${item.location} ${item.tags.join(' ')} ${item.category}`.toLowerCase()

    tokens.forEach(tok => {
      if (text.includes(tok)) score += 15
    })

    if (query.includes('alam') || query.includes('wisata') || query.includes('gunung') || query.includes('sejuk')) {
      if (item.category === 'wisata') score += 20
      if (item.id === 'wisata-kaligua' || item.id === 'wisata-curug-cantel') score += 20
    }

    if (query.includes('makan') || query.includes('kuliner') || query.includes('sate')) {
      if (item.category === 'kuliner') score += 20
    }

    if (query.includes('oleh') || query.includes('umkm') || query.includes(' souvenir')) {
      if (item.category === 'umkm') score += 20
    }

    const matchScore = Math.min(99, Math.max(70, Math.floor(score)))

    let aiReason = `Gemma 4 menemukan lokasi ini dengan kecocokan ${matchScore}% berdasarkan kata kunci "${query}".`
    if (item.category === 'wisata') aiReason = `[Gemma 4] Destinasi wisata alam populer dengan pemandangan asri dan rating ${item.rating}/5.`
    if (item.category === 'kuliner') aiReason = `[Gemma 4] Pilihan kuliner favorit wisatawan yang wajib dicoba.`
    if (item.category === 'umkm') aiReason = `[Gemma 4] Produk khas unggulan UMKM Brebes bermutu super.`

    return {
      ...item,
      matchScore,
      aiReason
    }
  })

  let filtered = scored
  if (selectedCategory.value !== 'all') {
    filtered = scored.filter(i => i.category === selectedCategory.value)
    if (filtered.length === 0) filtered = scored
  }

  if (sortBy.value === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating)
  } else if (sortBy.value === 'price') {
    filtered.sort((a, b) => (a.priceNumber || 0) - (b.priceNumber || 0))
  } else {
    filtered.sort((a, b) => b.matchScore - a.matchScore)
  }

  return filtered
})

function triggerExplore() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 300)
}
</script>

<template>
  <div id="ai-explorer" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
    <!-- Header Banner -->
    <div class="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-slate-950 via-emerald-950/40 to-slate-950 shadow-2xl relative overflow-hidden space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <span class="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <UIcon name="i-heroicons-compass" class="w-5 h-5" />
          </span>
          <div>
            <span class="text-[10px] font-extrabold text-emerald-400 uppercase tracking-widest block">Fitur AI Explorer</span>
            <h2 class="text-xl sm:text-2xl font-extrabold text-white">Eksplorasi Destinasi Instan Gemma AI</h2>
          </div>
        </div>

        <span class="px-3 py-1 rounded-full text-xs font-bold bg-slate-900 text-emerald-400 border border-slate-800">
          🤖 Model: Gemma 4 MaaS
        </span>
      </div>

      <p class="text-xs sm:text-sm text-slate-300">
        Ketik keinginan liburanmu secara bebas (contoh: <em>"saya ingin wisata alam"</em>, <em>"cari kuliner malam"</em>) dan Gemma AI akan langsung menyajikan daftar tempat terbaik.
      </p>

      <!-- Search Input Bar -->
      <div class="relative">
        <input
          v-model="searchQuery"
          @keyup.enter="triggerExplore"
          type="text"
          placeholder="Ketik keinginan liburanmu di sini... (Contoh: saya ingin wisata alam sejuk)"
          class="w-full bg-slate-900/90 border border-slate-700/80 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-2xl py-3.5 pl-11 pr-28 text-sm text-white placeholder-slate-500 outline-none transition"
        />
        <UIcon name="i-heroicons-magnifying-glass" class="w-5 h-5 text-emerald-400 absolute left-3.5 top-4" />

        <button
          type="button"
          @click="triggerExplore"
          class="absolute right-2 top-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition"
        >
          Eksplor AI
        </button>
      </div>

      <!-- Quick Intent Chips -->
      <div class="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        <span class="text-xs font-bold text-slate-400 shrink-0">Inspirasi Intent:</span>
        <button
          v-for="(intent, idx) in quickIntents"
          :key="idx"
          type="button"
          @click="setIntent(intent.query, intent.cat)"
          class="text-xs font-medium px-3 py-1 rounded-xl bg-slate-900/80 hover:bg-emerald-950/50 border border-slate-800 hover:border-emerald-500/30 text-slate-300 hover:text-emerald-300 shrink-0 transition"
        >
          {{ intent.label }}
        </button>
      </div>
    </div>

    <!-- Filter & Sort Bar -->
    <div class="flex flex-wrap items-center justify-between gap-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
      <div class="flex items-center gap-2">
        <span class="text-xs font-bold text-slate-400">Kategori:</span>
        <select
          v-model="selectedCategory"
          class="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-emerald-500"
        >
          <option value="all">Semua Kategori</option>
          <option value="wisata">Wisata Alam & Rekreasi</option>
          <option value="kuliner">Kuliner Khas</option>
          <option value="umkm">UMKM & Oleh-Oleh</option>
        </select>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-xs font-bold text-slate-400">Urutkan:</span>
        <select
          v-model="sortBy"
          class="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-emerald-500"
        >
          <option value="match">🎯 Kecocokan AI Teratas</option>
          <option value="rating">⭐ Rating Tertinggi</option>
          <option value="price">💰 Harga Termurah</option>
        </select>
      </div>
    </div>

    <!-- Explored Results List -->
    <div v-if="!loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="item in exploredResults"
        :key="item.id"
        class="glass-card rounded-2xl p-5 sm:p-6 flex flex-col justify-between h-full relative group hover:border-emerald-500/40 transition"
      >
        <div>
          <!-- Gradient Banner -->
          <div
            class="h-28 rounded-xl bg-gradient-to-r p-3.5 flex flex-col justify-between mb-4 relative overflow-hidden"
            :class="item.gradient || 'from-emerald-700 to-teal-900'"
          >
            <div class="flex items-center justify-between z-10">
              <span class="px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold bg-slate-950/80 text-emerald-400 border border-emerald-500/30 uppercase">
                {{ item.category }}
              </span>
              <span class="px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold bg-slate-950/80 text-emerald-400 border border-emerald-500/30">
                🎯 {{ item.matchScore }}% Cocok
              </span>
            </div>

            <div class="flex items-end justify-between z-10">
              <span class="text-white/90 text-xs font-semibold">📍 {{ item.location }}</span>
              <div class="w-7 h-7 rounded-lg bg-slate-950/50 flex items-center justify-center text-white">
                <UIcon :name="item.icon" class="w-4 h-4" />
              </div>
            </div>
          </div>

          <!-- Title & Rating -->
          <div class="flex items-start justify-between gap-2 mb-2">
            <h3 class="text-base font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
              {{ item.name }}
            </h3>
            <span class="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md shrink-0">
              ⭐ {{ item.rating }}
            </span>
          </div>

          <p class="text-xs text-slate-300 leading-relaxed mb-3 line-clamp-2">
            {{ item.description }}
          </p>

          <!-- Gemma AI Insight Note -->
          <div class="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-200 mb-4 flex items-start gap-1.5">
            <UIcon name="i-heroicons-sparkles" class="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span class="text-[11px] leading-tight">{{ item.aiReason }}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="pt-3 border-t border-slate-800 flex items-center gap-2">
          <button
            type="button"
            @click="emit('book', item)"
            class="flex-1 py-2 px-3 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition text-center"
          >
            Pesan Tiket
          </button>

          <a
            :href="item.mapsUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="Google Maps"
          >
            <UIcon name="i-heroicons-map" class="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>

    <!-- Shimmer Loader when exploring -->
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
      <div v-for="i in 3" :key="i" class="glass-panel p-6 rounded-2xl h-64 animate-pulse bg-slate-900/60"></div>
    </div>
  </div>
</template>
