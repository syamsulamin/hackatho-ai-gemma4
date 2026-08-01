<script setup lang="ts">
defineProps<{
  title?: string
  message: string
}>()

const emit = defineEmits<{
  (e: 'retry'): void
}>()
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 py-6">
    <div class="glass-panel p-6 rounded-2xl border border-rose-500/30 bg-rose-950/20 shadow-xl text-center space-y-4">
      <div class="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mx-auto flex items-center justify-center">
        <UIcon name="i-heroicons-exclamation-triangle" class="w-6 h-6" />
      </div>

      <div>
        <h3 class="text-base font-bold text-rose-300">
          {{ title || 'Gagal Memproses Rekomendasi' }}
        </h3>
        <p class="text-xs sm:text-sm text-slate-300 mt-1 max-w-md mx-auto">
          {{ message }}
        </p>
      </div>

      <div class="pt-2 flex items-center justify-center gap-3">
        <button
          type="button"
          @click="emit('retry')"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 text-xs sm:text-sm font-semibold transition"
        >
          <UIcon name="i-heroicons-arrow-path" class="w-4 h-4" />
          <span>Coba Lagi</span>
        </button>
      </div>
    </div>
  </div>
</template>
