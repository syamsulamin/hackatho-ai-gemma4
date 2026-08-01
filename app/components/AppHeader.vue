<template>
  <header class="sticky top-0 z-50 glass-panel border-b border-slate-800/80">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <!-- Logo & Brand -->
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20">
          <div class="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <UIcon name="i-heroicons-sparkles" class="w-5 h-5 text-emerald-400" />
          </div>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <span class="font-extrabold text-lg sm:text-xl tracking-tight text-white">Brebes<span class="gradient-text-emerald">Go AI</span></span>
            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" title="Model: publishers/google/models/gemma-4-26b-a4b-it-maas">
              Gemma 4 MaaS
            </span>
          </div>
          <p class="text-[11px] text-slate-400 hidden sm:block">Panduan Wisata, Kuliner & UMKM Kabupaten Brebes</p>
        </div>
      </div>

      <!-- Header Actions -->
      <div class="flex items-center gap-2 sm:gap-3">
        <div class="hidden md:flex items-center gap-2 text-xs font-medium text-slate-300 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
          <UIcon name="i-heroicons-map-pin" class="w-4 h-4 text-emerald-400" />
          <span>Jawa Tengah, Indonesia</span>
        </div>

        <a
          href="#prompt-section"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs sm:text-sm font-semibold transition"
        >
          <UIcon name="i-heroicons-paper-airplane" class="w-4 h-4" />
          <span>Coba Prompt</span>
        </a>
      </div>
    </div>
  </header>
</template>
