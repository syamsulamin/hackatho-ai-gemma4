<script setup lang="ts">
import { useBooking } from '~/composables/useBooking'
import type { PaymentMethod } from '~/types/brebes'

const {
  isBookingModalOpen,
  selectedItemForBooking,
  bookingQuantity,
  bookingDate,
  selectedPaymentMethod,
  isCheckoutSuccess,
  lastBookingCreated,
  closeBookingModal,
  processPayment
} = useBooking()

const paymentMethods: { id: PaymentMethod; label: string; icon: string; provider: string }[] = [
  { id: 'qris', label: 'QRIS Instant', icon: 'i-heroicons-qr-code', provider: 'BCA, Mandiri, BRI, All Bank' },
  { id: 'gopay', label: 'GoPay', icon: 'i-heroicons-device-phone-mobile', provider: 'GoTo Financial' },
  { id: 'ovo', label: 'OVO', icon: 'i-heroicons-credit-card', provider: 'OVO Cash' },
  { id: 'shopeepay', label: 'ShopeePay', icon: 'i-heroicons-shopping-bag', provider: 'Shopee' },
  { id: 'bank_transfer', label: 'Transfer Bank (VA)', icon: 'i-heroicons-building-library', provider: 'Virtual Account' }
]
</script>

<template>
  <div v-if="isBookingModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
    <div class="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/30 shadow-2xl max-w-lg w-full relative bg-slate-900/95 max-h-[90vh] overflow-y-auto custom-scrollbar space-y-6">
      <!-- Close Button -->
      <button
        type="button"
        @click="closeBookingModal"
        class="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
      >
        <UIcon name="i-heroicons-x-mark" class="w-5 h-5" />
      </button>

      <!-- SUCCESS STATE: E-TICKET VOUCHER -->
      <div v-if="isCheckoutSuccess && lastBookingCreated" class="text-center space-y-5 py-2">
        <div class="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 mx-auto animate-bounce">
          <UIcon name="i-heroicons-check-circle" class="w-10 h-10" />
        </div>

        <div>
          <span class="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-1">Pembayaran Berhasil!</span>
          <h3 class="text-2xl font-extrabold text-white">E-Tiket & Bukti Booking Terbit</h3>
          <p class="text-xs text-slate-400">Tunjukkan QR Code ini kepada petugas di lokasi</p>
        </div>

        <!-- Voucher Ticket Card -->
        <div class="p-5 rounded-2xl bg-slate-950 border border-emerald-500/30 text-left space-y-4 relative overflow-hidden">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span class="text-[10px] text-slate-500 font-bold uppercase block">Kode Booking</span>
              <span class="text-sm font-mono font-extrabold text-emerald-400">{{ lastBookingCreated.bookingCode }}</span>
            </div>
            <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              LUNAS / PAID
            </span>
          </div>

          <div class="flex items-center gap-4">
            <img :src="lastBookingCreated.qrCodeUrl" alt="QR Code Booking" class="w-24 h-24 rounded-xl border border-white/20 shrink-0 bg-white p-1" />
            <div class="space-y-1 text-xs">
              <h4 class="font-bold text-white leading-tight">{{ lastBookingCreated.itemName }}</h4>
              <p class="text-slate-400">📅 Tanggal: {{ lastBookingCreated.date }}</p>
              <p class="text-slate-400">🎟️ Jumlah: {{ lastBookingCreated.quantity }} Tiket/Porsi</p>
              <p class="text-emerald-400 font-bold">💰 Total: Rp {{ lastBookingCreated.totalPrice.toLocaleString('id-ID') }}</p>
            </div>
          </div>
        </div>

        <button
          type="button"
          @click="closeBookingModal"
          class="w-full py-3 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition shadow-lg shadow-emerald-500/20"
        >
          Selesai & Simpan E-Tiket
        </button>
      </div>

      <!-- FORM STATE: RESERVATION & PAYMENT METHOD -->
      <div v-else-if="selectedItemForBooking" class="space-y-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <UIcon name="i-heroicons-ticket" class="w-5 h-5" />
          </div>
          <div>
            <span class="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Reservasi & Booking Online</span>
            <h3 class="text-lg font-bold text-white">{{ selectedItemForBooking.name }}</h3>
          </div>
        </div>

        <!-- Quantity & Date Pickers -->
        <div class="grid grid-cols-2 gap-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
          <div>
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tanggal Kunjungan</label>
            <input
              type="date"
              v-model="bookingDate"
              class="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Jumlah Tiket/Porsi</label>
            <div class="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl p-1">
              <button
                type="button"
                @click="bookingQuantity = Math.max(1, bookingQuantity - 1)"
                class="w-7 h-7 rounded-lg bg-slate-800 text-white font-bold flex items-center justify-center hover:bg-slate-700"
              >
                -
              </button>
              <span class="flex-1 text-center text-xs font-bold text-white">{{ bookingQuantity }}</span>
              <button
                type="button"
                @click="bookingQuantity++"
                class="w-7 h-7 rounded-lg bg-slate-800 text-white font-bold flex items-center justify-center hover:bg-slate-700"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <!-- Payment Method Selection -->
        <div>
          <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Pilih Metode Pembayaran</label>
          <div class="space-y-2">
            <div
              v-for="pm in paymentMethods"
              :key="pm.id"
              @click="selectedPaymentMethod = pm.id"
              class="p-3 rounded-xl border transition cursor-pointer flex items-center justify-between"
              :class="[
                selectedPaymentMethod === pm.id
                  ? 'bg-emerald-950/40 border-emerald-500 text-white'
                  : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800/40'
              ]"
            >
              <div class="flex items-center gap-2.5">
                <UIcon :name="pm.icon" class="w-5 h-5 text-emerald-400" />
                <div>
                  <span class="text-xs font-bold block leading-tight">{{ pm.label }}</span>
                  <span class="text-[10px] text-slate-500 block">{{ pm.provider }}</span>
                </div>
              </div>
              <UIcon
                v-if="selectedPaymentMethod === pm.id"
                name="i-heroicons-check-circle"
                class="w-5 h-5 text-emerald-400"
              />
            </div>
          </div>
        </div>

        <!-- Total Price Summary & Submit -->
        <div class="pt-3 border-t border-slate-800 flex items-center justify-between">
          <div>
            <span class="text-[10px] text-slate-400 uppercase font-bold block">Total Tagihan</span>
            <span class="text-lg font-extrabold text-emerald-400">
              Rp {{ ((selectedItemForBooking.priceNumber || 25000) * bookingQuantity).toLocaleString('id-ID') }}
            </span>
          </div>

          <button
            type="button"
            @click="processPayment"
            class="px-6 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 shadow-lg shadow-emerald-500/20 transition"
          >
            Bayar Sekarang 💳
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
