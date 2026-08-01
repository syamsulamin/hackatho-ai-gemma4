<script setup lang="ts">
import { useBooking } from '~/composables/useBooking'

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { userBookings } = useBooking()
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
    <div class="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/30 shadow-2xl max-w-lg w-full relative bg-slate-900/95 max-h-[90vh] overflow-y-auto custom-scrollbar space-y-6">
      <!-- Close Button -->
      <button
        type="button"
        @click="emit('close')"
        class="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
      >
        <UIcon name="i-heroicons-x-mark" class="w-5 h-5" />
      </button>

      <!-- Header -->
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
          <UIcon name="i-heroicons-ticket" class="w-5 h-5" />
        </div>
        <div>
          <span class="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">E-Tiket & Pesanan Saya</span>
          <h3 class="text-lg font-bold text-white">Daftar Reservasi Aktif</h3>
        </div>
      </div>

      <!-- Bookings List -->
      <div class="space-y-4">
        <div
          v-for="b in userBookings"
          :key="b.id"
          class="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 text-xs space-y-3"
        >
          <div class="flex items-center justify-between border-b border-slate-800 pb-2">
            <div>
              <span class="text-[10px] text-slate-500 font-bold uppercase block">Kode Booking</span>
              <span class="font-mono font-extrabold text-emerald-400">{{ b.bookingCode }}</span>
            </div>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              LUNAS / PAID
            </span>
          </div>

          <div class="flex items-center gap-3">
            <img :src="b.qrCodeUrl" alt="QR Code" class="w-20 h-24 rounded-lg bg-white p-1 border border-white/20 shrink-0" />
            <div class="space-y-1">
              <h4 class="font-bold text-white text-sm">{{ b.itemName }}</h4>
              <p class="text-slate-400">📅 Kunjungan: {{ b.date }}</p>
              <p class="text-slate-400">🎟️ Jumlah: {{ b.quantity }} Tiket/Porsi</p>
              <p class="text-emerald-400 font-bold">💰 Total: Rp {{ b.totalPrice.toLocaleString('id-ID') }}</p>
            </div>
          </div>
        </div>

        <div v-if="userBookings.length === 0" class="text-center py-6 text-xs text-slate-500">
          Belum ada riwayat booking. Pilih destinasi wisata atau kuliner untuk pesan tiket online!
        </div>
      </div>
    </div>
  </div>
</template>
