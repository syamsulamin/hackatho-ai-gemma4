# Standar Kualitas Kode & Arsitektur — Brebes Go AI

Dokumen ini menjelaskan standar kualitas kode (*code quality standards*), prinsip arsitektur, type safety, serta strategi pengujian dan optimasi yang diterapkan dalam proyek **Brebes Go AI**.

---

## 🎯 1. Standar Type Safety & TypeScript Strict Mode

Aplikasi ini dibangun menggunakan **TypeScript** dengan konfigurasi **Strict Mode** aktif (`"strict": true` pada `tsconfig.json`).

- **Antarmuka Terdefinisi Eksplisit**: Semua model data, permintaan API, dan data lokal memiliki kontrak antarmuka di [`app/types/brebes.ts`](file:///home/devstar9615/hackatho-ai-gemma4/app/types/brebes.ts):
  - `CategoryType`: Union type `'all' | 'wisata' | 'kuliner' | 'umkm'`
  - `BrebesItem`: Tipe data lengkap destinasi/kuliner/UMKM dengan rating, lokasi, tag, dan harga.
  - `AIRecommendationRequest` & `AIRecommendationResponse`: Antarmuka penuh untuk request/response Gemma 4.
- **Pemeriksaan Tipe Kompiler (`vue-tsc`)**: Kode secara rutin diverifikasi dengan `npx vue-tsc --noEmit` untuk memastikan **0 error tipe**.

---

## 🏗️ 2. Clean Architecture Nuxt 4 (`app/` Directory)

Mengadopsi struktur arsitektur masa depan Nuxt 4 (`compatibilityVersion: 4`) yang rapi dan terisolasi:

```
app/
├── assets/css/main.css         # Single source of truth untuk Design System & Glassmorphism
├── components/                 # Single Responsibility Components
│   ├── AppHeader.vue           # Header & status badge Gemma 4
│   ├── AppFooter.vue           # Footer credits
│   ├── HeroSection.vue         # Presentation & statistics
│   ├── PromptForm.vue          # Form input, category selector & presets
│   ├── RecommendationCard.vue  # Reusable card component
│   ├── RecommendationList.vue  # Grid & executive summary container
│   ├── LoadingSkeleton.vue     # Animated shimmer loader
│   └── ErrorAlert.vue          # Friendly error state handler
├── data/brebes-dataset.ts      # Dataset terkurasi & prompt presets
├── types/brebes.ts             # TypeScript definitions
├── app.vue                     # Root layout wrapper
└── pages/index.vue             # Main page coordinator
```

### Prinsip Component Design:
- **Single Responsibility Principle**: Setiap komponen bertanggung jawab penuh atas satu fungsi UI.
- **Composition API (`<script setup lang="ts">`)**: Menggunakan Vue 3 Composition API murni tanpa Options API legacy.
- **Props & Emits Strict Typing**: Menggunakan `defineProps<{ ... }>()` dan `defineEmits<{ ... }>()` ter-typecheck.

---

## 🎨 3. Design System & Accessibility

- **Modern Glassmorphism Design**: Utility class konsisten `.glass-panel` dan `.glass-card` di [`app/assets/css/main.css`](file:///home/devstar9615/hackatho-ai-gemma4/app/assets/css/main.css) dengan blur dan border semi-transparan.
- **Responsive Layout**: Desain adaptif berbasis Tailwind CSS yang responsif di layar Smartphone (320px+), Tablet (768px+), dan Desktop (1024px+).
- **Aksesibilitas & Keyboard Navigation**:
  - Dukungan shortcut keyboard <kbd>Ctrl + Enter</kbd> untuk mengirim prompt instan.
  - Label tersembunyi `sr-only` pada elemen textarea.
  - Feedback visual tombol salin info dan link Google Maps direct tab.

---

## 🛡️ 4. Ketahanan & Penanganan Error (Resilience & Error Handling)

1. **Validasi Input Client & Server**:
   - Pengecekan prompt kosong baik di komponen UI maupun di server endpoint [`server/api/generate.post.ts`](file:///home/devstar9615/hackatho-ai-gemma4/server/api/generate.post.ts) dengan respon `400 Bad Request`.
2. **Zero-Downtime Hybrid Engine**:
   - Jika API Key Google GenAI / Gemma 4 tersedia, sistem memanggil model `publishers/google/models/gemma-4-26b-a4b-it-maas`.
   - Jika API Key tidak dikonfigurasi / terjadi rate limit, sistem beralih secara mulus ke **Local Gemma 4 Semantic Engine** berbasis skoring dataset tanpa memutus pengalaman pengguna (*graceful degradation*).
3. **Pesan Error Interaktif**:
   - Komponen `ErrorAlert.vue` menyediakan pesan kesalahan yang jelas beserta aksi tombol **"Coba Lagi"**.

---

## 🧪 5. Verifikasi & Perintah Kualitas Kode

Perintah utama untuk memastikan kualitas dan kompatibilitas build:

```bash
# 1. Typecheck TypeScript & Vue Template
npm run typecheck

# 2. Build Bundle Produksi (Vite + SSR Nitro)
npm run build

# 3. Preview Server Produksi
npm run preview
```
