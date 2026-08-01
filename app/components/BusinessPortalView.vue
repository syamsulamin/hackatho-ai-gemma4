<script setup lang="ts">
import { ref } from 'vue'
import { useBusinessData } from '~/composables/useBusinessData'
import { useBooking } from '~/composables/useBooking'
import type { BrebesItem } from '~/types/brebes'

const { catalogItems, addItem, deleteItem } = useBusinessData()
const { userBookings } = useBooking()

const isAddModalOpen = ref(false)
const newItemName = ref('')
const newItemCategory = ref<'wisata' | 'kuliner' | 'umkm'>('kuliner')
const newItemPrice = ref('Rp 25.000')
const newItemLocation = ref('Brebes Kota')
const newItemDesc = ref('')

function handleCreateItem() {
  if (!newItemName.value.trim()) return
  addItem({
    name: newItemName.value.trim(),
    category: newItemCategory.value,
    rating: 4.8,
    reviewsCount: 1,
    location: newItemLocation.value,
    priceRange: newItemPrice.value,
    priceNumber: 25000,
    tags: ['Baru', 'UMKM', 'Brebes'],
    description: newItemDesc.value || 'Produk unggulan kuliner/UMKM khas Brebes.',
    highlight: 'Kualitas terbaik produk UMKM lokal Brebes',
    address: 'Kecamatan Brebes, Kabupaten Brebes',
    mapsUrl: 'https://maps.google.com/?q=Brebes',
    icon: 'i-heroicons-shopping-bag',
    gradient: 'from-amber-600 to-orange-800'
  })
  newItemName.value = ''
  newItemDesc.value = ''
  isAddModalOpen.value = false
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <!-- Header Banner -->
    <div class="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 shadow-2xl relative overflow-hidden flex flex-wrap items-center justify-between gap-4">
      <div class="space-y-2 max-w-2xl">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
          <UIcon name="i-heroicons-building-storefront" class="w-4 h-4" />
          <span>Portal Pelaku UMKM & Pengelola Wisata</span>
        </div>
        <h2 class="text-2xl sm:text-3xl font-bold text-white">Kelola Produk & Reservasi Usaha Anda</h2>
        <p class="text-xs sm:text-sm text-slate-300">Tambahkan produk UMKM baru, atur harga, dan pantau pesanan masuk secara real-time.</p>
      </div>

      <button
        type="button"
        @click="isAddModalOpen = true"
        class="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition flex items-center gap-2"
      >
        <UIcon name="i-heroicons-plus" class="w-4 h-4" />
        <span>Tambah Produk / Destinasi</span>
      </button>
    </div>

    <!-- Overview Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-950/60">
        <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Produk/Destinasi</span>
        <span class="text-2xl font-extrabold text-white">{{ catalogItems.length }} Listing</span>
      </div>
      <div class="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-950/60">
        <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Pesanan / Tiket Terjual</span>
        <span class="text-2xl font-extrabold text-emerald-400">{{ userBookings.length }} Order</span>
      </div>
      <div class="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-950/60">
        <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Omset Penjualan</span>
        <span class="text-2xl font-extrabold text-amber-400">Rp {{ userBookings.reduce((sum, b) => sum + b.totalPrice, 0).toLocaleString('id-ID') }}</span>
      </div>
      <div class="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-950/60">
        <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Rating Rata-rata</span>
        <span class="text-2xl font-extrabold text-cyan-400">⭐ 4.8 / 5.0</span>
      </div>
    </div>

    <!-- Catalog Management Table -->
    <div class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
      <h3 class="text-base font-bold text-white flex items-center gap-2">
        <UIcon name="i-heroicons-queue-list" class="w-5 h-5 text-amber-400" />
        <span>Katalog Usaha Anda</span>
      </h3>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-300">
          <thead class="bg-slate-900/80 text-slate-400 font-bold uppercase border-b border-slate-800">
            <tr>
              <th class="p-3">Nama Produk/Tempat</th>
              <th class="p-3">Kategori</th>
              <th class="p-3">Harga</th>
              <th class="p-3">Lokasi</th>
              <th class="p-3">Rating</th>
              <th class="p-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60">
            <tr v-for="item in catalogItems" :key="item.id" class="hover:bg-slate-900/40 transition">
              <td class="p-3 font-bold text-white">{{ item.name }}</td>
              <td class="p-3 uppercase font-semibold text-amber-400">{{ item.category }}</td>
              <td class="p-3">{{ item.priceRange }}</td>
              <td class="p-3 text-slate-400">{{ item.location }}</td>
              <td class="p-3 font-bold text-amber-400">⭐ {{ item.rating }}</td>
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

    <!-- Add Item Modal -->
    <div v-if="isAddModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div class="glass-panel p-6 rounded-3xl border border-amber-500/30 shadow-2xl max-w-md w-full relative bg-slate-900 space-y-4">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 class="text-base font-bold text-white">Tambah Produk / Destinasi Baru</h3>
          <button type="button" @click="isAddModalOpen = false" class="text-slate-400 hover:text-white">✕</button>
        </div>

        <div class="space-y-3 text-xs">
          <div>
            <label class="block font-bold text-slate-400 mb-1">Nama Usaha/Produk</label>
            <input v-model="newItemName" type="text" placeholder="Contoh: Sate Blengong Mas Yanto" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-amber-500" />
          </div>

          <div>
            <label class="block font-bold text-slate-400 mb-1">Kategori</label>
            <select v-model="newItemCategory" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white outline-none">
              <option value="wisata">Wisata Alam</option>
              <option value="kuliner">Kuliner Khas</option>
              <option value="umkm">UMKM & Oleh-oleh</option>
            </select>
          </div>

          <div>
            <label class="block font-bold text-slate-400 mb-1">Kisaran Harga</label>
            <input v-model="newItemPrice" type="text" placeholder="Rp 15.000 - Rp 30.000" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-amber-500" />
          </div>

          <div>
            <label class="block font-bold text-slate-400 mb-1">Deskripsi Singkat</label>
            <textarea v-model="newItemDesc" rows="2" placeholder="Jelaskan keunikan usaha kamu..." class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white outline-none resize-none"></textarea>
          </div>
        </div>

        <button @click="handleCreateItem" type="button" class="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition">
          Simpan Produk Baru ✨
        </button>
      </div>
    </div>
  </div>
</template>
