<script setup lang="ts">
import { ref, computed } from 'vue'
import type { BrebesItem } from '~/types/brebes'

const props = defineProps<{
  items: BrebesItem[]
}>()

const selectedItem = ref<BrebesItem | null>(props.items[0] || null)

const mapEmbedUrl = computed(() => {
  if (!selectedItem.value) return 'https://maps.google.com/maps?q=-6.8698,109.0425&z=12&output=embed'
  const coords = selectedItem.value.coordinates || { lat: -6.8698, lng: 109.0425 }
  return `https://maps.google.com/maps?q=${coords.lat},${coords.lng}&z=14&output=embed`
})

function selectLocation(item: BrebesItem) {
  selectedItem.value = item
}

function getCategoryColor(category: string) {
  switch (category) {
    case 'wisata':
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    case 'kuliner':
      return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    case 'umkm':
      return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    default:
      return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
  }
}
</script>

<template>
  <div class="glass-panel p-5 sm:p-7 rounded-2xl border border-emerald-500/30 shadow-2xl bg-slate-950/70">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-3 mb-5 border-b border-slate-800/80 pb-4">
      <div class="flex items-center gap-2">
        <span class="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <UIcon name="i-heroicons-map" class="w-5 h-5" />
        </span>
        <div>
          <h3 class="text-lg font-bold text-white leading-tight">Peta Interaktif Wisata & Rekomendasi Brebes</h3>
          <p class="text-xs text-slate-400">Klik nama tempat untuk memfokuskan lokasi di peta interaktif</p>
        </div>
      </div>

      <span class="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
        📍 {{ items.length }} Titik Terdaftar
      </span>
    </div>

    <!-- Main Grid: Sidebar + Embed Map -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      <!-- Location List Sidebar -->
      <div class="lg:col-span-5 space-y-2.5 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
        <div
          v-for="item in items"
          :key="item.id"
          @click="selectLocation(item)"
          class="p-3.5 rounded-xl border transition cursor-pointer flex items-start gap-3"
          :class="[
            selectedItem?.id === item.id
              ? 'bg-emerald-950/40 border-emerald-500/50 shadow-md shadow-emerald-500/10'
              : 'bg-slate-900/60 hover:bg-slate-800/60 border-slate-800/80'
          ]"
        >
          <div class="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
            <UIcon :name="item.icon || 'i-heroicons-map-pin'" class="w-4 h-4" />
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-1 mb-1">
              <h4 class="text-xs font-bold text-white truncate" :class="{ 'text-emerald-300': selectedItem?.id === item.id }">
                {{ item.name }}
              </h4>
              <span class="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                ⭐ {{ item.rating }}
              </span>
            </div>

            <p class="text-[11px] text-slate-400 truncate mb-1.5">
              {{ item.location }}
            </p>

            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="text-[10px] font-semibold px-2 py-0.5 rounded border" :class="getCategoryColor(item.category)">
                {{ item.category.toUpperCase() }}
              </span>
              <span class="text-[10px] text-slate-500">
                💰 {{ item.priceRange }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Interactive Embedded Map -->
      <div class="lg:col-span-7 flex flex-col h-full min-h-[350px] lg:min-h-[420px] rounded-xl overflow-hidden border border-slate-800 relative bg-slate-900">
        <iframe
          :src="mapEmbedUrl"
          width="100%"
          height="100%"
          style="border: 0; filter: contrast(1.05) saturate(1.1);"
          allowfullscreen
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          class="w-full h-full min-h-[350px]"
        ></iframe>

        <!-- Selected Location Details Overlay Banner at Bottom -->
        <div v-if="selectedItem" class="p-3.5 bg-slate-950/90 backdrop-blur-md border-t border-slate-800 flex items-center justify-between gap-2">
          <div class="min-w-0">
            <span class="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Lokasi Aktif Peta</span>
            <h4 class="text-xs font-bold text-white truncate">{{ selectedItem.name }}</h4>
            <p class="text-[11px] text-slate-400 truncate">{{ selectedItem.address }}</p>
          </div>

          <a
            :href="selectedItem.mapsUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-400 hover:bg-emerald-300 text-slate-950 flex items-center gap-1 shrink-0 transition"
          >
            <span>Buka Maps</span>
            <UIcon name="i-heroicons-arrow-top-right-on-square" class="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
