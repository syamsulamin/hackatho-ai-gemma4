<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <!-- Header Status Loading -->
    <div class="glass-panel p-6 rounded-2xl border border-slate-800 mb-8 text-center relative overflow-hidden">
      <div class="absolute inset-0 animate-shimmer"></div>
      
      <div class="relative z-10 flex flex-col items-center justify-center gap-3">
        <div class="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin" />
        </div>
        <div>
          <h3 class="text-base font-bold text-white">Gemma AI Sedang Bekerja...</h3>
          <p class="text-xs text-slate-400 mt-1">Mencocokkan preferensi Anda dengan dataset wisata, kuliner & UMKM Kabupaten Brebes</p>
        </div>

        <div class="flex items-center gap-2 mt-2">
          <span class="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span class="text-xs font-semibold text-emerald-300">Memproses kecocokan semantic</span>
        </div>
      </div>
    </div>

    <!-- Cards Skeleton Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div
        v-for="n in 3"
        :key="n"
        class="glass-card p-5 rounded-2xl border border-slate-800 space-y-4 relative overflow-hidden"
      >
        <div class="h-32 bg-slate-800/80 rounded-xl animate-shimmer"></div>
        <div class="flex justify-between items-center">
          <div class="h-5 w-24 bg-slate-800/80 rounded-lg animate-shimmer"></div>
          <div class="h-5 w-16 bg-slate-800/80 rounded-lg animate-shimmer"></div>
        </div>
        <div class="h-6 w-3/4 bg-slate-800/80 rounded-lg animate-shimmer"></div>
        <div class="space-y-2">
          <div class="h-3 w-full bg-slate-800/80 rounded animate-shimmer"></div>
          <div class="h-3 w-5/6 bg-slate-800/80 rounded animate-shimmer"></div>
        </div>
        <div class="flex gap-2">
          <div class="h-6 w-16 bg-slate-800/80 rounded-full animate-shimmer"></div>
          <div class="h-6 w-16 bg-slate-800/80 rounded-full animate-shimmer"></div>
        </div>
      </div>
    </div>
  </div>
</template>
