<script setup lang="ts">
import type { ItineraryDay } from '~/types/brebes'

defineProps<{
  days: ItineraryDay[]
}>()
</script>

<template>
  <div class="glass-panel p-5 sm:p-7 rounded-2xl border border-cyan-500/30 shadow-2xl bg-slate-950/60 space-y-6">
    <!-- Section Header -->
    <div class="flex items-center justify-between border-b border-slate-800 pb-4">
      <div class="flex items-center gap-2.5">
        <span class="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
          <UIcon name="i-heroicons-calendar" class="w-5 h-5" />
        </span>
        <div>
          <h3 class="text-lg font-bold text-white leading-tight">Rencana Itinerary Liburan Gemma 4</h3>
          <p class="text-xs text-slate-400">Rute teratur & efisien waktu disusun cerdas oleh AI</p>
        </div>
      </div>

      <span class="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
        🗓️ Total {{ days.length }} Hari
      </span>
    </div>

    <!-- Timeline Per Day -->
    <div v-for="day in days" :key="day.dayNumber" class="space-y-4">
      <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-950 to-slate-900 border border-cyan-500/30 text-cyan-300 font-bold text-xs">
        <UIcon name="i-heroicons-clock" class="w-4 h-4 text-cyan-400" />
        <span>{{ day.dayTitle }}</span>
      </div>

      <!-- Slots Vertical Timeline -->
      <div class="relative pl-6 space-y-6 border-l-2 border-slate-800 ml-3">
        <div
          v-for="(slot, idx) in day.slots"
          :key="idx"
          class="relative group"
        >
          <!-- Timeline Pin Circle -->
          <div class="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-cyan-400 group-hover:bg-cyan-400 group-hover:scale-125 transition"></div>

          <!-- Slot Card -->
          <div class="bg-slate-900/80 hover:bg-slate-900 p-4 rounded-xl border border-slate-800/80 transition space-y-2">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <span class="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                ⏰ {{ slot.time }}
              </span>

              <span v-if="slot.estimatedCost" class="text-xs font-semibold text-emerald-400">
                🏷️ {{ slot.estimatedCost }}
              </span>
            </div>

            <h4 class="text-sm font-bold text-white flex items-center gap-1.5">
              <span>{{ slot.title }}</span>
              <span class="text-slate-400 text-xs font-normal">({{ slot.locationName }})</span>
            </h4>

            <p class="text-xs text-slate-300 leading-relaxed">
              {{ slot.activity }}
            </p>

            <div v-if="slot.tips" class="text-[11px] text-amber-300 bg-amber-950/20 border border-amber-500/20 p-2 rounded-lg flex items-center gap-1.5">
              <UIcon name="i-heroicons-light-bulb" class="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span><strong>Tips AI:</strong> {{ slot.tips }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
