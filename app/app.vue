<script setup lang="ts">
import '~/assets/css/main.css'
import AppHeader from '~/components/AppHeader.vue'
import AppFooter from '~/components/AppFooter.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100 selection:bg-emerald-500 selection:text-slate-950 font-sans">
    <AppHeader />
    
    <main class="flex-1">
      <NuxtPage />
    </main>

    <AppFooter />
  </div>
</template>
