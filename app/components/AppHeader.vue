<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import { useI18n } from '~/composables/useI18n'
import type { LocaleType } from '~/types/brebes'

const props = defineProps<{
  activeView: 'tourist' | 'business' | 'admin'
}>()

const emit = defineEmits<{
  (e: 'changeView', view: 'tourist' | 'business' | 'admin'): void
  (e: 'openBookings'): void
}>()

const { currentUser, isAuthenticated, openAuthModal, logout } = useAuth()
const { currentLocale, setLocale, t } = useI18n()

const locales: { code: LocaleType; label: string; flag: string }[] = [
  { code: 'id', label: 'ID', flag: '🇮🇩' },
  { code: 'jv', label: 'Brebesan', flag: '🏴' },
  { code: 'en', label: 'EN', flag: '🇬🇧' }
]
</script>

<template>
  <header class="sticky top-0 z-50 glass-panel border-b border-slate-800/80 backdrop-blur-xl">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
      <!-- Logo & Brand -->
      <div class="flex items-center gap-3 shrink-0 cursor-pointer" @click="emit('changeView', 'tourist')">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20">
          <div class="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <UIcon name="i-heroicons-sparkles" class="w-5 h-5 text-emerald-400" />
          </div>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <span class="font-extrabold text-lg sm:text-xl tracking-tight text-white">Brebes<span class="gradient-text-emerald">Go AI</span></span>
            <span class="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Gemma 4
            </span>
          </div>
          <p class="text-[10px] text-slate-400 hidden sm:block">Wisata, Kuliner & UMKM Kabupaten Brebes</p>
        </div>
      </div>

      <!-- Center Navigation Tabs: Tourist vs Business vs Admin -->
      <div class="hidden lg:flex items-center p-1 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-bold">
        <button
          type="button"
          @click="emit('changeView', 'tourist')"
          class="px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5"
          :class="activeView === 'tourist' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'"
        >
          <UIcon name="i-heroicons-globe-alt" class="w-4 h-4" />
          <span>Wisatawan</span>
        </button>

        <button
          type="button"
          @click="emit('changeView', 'business')"
          class="px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5"
          :class="activeView === 'business' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'"
        >
          <UIcon name="i-heroicons-building-storefront" class="w-4 h-4" />
          <span>Portal UMKM</span>
        </button>

        <button
          type="button"
          @click="emit('changeView', 'admin')"
          class="px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5"
          :class="activeView === 'admin' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'"
        >
          <UIcon name="i-heroicons-chart-bar" class="w-4 h-4" />
          <span>Dashboard Pemda</span>
        </button>
      </div>

      <!-- Right Header Actions: i18n + Bookings + Auth Profile -->
      <div class="flex items-center gap-2">
        <!-- i18n Language Picker -->
        <div class="flex items-center bg-slate-900/90 border border-slate-800 rounded-xl p-0.5 text-xs font-semibold">
          <button
            v-for="loc in locales"
            :key="loc.code"
            type="button"
            @click="setLocale(loc.code)"
            class="px-2 py-1 rounded-lg transition text-[11px]"
            :class="currentLocale === loc.code ? 'bg-slate-800 text-emerald-400 font-bold border border-slate-700' : 'text-slate-400 hover:text-slate-200'"
          >
            <span>{{ loc.flag }}</span>
            <span class="ml-1 hidden sm:inline">{{ loc.label }}</span>
          </button>
        </div>

        <!-- My Bookings Button -->
        <button
          type="button"
          @click="emit('openBookings')"
          class="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-emerald-400 text-xs font-bold transition flex items-center gap-1.5"
          title="Tiket & Pesanan Saya"
        >
          <UIcon name="i-heroicons-ticket" class="w-4 h-4" />
          <span class="hidden sm:inline">Tiket Saya</span>
        </button>

        <!-- User Profile or Login Button -->
        <div v-if="isAuthenticated && currentUser" class="flex items-center gap-2 pl-1 border-l border-slate-800">
          <img
            :src="currentUser.avatar"
            :alt="currentUser.name"
            class="w-8 h-8 rounded-full border border-emerald-500/40 object-cover"
          />
          <div class="hidden md:block text-left text-xs">
            <span class="font-bold text-white block truncate max-w-[110px]">{{ currentUser.name }}</span>
            <span class="text-[10px] uppercase font-extrabold text-emerald-400 block">{{ currentUser.role }}</span>
          </div>
          <button
            type="button"
            @click="logout"
            class="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/50 text-slate-400 hover:text-rose-400 border border-slate-700 transition"
            title="Keluar"
          >
            <UIcon name="i-heroicons-arrow-right-on-rectangle" class="w-4 h-4" />
          </button>
        </div>

        <button
          v-else
          type="button"
          @click="openAuthModal('login')"
          class="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition"
        >
          Masuk / Daftar
        </button>
      </div>
    </div>
  </header>
</template>
