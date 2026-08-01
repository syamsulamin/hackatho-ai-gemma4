# 🔮 Roadmap & Fitur Selanjutnya (Post-Hackathon) — Brebes Go AI

Dokumen ini mencatat rencana pengembangan fitur jangka menengah dan jangka panjang untuk proyek **Brebes Go AI** setelah fase Hackathon MVP selesai.

---

## 🎯 Status MVP Hackathon (Fase 0)
- **Teknologi**: Nuxt 4, TypeScript, Nuxt UI, Tailwind CSS, Gemma 4 / MaaS API + Hybrid Dataset Engine.
- **Cakupan**: Prompts bahasa alami, preset pencarian, match score, catatan AI, tombol Google Maps, serta loading shimmer & error state.
- **Prinsip**: Fast execution (< 3 jam), zero external DB dependency, zero auth overhead.

---

## 🚀 Peta Jalan Pengembangan (Post-Hackathon)

### 📍 Fase 1: Peta Interaktif & Perencana Perjalanan (AI Itinerary Builder)
- [x] **Interactive Map View (Leaflet / Google Maps SDK)**: Visualisasi posisi destinasi wisata, kuliner legendaris, dan toko UMKM di peta Kabupaten Brebes secara real-time.
- [x] **Multi-Day AI Itinerary Planner**: Pembuat rencana perjalanan otomatis (1 Hari, 2H1M, 3H2M) yang disusun cerdas oleh Gemma 4 lengkap dengan estimasi rute dan alokasi anggaran.

### 🗄️ Fase 2: Backend Dinamis & Autentikasi Pengguna
- [ ] **Database Dinamis (Supabase / PostgreSQL + PostGIS)**: Migrasi dataset terkurasi dari static file `app/data/brebes-dataset.ts` ke database terpusat dengan dukungan pencarian geospasial.
- [ ] **Autentikasi Pengguna (OAuth / Supabase Auth)**: Fitur pembuatan akun wisatawan untuk menyimpan destinasi favorit, membuat kustom itinerary, dan melihat riwayat prompt AI.

### 🛍️ Fase 3: E-Commerce UMKM & Sistem Booking Tiket
- [ ] **Katalog & Direct Order UMKM Brebes**: Fasilitas pemesanan oleh-oleh khas (Batik Salem, Telur Asin Bakar, Bawang Goreng) langsung via WhatsApp Direct atau Payment Gateway (Midtrans/Xendit).
- [ ] **E-Ticketing Destinasi Wisata**: Pembelian dan reservasi tiket masuk online untuk objek wisata alam dan edukasi di Brebes.

### 💬 Fase 4: Ulasan Komunitas & Analisis Sentimen AI
- [ ] **User Generated Content (UGC)**: Fitur ulasan, pemberian rating, dan unggah foto pengalaman pengguna di lokasi wisata/kuliner.
- [ ] **AI Sentiment Summary**: Gemma 4 merangkum ulasan dari berbagai sumber dan menyajikan ikhtisar kelebihan/kekurangan destinasi secara otomatis.

### 🏛️ Fase 5: Portal Admin Dinas Pariwisata & UMKM (Dashboard Pemda)
- [ ] **Dashboard Analitik Wisatawan**: Insight data tren destinasi yang paling diminati, statistik pencarian, dan dampak ekonomi UMKM.
- [ ] **Portal Pengelola UMKM & Destinasi**: Sistem CRUD bagi pemilik UMKM dan pengelola objek wisata untuk memperbarui harga, jam operasional, dan event secara independen.

### 🌐 Fase 6: Multi-Bahasa, Suara, & Offline PWA Mode
- [ ] **Dukungan Bahasa Daerah & Asing**: Gemma 4 melayani prompt dalam Bahasa Jawa/Brebesan, Bahasa Indonesia, dan Bahasa Inggris.
- [ ] **AI Voice Input & PWA Offline Mode**: Fitur pencarian perintah suara dan mode offline PWA untuk daerah dengan keterbatasan sinyal internet.
