<script setup lang="ts">
import { useBusinessData } from '~/composables/useBusinessData'
import { useBooking } from '~/composables/useBooking'

const { catalogItems, deleteItem } = useBusinessData()
const { userBookings } = useBooking()
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <!-- Header Banner -->
    <div class="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-950 shadow-2xl relative overflow-hidden">
      <div class="space-y-2">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold">
          <UIcon name="i-heroicons-chart-bar" class="w-4 h-4" />
          <span>Dashboard Executive Dinas Pariwisata & Pemda Brebes</span>
        </div>
        <h2 class="text-2xl sm:text-3xl font-bold text-white">Monitoring Pariwisata & Ekonomi Kreatif</h2>
        <p class="text-xs sm:text-sm text-slate-300">Pantau statistik kunjungan wisatawan, kontribusi UMKM, dan tren pencarian AI secara terpusat.</p>
      </div>
    </div>

    <!-- Government Executive Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-950/60">
        <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Wisatawan (Bulan Ini)</span>
        <span class="text-2xl font-extrabold text-cyan-400">42.850 Wisatawan</span>
      </div>
      <div class="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-950/60">
        <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Pendapatan Pariwisata</span>
        <span class="text-2xl font-extrabold text-emerald-400">Rp 1,28 Miliar</span>
      </div>
      <div class="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-950/60">
        <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">UMKM Terverifikasi</span>
        <span class="text-2xl font-extrabold text-amber-400">128 UMKM</span>
      </div>
      <div class="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-950/60">
        <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Prompt AI Terpopuler</span>
        <span class="text-xs font-bold text-slate-200 block truncate">"Wisata Sejuk & Sate Blengong"</span>
      </div>
    </div>

    <!-- Master Catalog Table -->
    <div class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-base font-bold text-white flex items-center gap-2">
          <UIcon name="i-heroicons-adjustments-horizontal" class="w-5 h-5 text-cyan-400" />
          <span>Kelola Master Data Pariwisata Brebes</span>
        </h3>
        <span class="text-xs text-slate-400 font-bold bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
          {{ catalogItems.length }} Item Terdaftar
        </span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-300">
          <thead class="bg-slate-900/80 text-slate-400 font-bold uppercase border-b border-slate-800">
            <tr>
              <th class="p-3">Nama Destinasi / UMKM</th>
              <th class="p-3">Kategori</th>
              <th class="p-3">Lokasi</th>
              <th class="p-3">Rating AI</th>
              <th class="p-3">Status Verifikasi</th>
              <th class="p-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60">
            <tr v-for="item in catalogItems" :key="item.id" class="hover:bg-slate-900/40 transition">
              <td class="p-3 font-bold text-white">{{ item.name }}</td>
              <td class="p-3 uppercase font-semibold text-cyan-400">{{ item.category }}</td>
              <td class="p-3 text-slate-400">{{ item.location }}</td>
              <td class="p-3 font-bold text-amber-400">⭐ {{ item.rating }}</td>
              <td class="p-3">
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  VERIFIED
                </span>
              </td>
              <td class="p-3 text-right">
                <button
                  type="button"
                  @click="deleteItem(item.id)"
                  class="px-2.5 py-1 rounded-lg bg-rose-950/40 text-rose-400 hover:bg-rose-900 border border-rose-500/30 transition"
                >
                  Hapus
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
