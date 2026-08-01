import { ref, computed } from 'vue'
import type { BookingItem, PaymentMethod, BrebesItem } from '~/types/brebes'
import { useAuth } from './useAuth'

const userBookings = ref<BookingItem[]>([
  {
    id: 'book-101',
    bookingCode: 'BRB-883920',
    itemId: 'wisata-kaligua',
    itemName: 'Agrowisata Kebun Teh Kaligua',
    itemCategory: 'wisata',
    userId: 'user-001',
    userName: 'Budi Santoso',
    userEmail: 'budi@example.com',
    date: '2026-08-10',
    timeSlot: 'Pagi (08.00 - 11.00 WIB)',
    quantity: 2,
    unitPrice: 25000,
    totalPrice: 50000,
    paymentMethod: 'qris',
    paymentStatus: 'paid',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=BRB-883920',
    createdAt: '2026-08-01T10:30:00Z'
  }
])

const isBookingModalOpen = ref(false)
const selectedItemForBooking = ref<BrebesItem | null>(null)
const bookingQuantity = ref(1)
const bookingDate = ref('2026-08-05')
const selectedPaymentMethod = ref<PaymentMethod>('qris')
const isCheckoutSuccess = ref(false)
const lastBookingCreated = ref<BookingItem | null>(null)

export function useBooking() {
  const { currentUser } = useAuth()

  function openBookingModal(item: BrebesItem) {
    selectedItemForBooking.value = item
    bookingQuantity.value = 1
    bookingDate.value = new Date(Date.now() + 86400000).toISOString().split('T')[0] as string
    selectedPaymentMethod.value = 'qris'
    isCheckoutSuccess.value = false
    lastBookingCreated.value = null
    isBookingModalOpen.value = true
  }

  function closeBookingModal() {
    isBookingModalOpen.value = false
  }

  function processPayment() {
    if (!selectedItemForBooking.value) return

    const item = selectedItemForBooking.value
    const unitPrice = item.priceNumber || 25000
    const totalPrice = unitPrice * bookingQuantity.value
    const bookingCode = 'BRB-' + Math.floor(100000 + Math.random() * 900000)

    const newBooking: BookingItem = {
      id: 'book-' + Date.now(),
      bookingCode,
      itemId: item.id,
      itemName: item.name,
      itemCategory: item.category,
      userId: currentUser.value?.id || 'guest',
      userName: currentUser.value?.name || 'Tamu Wisatawan',
      userEmail: currentUser.value?.email || 'tamu@brebes.id',
      date: bookingDate.value,
      timeSlot: item.bestTime || 'Sepanjang Hari',
      quantity: bookingQuantity.value,
      unitPrice,
      totalPrice,
      paymentMethod: selectedPaymentMethod.value,
      paymentStatus: 'paid',
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${bookingCode}`,
      createdAt: new Date().toISOString()
    }

    userBookings.value.unshift(newBooking)
    lastBookingCreated.value = newBooking
    isCheckoutSuccess.value = true
  }

  return {
    userBookings,
    isBookingModalOpen,
    selectedItemForBooking,
    bookingQuantity,
    bookingDate,
    selectedPaymentMethod,
    isCheckoutSuccess,
    lastBookingCreated,
    openBookingModal,
    closeBookingModal,
    processPayment
  }
}
