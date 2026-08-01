<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import type { UserRole } from '~/types/brebes'

const { isAuthModalOpen, closeAuthModal, loginAs } = useAuth()

function handleSelectRole(role: UserRole) {
  loginAs(role)
}
</script>

<template>
  <div v-if="isAuthModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
    <div class="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/30 shadow-2xl max-w-md w-full relative bg-slate-900/95 space-y-6">
      <!-- Close Button -->
      <button
        type="button"
        @click="closeAuthModal"
        class="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
      >
        <UIcon name="i-heroicons-x-mark" class="w-5 h-5" />
      </button>

      <!-- Modal Header -->
      <div class="text-center space-y-2">
        <div class="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
          <UIcon name="i-heroicons-user-circle" class="w-7 h-7" />
        </div>
        <h3 class="text-xl font-bold text-white">Masuk Akun Brebes Go AI</h3>
        <p class="text-xs text-slate-400">Pilih simulasi peran akun untuk mencoba seluruh fitur aplikasi</p>
      </div>

      <!-- Role Selection Cards -->
      <div class="space-y-3">
        <div
          @click="handleSelectRole('tourist')"
          class="p-4 rounded-2xl border border-slate-800 hover:border-emerald-500/50 bg-slate-950/60 hover:bg-emerald-950/30 transition cursor-pointer flex items-center gap-3 group"
        >
          <div class="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <UIcon name="i-heroicons-globe-alt" class="w-5 h-5" />
          </div>
          <div>
            <h4 class="text-sm font-bold text-white group-hover:text-emerald-300">Wisatawan / Pengunjung</h4>
            <p class="text-xs text-slate-400">Cari rekomendasi, susun itinerary, pesan tiket & simpan favorit.</p>
          </div>
        </div>

        <div
          @click="handleSelectRole('business')"
          class="p-4 rounded-2xl border border-slate-800 hover:border-amber-500/50 bg-slate-950/60 hover:bg-amber-950/30 transition cursor-pointer flex items-center gap-3 group"
        >
          <div class="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <UIcon name="i-heroicons-building-storefront" class="w-5 h-5" />
          </div>
          <div>
            <h4 class="text-sm font-bold text-white group-hover:text-amber-300">Pemilik UMKM & Pengelola Wisata</h4>
            <p class="text-xs text-slate-400">Atur produk/tempat, atur harga, lihat pesanan masuk & analitik.</p>
          </div>
        </div>

        <div
          @click="handleSelectRole('admin')"
          class="p-4 rounded-2xl border border-slate-800 hover:border-cyan-500/50 bg-slate-950/60 hover:bg-cyan-950/30 transition cursor-pointer flex items-center gap-3 group"
        >
          <div class="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <UIcon name="i-heroicons-chart-bar" class="w-5 h-5" />
          </div>
          <div>
            <h4 class="text-sm font-bold text-white group-hover:text-cyan-300">Admin Pemda & Dinas Pariwisata</h4>
            <p class="text-xs text-slate-400">Monitoring data pariwisata, CRUD katalog Brebes, & laporan tren AI.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
