<script setup lang="ts">
import { ref } from 'vue'
import type { CategoryType } from '~/types/brebes'
import { PROMPT_PRESETS } from '~/data/brebes-dataset'

const props = defineProps<{
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', payload: { prompt: string; category: CategoryType }): void
  (e: 'clear'): void
}>()

const promptText = ref('')
const selectedCategory = ref<CategoryType>('all')

const categories: { key: CategoryType; label: string; icon: string }[] = [
  { key: 'all', label: 'Semua Kategori', icon: 'i-heroicons-squares-2x2' },
  { key: 'wisata', label: 'Wisata Alam', icon: 'i-heroicons-sun' },
  { key: 'kuliner', label: 'Kuliner Khas', icon: 'i-heroicons-fire' },
  { key: 'umkm', label: 'UMKM & Oleh-oleh', icon: 'i-heroicons-shopping-bag' }
]

function selectPreset(prompt: string, category: CategoryType) {
  promptText.value = prompt
  selectedCategory.value = category
}

function handleFormSubmit() {
  if (!promptText.value.trim() || props.loading) return
  emit('submit', {
    prompt: promptText.value.trim(),
    category: selectedCategory.value
  })
}

function handleClear() {
  promptText.value = ''
  emit('clear')
}

function handleKeydown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault()
    handleFormSubmit()
  }
}
</script>

<template>
  <div id="prompt-section" class="max-w-3xl mx-auto px-4">
    <div class="glass-panel p-5 sm:p-7 rounded-2xl border border-slate-800 shadow-2xl relative">
      <!-- Top Bar: Category Selection Pills -->
      <div class="mb-5">
        <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Pilih Fokus Kategori
        </label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="cat in categories"
            :key="cat.key"
            type="button"
            @click="selectedCategory = cat.key"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200"
            :class="[
              selectedCategory === cat.key
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700/60'
            ]"
          >
            <UIcon :name="cat.icon" class="w-4 h-4" />
            <span>{{ cat.label }}</span>
          </button>
        </div>
      </div>

      <!-- Quick Preset Prompt Chips -->
      <div class="mb-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">
            💡 Inspirasi Prompt Cepat
          </span>
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="preset in PROMPT_PRESETS"
            :key="preset.id"
            type="button"
            @click="selectPreset(preset.prompt, preset.category)"
            class="text-left text-xs bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-300 px-3 py-1.5 rounded-lg transition-all"
          >
            {{ preset.label }}
          </button>
        </div>
      </div>

      <!-- Textarea Input Area -->
      <form @submit.prevent="handleFormSubmit" class="space-y-4">
        <div class="relative">
          <label for="prompt-input" class="sr-only">Prompt Rekomendasi Brebes</label>
          <textarea
            id="prompt-input"
            v-model="promptText"
            @keydown="handleKeydown"
            rows="4"
            maxlength="500"
            placeholder="Tuliskan keinginan liburanmu di sini... (Contoh: Carikan wisata alam sejuk di gunung untuk keluarga dan tempat makan sate blengong terenak dekat alun-alun)"
            class="w-full bg-slate-900/90 border border-slate-700/80 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl p-4 text-sm sm:text-base text-white placeholder-slate-500 resize-none transition duration-200 outline-none"
            :disabled="loading"
          ></textarea>

          <!-- Action bar inside textarea bottom -->
          <div class="flex items-center justify-between mt-1 text-xs text-slate-500 px-1">
            <div class="flex items-center gap-2">
              <span>Tekan <kbd class="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px] text-slate-400">Ctrl + Enter</kbd> untuk kirim</span>
            </div>
            <div class="flex items-center gap-3">
              <button
                v-if="promptText"
                type="button"
                @click="handleClear"
                class="text-slate-400 hover:text-rose-400 transition underline"
              >
                Hapus
              </button>
              <span>{{ promptText.length }}/500</span>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex items-center justify-end">
          <button
            type="submit"
            :disabled="!promptText.trim() || loading"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 active:scale-[0.98] transition-all"
          >
            <UIcon
              v-if="loading"
              name="i-heroicons-arrow-path"
              class="w-5 h-5 animate-spin"
            />
            <UIcon
              v-else
              name="i-heroicons-sparkles"
              class="w-5 h-5 text-slate-950"
            />
            <span>{{ loading ? 'Menganalisis dengan Gemma AI...' : 'Rencanakan dengan AI ✨' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
