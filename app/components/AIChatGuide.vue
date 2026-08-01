<script setup lang="ts">
import { ref, nextTick } from 'vue'
import type { ChatMessage, BrebesItem } from '~/types/brebes'

const isOpen = ref(false)
const inputMessage = ref('')
const loading = ref(false)

const chatMessages = ref<ChatMessage[]>([
  {
    id: 'msg-1',
    sender: 'gemma',
    text: 'Halo! Saya Mbak Brebes AI Tour Guide 🌿 Pemandu wisata lokal Brebes ditenagai Gemma 4. Kamu bisa tanya ke saya seputar jam buka tempat wisata, harga tiket, kuliner malam, atau oleh-oleh khas!',
    timestamp: 'Baru saja'
  }
])

const quickQuestions = [
  '🕒 Kebun Teh Kaligua buka jam berapa?',
  '🎟️ Berapa harga tiket Hutan Mangrove Pandansari?',
  '🍢 Makanan khas Brebes apa yang wajib dicoba malam hari?',
  '🎁 Berapa harga Telur Asin Bakar dan toko mana terbaik?'
]

const messagesContainer = ref<HTMLElement | null>(null)

async function scrollToBottom() {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

async function sendMessage(textToSend?: string) {
  const query = (textToSend || inputMessage.value).trim()
  if (!query || loading.value) return

  const userMsg: ChatMessage = {
    id: 'user-' + Date.now(),
    sender: 'user',
    text: query,
    timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  }

  chatMessages.value.push(userMsg)
  inputMessage.value = ''
  loading.value = true
  await scrollToBottom()

  try {
    const res = await $fetch<{ status: string; reply: string; timestamp: string; matchedItem?: BrebesItem }>('/api/chat', {
      method: 'POST',
      body: { message: query }
    })

    if (res.status === 'success') {
      const gemmaMsg: ChatMessage = {
        id: 'gemma-' + Date.now(),
        sender: 'gemma',
        text: res.reply,
        timestamp: res.timestamp || 'Baru saja',
        relatedItem: res.matchedItem
      }
      chatMessages.value.push(gemmaMsg)
      await scrollToBottom()
    }
  } catch (err) {
    console.error('Error asking Tour Guide AI:', err)
    chatMessages.value.push({
      id: 'err-' + Date.now(),
      sender: 'gemma',
      text: 'Maaf, terjadi kendala saat menghubungkan ke Mbak Brebes Tour Guide AI. Silakan coba kirim ulang pertanyaanmu.',
      timestamp: 'Baru saja'
    })
    await scrollToBottom()
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <!-- Floating Chat Trigger Button (Bottom Right) -->
    <button
      v-if="!isOpen"
      type="button"
      @click="isOpen = true"
      class="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs sm:text-sm shadow-2xl shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 border-2 border-emerald-300/40 group"
    >
      <div class="relative">
        <span class="w-3 h-3 rounded-full bg-slate-950 flex items-center justify-center">
          <span class="w-2 h-2 rounded-full bg-emerald-300 animate-ping"></span>
        </span>
      </div>
      <UIcon name="i-heroicons-chat-bubble-left-right" class="w-5 h-5 text-slate-950" />
      <span>Mbak Brebes AI Tour Guide 💬</span>
    </button>

    <!-- Expandable Chat Guide Drawer / Window -->
    <div
      v-if="isOpen"
      class="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[92vw] sm:w-[400px] h-[520px] max-h-[85vh] glass-panel rounded-3xl border border-emerald-500/30 shadow-2xl bg-slate-950/95 flex flex-col overflow-hidden"
    >
      <!-- Chat Header -->
      <div class="p-4 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div class="flex items-center gap-3">
          <div class="relative">
            <div class="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-extrabold text-sm">
              🤖
            </div>
            <span class="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-slate-950 rounded-full"></span>
          </div>

          <div>
            <h4 class="text-sm font-bold text-white leading-tight flex items-center gap-1.5">
              <span>Mbak Brebes AI Guide</span>
              <span class="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-extrabold">Gemma 4</span>
            </h4>
            <p class="text-[10px] text-slate-400">Pemandu Wisata, Jam Buka & Tiket Brebes</p>
          </div>
        </div>

        <button
          type="button"
          @click="isOpen = false"
          class="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
        >
          <UIcon name="i-heroicons-x-mark" class="w-5 h-5" />
        </button>
      </div>

      <!-- Messages Scroll Area -->
      <div ref="messagesContainer" class="flex-1 p-4 overflow-y-auto space-y-3.5 custom-scrollbar bg-slate-900/40">
        <div
          v-for="msg in chatMessages"
          :key="msg.id"
          class="flex flex-col"
          :class="msg.sender === 'user' ? 'items-end' : 'items-start'"
        >
          <div
            class="max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed space-y-2"
            :class="[
              msg.sender === 'user'
                ? 'bg-emerald-500 text-slate-950 font-semibold rounded-tr-none shadow-md shadow-emerald-500/10'
                : 'bg-slate-800/90 text-slate-100 border border-slate-700/80 rounded-tl-none'
            ]"
          >
            <p class="whitespace-pre-line">{{ msg.text }}</p>

            <div v-if="msg.relatedItem" class="pt-2 border-t border-white/10 text-[11px] font-medium flex items-center justify-between gap-1">
              <span>📍 {{ msg.relatedItem.name }} (⭐ {{ msg.relatedItem.rating }})</span>
              <a :href="msg.relatedItem.mapsUrl" target="_blank" class="underline font-bold text-emerald-300">Google Maps</a>
            </div>
          </div>

          <span class="text-[9px] text-slate-500 mt-1 px-1">{{ msg.timestamp }}</span>
        </div>

        <!-- Typing Indicator -->
        <div v-if="loading" class="flex items-center gap-2 text-xs text-emerald-400 italic bg-slate-800/60 p-2.5 rounded-xl w-fit border border-slate-700">
          <UIcon name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin text-emerald-400" />
          <span>Mbak Brebes AI sedang mengetik jawaban...</span>
        </div>
      </div>

      <!-- Quick Questions Chips -->
      <div class="p-2.5 bg-slate-950/80 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto custom-scrollbar shrink-0">
        <button
          v-for="(q, idx) in quickQuestions"
          :key="idx"
          type="button"
          @click="sendMessage(q)"
          class="text-[10px] bg-slate-800 hover:bg-emerald-950/50 border border-slate-700 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-300 px-2.5 py-1.5 rounded-lg shrink-0 transition"
        >
          {{ q }}
        </button>
      </div>

      <!-- Message Input Form -->
      <form @submit.prevent="sendMessage()" class="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2 shrink-0">
        <input
          v-model="inputMessage"
          type="text"
          placeholder="Tanya jam buka, tiket, makanan..."
          class="flex-1 bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition"
        />

        <button
          type="submit"
          :disabled="!inputMessage.trim() || loading"
          class="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 transition"
        >
          <UIcon name="i-heroicons-paper-airplane" class="w-4 h-4" />
        </button>
      </form>
    </div>
  </div>
</template>
