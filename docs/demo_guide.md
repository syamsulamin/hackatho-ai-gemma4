# Panduan Demo & Pengujian Hackathon — Brebes Go AI

Dokumen ini berisi panduan alur demo untuk dewan juri dan penguji guna merasakan pengalaman aplikasi **Brebes Go AI** ditenagai **Gemma 4**.

---

## 🚀 Alur Demo 3 Menit (Demo Walkthrough)

### Langkah 1: Buka Aplikasi & Tinjau Hero Section (30 Detik)
- Akses aplikasi di `http://localhost:3000/`.
- Perhatikan **Badge Gemma 4 MaaS** (`publishers/google/models/gemma-4-26b-a4b-it-maas`) di bagian header dan hero.
- Tunjukkan indikator statistik destinasi wisata, kuliner legendaris, dan UMKM Brebes.

### Langkah 2: Uji Prompt 1 — Wisata Alam Sejuk Keluarga (45 Detik)
- Klik preset chip: **"🌿 Wisata Sejuk Keluarga"** atau ketik:
  > *"Rekomendasikan destinasi wisata alam bernuansa sejuk yang cocok untuk liburan keluarga di Brebes"*
- Klik tombol **"Rencanakan dengan AI ✨"** (atau tekan `Ctrl + Enter`).
- Amati **Loading State** dengan animasi shimmer yang responsif.
- Tinjau **Card Hasil AI**:
  - Banner Analisis Gemma 4 & Alasan AI.
  - Kartu Agrowisata Kebun Teh Kaligua & Waduk Penjalin dengan *Match Score* (misal: 🎯 98% Cocok).
  - Coba tombol **Google Maps** untuk membuka rute lokasi.
  - Coba tombol **Salin Info** untuk menyalin detail tempat ke clipboard.

### Langkah 3: Uji Prompt 2 — Kuliner Legendaris Malam Hari (45 Detik)
- Pilih tab kategori **"Kuliner Khas"**.
- Klik preset chip: **"🍢 Kuliner Khas Malam Hari"** atau ketik:
  > *"Apa saja makanan khas Brebes paling legendaris yang wajib dicoba malam hari dekat Alun-alun?"*
- Amati hasil rekomendasi **Sate Blengong & Kupat Glabed Mas Yanto** serta **Telur Asin Bakar**.

### Langkah 4: Uji Pertanyaan Lanjutan AI (30 Detik)
- Di bagian bawah kartu hasil, perhatikan bagian **"Pertanyaan Lanjutan AI"**.
- Klik salah satu chip pertanyaan (misal: *"Berapa estimasi biaya untuk mengunjungi Agrowisata Kebun Teh Kaligua?"*).
- Aplikasi akan otomatis memproses prompt baru secara instan.

---

## 🧪 Skenario Pengujian Kualitas (Quality Testing)

| Skenario | Input Prompt | Hasil yang Diharapkan |
| :--- | :--- | :--- |
| **Pencarian Wisata** | "Ingin lihat pantai dan sunset di Brebes" | Menampilkan Pantai Randusanga Indah & Hutan Mangrove Pandansari dengan tag `#Pantai` & `#Sunset`. |
| **Pencarian Oleh-oleh** | "Cari oleh-oleh UMKM unik selain telur asin" | Menampilkan Batik Salem Brebesan, Bawang Merah Goreng Super, & Eggroll Telur Asin. |
| **Pencarian Pedas** | "Makanan pedas menyengat di Brebes" | Menampilkan Rujak Belut Cigedog & Sate Blengong Pedas. |
| **Validation / Empty Input** | (Kosong / spasi) | Tombol disabled & pesan validasi yang jelas. |
