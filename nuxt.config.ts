// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  // Enable Nuxt 4 directory structure
  future: {
    compatibilityVersion: 4
  },

  modules: [
    '@nuxt/ui'
  ],

  colorMode: {
    preference: 'dark'
  },

  app: {
    head: {
      title: 'Brebes Go AI — Panduan Wisata, Kuliner & UMKM Brebes (Gemma 4)',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Aplikasi AI cerdas rekomendasi destinasi wisata, kuliner khas, dan produk UMKM Kabupaten Brebes menggunakan Gemma 4 (publishers/google/models/gemma-4-26b-a4b-it-maas).' },
        { name: 'keywords', content: 'Brebes, Wisata Brebes, Kuliner Brebes, Sate Blengong, Telur Asin, Kaligua, Gemma 4, Nuxt 4' },
        { name: 'theme-color', content: '#0f172a' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@500;600;700;800&display=swap' }
      ]
    }
  },

  runtimeConfig: {
    geminiApiKey: process.env.GEMINI_API_KEY || process.env.GEMMA_API_KEY || '',
    gemmaModel: process.env.GEMMA_MODEL || 'publishers/google/models/gemma-4-26b-a4b-it-maas'
  }
})
