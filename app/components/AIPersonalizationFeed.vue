<script setup lang="ts">
import { computed } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { BREBES_DATASET } from '~/data/brebes-dataset'
import type { BrebesItem } from '~/types/brebes'

const emit = defineEmits<{
  (e: 'selectItem', item: BrebesItem): void
  (e: 'openBooking', item: BrebesItem): void
}>()

const { currentUser } = useAuth()

const personalizedItems = computed(() => {
  const tags = currentUser.value?.personaTags || ['Pegunungan', 'Sejuk', 'Legendaris']
  return BREBES_DATASET.filter(item =>
    item.tags.some(t => tags.some(pt => t.toLowerCase().includes(pt.toLowerCase())))
  ).slice(0, 3)
})
</script>

<template>
  <div v-if="currentUser" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
    <div class="glass-panel p-5 rounded-2xl border border-emerald-500/20 bg-slate-950/40 space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div class="flex items-center gap-2">
          <span class="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <UIcon name="i-heroicons-user" class="w-4 h-4" />
          </span>
          <div>
            <h4 class="text-xs font-bold text-white">Rekomendasi Terpersonalisasi Untuk {{ currentUser.name }}</h4>
            <p class="text-[10px] text-slate-400">Disesuaikan berdasarkan preferensi persona Anda</p>
          </div>
        </div>

        <div class="flex flex-wrap gap-1">
          <span
            v-for="tag in currentUser.personaTags"
            :key="tag"
            class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-emerald-300 border border-slate-700"
          >
            ✨ {{ tag }}
          </span>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div
          v-for="item in personalizedItems"
          :key="item.id"
          class="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-emerald-500/40 transition flex items-center justify-between gap-2"
        >
          <div class="min-w-0">
            <h5 class="text-xs font-bold text-white truncate">{{ item.name }}</h5>
            <span class="text-[10px] text-slate-400 truncate block">{{ item.location }} • ⭐ {{ item.rating }}</span>
          </div>

          <button
            type="button"
            @click="emit('openBooking', item)"
            class="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500 hover:text-slate-950 transition shrink-0"
          >
            Pesan Tiket
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
