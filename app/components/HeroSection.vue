<template>
  <section class="relative pt-8 pb-6 sm:pt-12 sm:pb-10 overflow-hidden">
    <!-- Background Ambient Glow Blobs -->
    <div class="glow-blob-emerald top-0 left-1/4 -translate-x-1/2"></div>
    <div class="glow-blob-cyan top-10 right-10"></div>

    <div class="max-w-4xl mx-auto px-4 text-center relative z-10">
      <!-- Tagline Pill -->
      <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs font-semibold text-slate-300 mb-5 shadow-inner">
        <span class="flex h-2 w-2 relative">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span class="text-emerald-400 font-bold">Hackathon MVP</span>
        <span class="text-slate-500">•</span>
        <span>Asisten AI Pariwisata & UMKM Brebes</span>
      </div>

      <!-- Main Headline -->
      <h1 class="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight mb-4">
        Eksplorasi Wisata & Kuliner Brebes dengan <span class="gradient-text-emerald">Kecerdasan Gemma AI</span>
      </h1>

      <!-- Subtitle -->
      <p class="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed mb-8">
        Ketik keinginan liburanmu dalam bahasa sehari-hari. Gemma AI akan mencocokkan tempat wisata sejuk, sate blengong legendaris, hingga oleh-oleh khas terbaik untukmu.
      </p>

      <!-- Stat Badges Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
        <div class="glass-card p-3 sm:p-4 rounded-xl text-center">
          <div class="text-xl sm:text-2xl font-extrabold text-emerald-400">8+</div>
          <div class="text-xs text-slate-400 font-medium mt-0.5">Wisata Alam & Pantai</div>
        </div>
        <div class="glass-card p-3 sm:p-4 rounded-xl text-center">
          <div class="text-xl sm:text-2xl font-extrabold text-amber-400">7+</div>
          <div class="text-xs text-slate-400 font-medium mt-0.5">Kuliner Legendaris</div>
        </div>
        <div class="glass-card p-3 sm:p-4 rounded-xl text-center">
          <div class="text-xl sm:text-2xl font-extrabold text-cyan-400">6+</div>
          <div class="text-xs text-slate-400 font-medium mt-0.5">Produk UMKM</div>
        </div>
        <div class="glass-card p-3 sm:p-4 rounded-xl text-center">
          <div class="text-xl sm:text-2xl font-extrabold text-purple-400">&lt; 2s</div>
          <div class="text-xs text-slate-400 font-medium mt-0.5">Respon AI Cepat</div>
        </div>
      </div>
    </div>
  </section>
</template>
