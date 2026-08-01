# Brebes Go AI — Panduan Wisata, Kuliner & UMKM Brebes

Aplikasi berbasis **Nuxt 4**, **TypeScript**, dan **Nuxt UI** yang memanfaatkan **Gemma AI** untuk membantu wisatawan menemukan destinasi wisata, kuliner legendaris, dan produk UMKM di Kabupaten Brebes menggunakan prompt bahasa alami.

---

## 🚀 Requirement & Fitur Utama

- [x] **Nuxt 4 Directory Architecture**: Menggunakan struktur `app/` native Nuxt 4 (`future: { compatibilityVersion: 4 }`).
- [x] **TypeScript**: Full type safety dengan interface untuk data Brebes, request/response AI, dan preset prompts.
- [x] **Nuxt UI & Tailwind CSS**: Tampilan modern dengan glassmorphic cards, gradient text, dan animasi halus.
- [x] **Responsive Design**: Tampilan teruji pada layar HP, tablet, dan desktop.
- [x] **Hero Sederhana & Informatif**: Banner headline, statistik kualitatif, dan badge teknologi.
- [x] **Textarea Prompt & Quick Presets**: Form prompt dengan counter karakter, shortcut `Ctrl + Enter`, dan filter kategori.
- [x] **Tombol Generate**: Tombol aksi utama dengan animasi spinner & status loading.
- [x] **Card Hasil AI**: Kartu rekomendasi interaktif dilengkapi rating, lokasi, catatan Gemma AI, tombol Google Maps, dan tombol salin info.
- [x] **Loading State**: Shimmer loading skeleton saat Gemma AI sedang menganalisis.
- [x] **Error State**: Tampilan penanganan error yang ramah dengan tombol "Coba Lagi".
- [x] **Local Dataset & Gemma API Hybrid**: Berjalan instan dengan Dataset Lokal Brebes secara cerdas, serta mendukung integrasi langsung `GEMMA_API_KEY` / `GEMINI_API_KEY`.
- [x] **Clean Architecture & Production Ready**: Bebas over-engineering, struktur modular, dan dapat langsung di-build ke produksi.

---

## 📁 Struktur Project (Nuxt 4 Clean Architecture)

```
hackatho-ai-gemma4/
├── app/                        # Nuxt 4 App Directory
│   ├── assets/
│   │   └── css/main.css        # Design tokens & Glassmorphic CSS
│   ├── components/             # Reusable Vue Components
│   │   ├── AppHeader.vue       # Sticky header & navigation
│   │   ├── AppFooter.vue       # Footer credits
│   │   ├── HeroSection.vue     # Hero section
│   │   ├── PromptForm.vue      # Textarea prompt & category tabs
│   │   ├── RecommendationCard.vue  # AI result cards
│   │   ├── RecommendationList.vue  # Grid results & AI summary banner
│   │   ├── LoadingSkeleton.vue # Loading shimmer animation
│   │   └── ErrorAlert.vue      # Friendly error alert
│   ├── data/
│   │   └── brebes-dataset.ts   # Curated Brebes Local Dataset & presets
│   ├── types/
│   │   └── brebes.ts           # TypeScript interfaces & types
│   ├── app.vue                 # Main application layout
│   └── pages/
│       └── index.vue           # Main interactive landing page
├── server/
│   └── api/
│       └── generate.post.ts    # Server endpoint for Gemma AI generation
├── public/                     # Static assets (favicon, images)
├── docs/                       # PRD & Documentation
├── nuxt.config.ts              # Nuxt 4 configuration
├── package.json
└── tsconfig.json
```

---

## 🛠️ Cara Menjalankan Project

### 1. Install Dependencies
```bash
npm install
```

### 2. Jalankan Server Mode Development
```bash
npm run dev
```
Buka browser di `http://localhost:3000`.

### 3. (Opsional) Konfigurasi Gemma / Gemini API Key
Buat file `.env` di root project:
```env
GEMINI_API_KEY=your_gemini_or_gemma_api_key_here
```
> *Catatan*: Jika `.env` tidak diisi, sistem akan otomatis menggunakan **Built-in Gemma Semantic Dataset Engine** sehingga aplikasi tetap berjalan 100% tanpa error!

### 4. Build untuk Production
```bash
npm run build
```
Jalankan hasil build produksi dengan:
```bash
node .output/server/index.mjs
```
