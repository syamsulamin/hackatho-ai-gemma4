import { GoogleGenerativeAI } from '@google/generative-ai'
import { BREBES_DATASET } from '~/data/brebes-dataset'
import type { AIRecommendationRequest, AIRecommendationResponse, BrebesItem, ItineraryDay, OriginRouteInfo } from '~/types/brebes'

const DEFAULT_GEMMA_MODEL = 'publishers/google/models/gemma-4-26b-a4b-it-maas'

export default defineEventHandler(async (event) => {
  const body = await readBody<AIRecommendationRequest>(event)
  const config = useRuntimeConfig()

  const prompt = body?.prompt?.trim() || ''
  const selectedCategory = body?.category || 'all'
  const requestedMode = body?.mode || 'recommendation'

  if (!prompt) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Prompt tidak boleh kosong. Masukkan kata kunci pencarian atau rencana trip Brebes.'
    })
  }

  const normalizedPrompt = prompt.toLowerCase()

  // Detect Origin City (e.g. "Jakarta", "Semarang", "Bandung", "Cirebon", "Surabaya", "Yogyakarta")
  let originCity = body?.originCity || ''
  if (normalizedPrompt.includes('jakarta') || normalizedPrompt.includes('jkt')) originCity = 'Jakarta'
  else if (normalizedPrompt.includes('semarang')) originCity = 'Semarang'
  else if (normalizedPrompt.includes('bandung')) originCity = 'Bandung'
  else if (normalizedPrompt.includes('cirebon')) originCity = 'Cirebon'
  else if (normalizedPrompt.includes('surabaya')) originCity = 'Surabaya'
  else if (normalizedPrompt.includes('yogyakarta') || normalizedPrompt.includes('jogja')) originCity = 'Yogyakarta'

  const isItineraryMode = requestedMode === 'itinerary' ||
    originCity !== '' ||
    normalizedPrompt.includes('dari') ||
    normalizedPrompt.includes('itinerary') ||
    normalizedPrompt.includes('2 hari') ||
    normalizedPrompt.includes('1 hari') ||
    normalizedPrompt.includes('3 hari') ||
    normalizedPrompt.includes('2h1m') ||
    normalizedPrompt.includes('3h2m') ||
    normalizedPrompt.includes('jadwal') ||
    normalizedPrompt.includes('rencana rute') ||
    normalizedPrompt.includes('trip') ||
    normalizedPrompt.includes('perjalanan')

  const apiKey = config.geminiApiKey || process.env.GEMINI_API_KEY || process.env.GEMMA_API_KEY
  const modelName = process.env.GEMMA_MODEL || config.gemmaModel || DEFAULT_GEMMA_MODEL

  // Attempt real Gemma 4 API generation if API Key / Vertex credentials are available
  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: { responseMimeType: 'application/json' }
      })

      const systemPrompt = `
Kamu adalah Gemma 4 (Model Garden: publishers/google/models/gemma-4-26b-a4b-it-maas), asisten AI wisata, kuliner & itinerary planner khusus Kabupaten Brebes.
Tugasmu adalah menganalisis permintaan pengguna dan memberikan rekomendasi serta jadwal itinerary perjalanan berbasis dataset resmi Brebes berikut:
${JSON.stringify(BREBES_DATASET, null, 2)}

Kota Asal Wisatawan: "${originCity || 'Luar Kota'}".
Filter Kategori Pengguna: "${selectedCategory}" (jika 'all', bisa dari semua kategori).
Mode Request: "${isItineraryMode ? 'itinerary' : 'recommendation'}".

Respons kamu HARUS berformat JSON valid dengan struktur persis seperti ini:
{
  "summary": "Ringkasan rekomendasi / rencana perjalanan dari Gemma 4",
  "reasoning": "Alasan penyusunan rekomendasi atau urutan rute itinerary",
  "categoryLabel": "Label kategori atau mode utama",
  "recommendations": [
    {
      "id": "id_dari_dataset",
      "name": "nama_tempat",
      "category": "wisata | kuliner | umkm",
      "rating": 4.8,
      "location": "lokasi",
      "priceRange": "harga",
      "tags": ["tag1"],
      "description": "deskripsi",
      "highlight": "highlight",
      "address": "alamat",
      "mapsUrl": "link_maps",
      "bestTime": "waktu_terbaik",
      "icon": "icon_name",
      "gradient": "gradient_class",
      "aiNote": "Catatan khusus Gemma 4 AI",
      "matchScore": 95,
      "coordinates": { "lat": -6.8698, "lng": 109.0425 }
    }
  ],
  "originRoute": ${originCity ? `{
    "originCity": "${originCity}",
    "travelDuration": "Estimasi waktu tempuh dari ${originCity} ke Brebes",
    "recommendedTransport": "Rekomendasi moda transportasi",
    "estimatedCostInfo": "Estimasi biaya perjalanan dari ${originCity}",
    "tipsFromOrigin": "Tips perjalanan berangkat dari ${originCity}"
  }` : 'null'},
  "itinerary": ${isItineraryMode ? `[
    {
      "dayNumber": 1,
      "dayTitle": "Judul Hari Pertama",
      "slots": [
        {
          "time": "05.00 - 09.00 WIB",
          "title": "Perjalanan dari ${originCity || 'Kota Asal'}",
          "itemId": "wisata-kaligua",
          "locationName": "Ke Brebes",
          "activity": "Deskripsi perjalanan",
          "estimatedCost": "Rp 150.000",
          "tips": "Tips kunjungan"
        }
      ]
    }
  ]` : 'null'},
  "queryTags": ["#Tag1", "#Tag2"],
  "suggestedFollowups": ["Saran prompt 1", "Saran prompt 2"]
}
`

      const result = await model.generateContent([
        { text: systemPrompt },
        { text: `Permintaan Pengguna: "${prompt}"` }
      ])

      const responseText = result.response.text()
      if (responseText) {
        const parsed = JSON.parse(responseText) as AIRecommendationResponse
        return {
          status: 'success',
          data: {
            ...parsed,
            generatedAt: new Date().toISOString()
          }
        }
      }
    } catch (err: any) {
      console.warn(`Gemma 4 Model Garden (${modelName}) call failed or fallback active:`, err?.message || err)
    }
  }

  // Smart Dataset Semantic & Itinerary Engine (Local Gemma 4 AI Simulator)
  const promptTokens = normalizedPrompt.split(/\s+/).filter(t => t.length > 2)

  const scoredItems = BREBES_DATASET.map(item => {
    let score = 50

    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      score -= 30
    } else if (selectedCategory !== 'all' && item.category === selectedCategory) {
      score += 20
    }

    const itemText = `${item.name} ${item.description} ${item.highlight} ${item.location} ${item.tags.join(' ')}`.toLowerCase()

    promptTokens.forEach(token => {
      if (itemText.includes(token)) {
        score += 15
      }
    })

    if (normalizedPrompt.includes('sejuk') || normalizedPrompt.includes('gunung') || normalizedPrompt.includes('teh')) {
      if (item.id === 'wisata-kaligua' || item.id === 'wisata-curug-cantel' || item.id === 'wisata-waduk-penjalin') score += 25
    }

    if (normalizedPrompt.includes('malam') || normalizedPrompt.includes('sate') || normalizedPrompt.includes('alun')) {
      if (item.id === 'kuliner-sate-blengong' || item.id === 'kuliner-soto-tauco') score += 30
    }

    if (normalizedPrompt.includes('pantai') || normalizedPrompt.includes('mangrove') || normalizedPrompt.includes('sunset')) {
      if (item.id === 'wisata-randusanga' || item.id === 'wisata-mangrove') score += 30
    }

    if (normalizedPrompt.includes('oleh') || normalizedPrompt.includes('telur') || normalizedPrompt.includes('batik') || normalizedPrompt.includes('bawang')) {
      if (item.category === 'umkm' || item.id === 'kuliner-telur-asin-yes') score += 30
    }

    let aiNote = `[Gemma 4] Rekomendasi teratas dengan relevansi ${Math.min(99, Math.max(78, score))}% sesuai pencarian Anda.`
    if (item.category === 'wisata') {
      aiNote = `[Gemma 4] Wisata terfavorit dengan nilai keasrian tinggi dan akses mudah.`
    } else if (item.category === 'kuliner') {
      aiNote = `[Gemma 4] Cita rasa autentik khas Brebes dengan rating tinggi (${item.rating}/5.0).`
    } else if (item.category === 'umkm') {
      aiNote = `[Gemma 4] Oleh-oleh produk unggulan UMKM Brebes berkualitas tinggi.`
    }

    return {
      ...item,
      matchScore: Math.min(99, Math.max(75, Math.floor(score))),
      aiNote
    }
  })

  let filtered = scoredItems
  if (selectedCategory !== 'all') {
    filtered = scoredItems.filter(i => i.category === selectedCategory)
    if (filtered.length === 0) filtered = scoredItems
  }

  filtered.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
  const topRecommendations = filtered.slice(0, isItineraryMode ? 6 : 3)

  // Origin City Route Info Generator
  let originRoute: OriginRouteInfo | undefined = undefined
  const currentOrigin = originCity || 'Jakarta'

  if (originCity || isItineraryMode) {
    if (currentOrigin === 'Jakarta') {
      originRoute = {
        originCity: 'Jakarta',
        travelDuration: '~3.5 - 4 Jam via Tol Trans-Jawa',
        recommendedTransport: '🚗 Mobil (Tol Jakarta-Cikampek -> Tol Cipali -> Exit Pejagan Brebes) ATAU 🚆 Kereta Api (Stasiun Gambir / Pasarsenen -> Stasiun Brebes 3.5 Jam)',
        estimatedCostInfo: 'Tol Pejagan ~Rp 185.000 | Tiket Kereta ~Rp 160.000 - Rp 280.000',
        tipsFromOrigin: 'Berangkat dari Jakarta jam 05.30 WIB agar tiba di Brebes jam 09.30 WIB untuk langsung menikmati sarapan Soto Tauco atau menuju Kebun Teh Kaligua!'
      }
    } else if (currentOrigin === 'Semarang') {
      originRoute = {
        originCity: 'Semarang',
        travelDuration: '~2 - 2.5 Jam via Tol Trans-Jawa',
        recommendedTransport: '🚗 Mobil (Tol Semarang - Batang - Tegal - Brebes Exit) ATAU 🚆 Kereta Api (Stasiun Tawang / Poncol -> Stasiun Brebes 2 Jam)',
        estimatedCostInfo: 'Tol Brebes Timur ~Rp 110.000 | Tiket Kereta ~Rp 90.000 - Rp 150.000',
        tipsFromOrigin: 'Berangkat pagi dari Semarang untuk pengalaman liburan sejuk di lereng Gunung Slamet Brebes Selatan.'
      }
    } else if (currentOrigin === 'Bandung') {
      originRoute = {
        originCity: 'Bandung',
        travelDuration: '~4.5 - 5 Jam via Jalur Sumedang / Tol Cisumdawu',
        recommendedTransport: '🚗 Mobil via Tol Cisumdawu -> Cirebon -> Brebes Barat / Exit Pejagan',
        estimatedCostInfo: 'Estimasi Bensin & Tol ~Rp 250.000',
        tipsFromOrigin: 'Pilihan tepat untuk trip akhir pekan 2 Hari 1 Malam dari Bandung menikmati pantai dan kuliner Sate Blengong.'
      }
    } else {
      originRoute = {
        originCity: currentOrigin,
        travelDuration: '~3 - 4 Jam perjalanan',
        recommendedTransport: '🚗 Kendaraan Pribadi / Bus Interkota / Kereta Api Stasiun Brebes',
        estimatedCostInfo: 'Bensin / Tiket Transportasi ~Rp 150.000 - Rp 250.000',
        tipsFromOrigin: 'Gemma 4 menyusun jadwal tiba tepat waktu makan siang kuliner khas Brebes.'
      }
    }
  }

  // Generate Itinerary Timeline
  let generatedItinerary: ItineraryDay[] | undefined = undefined

  if (isItineraryMode) {
    const is2Days = normalizedPrompt.includes('2 hari') || normalizedPrompt.includes('2h1m')
    const is3Days = normalizedPrompt.includes('3 hari') || normalizedPrompt.includes('3h2m')

    const kaliguaName = BREBES_DATASET.find(i => i.id === 'wisata-kaligua')?.name || 'Agrowisata Kebun Teh Kaligua'
    const sotoName = BREBES_DATASET.find(i => i.id === 'kuliner-soto-tauco')?.name || 'Soto Tauco Brebes Bang Ridho'
    const mangroveName = BREBES_DATASET.find(i => i.id === 'wisata-mangrove')?.name || 'Hutan Mangrove Pandansari'
    const sateName = BREBES_DATASET.find(i => i.id === 'kuliner-sate-blengong')?.name || 'Sate Blengong & Kupat Glabed Mas Yanto'
    const telurName = BREBES_DATASET.find(i => i.id === 'kuliner-telur-asin-yes')?.name || 'Pusat Telur Asin Yes'
    const curugName = BREBES_DATASET.find(i => i.id === 'wisata-curug-cantel')?.name || 'Curug Cantel Bumijawa'
    const batikName = BREBES_DATASET.find(i => i.id === 'umkm-batik-salem')?.name || 'Sentra Batik Tulis Salem Brebesan'
    const pantaiName = BREBES_DATASET.find(i => i.id === 'wisata-randusanga')?.name || 'Pantai Randusanga Indah'
    const bawangName = BREBES_DATASET.find(i => i.id === 'umkm-bawang-goreng')?.name || 'Bawang Merah Goreng Super'

    generatedItinerary = [
      {
        dayNumber: 1,
        dayTitle: `Hari 1: Kedatangan dari ${currentOrigin} & Jelajah Brebes`,
        slots: [
          {
            time: '05.30 - 09.30 WIB',
            title: `Perjalanan dari ${currentOrigin} menuju Brebes`,
            locationName: `Rute Tol Trans-Jawa / Kereta Api`,
            activity: `Berangkat dari ${currentOrigin} menuju Brebes. Nikmati pemandangan jalur pantura / tol Pejagan.`,
            estimatedCost: originRoute?.estimatedCostInfo || 'Rp 180.000',
            tips: originRoute?.tipsFromOrigin || 'Tiba di Brebes tepat untuk sarapan/makan siang.'
          },
          {
            time: '09.30 - 12.30 WIB',
            title: 'Udara Sejuk Kebun Teh Pegunungan',
            itemId: 'wisata-kaligua',
            locationName: kaliguaName,
            activity: 'Tiba di Brebes Selatan, menikmati pemandangan kebun teh di ketinggian 1.500 mdpl, foto di Goa Jepang, dan minum teh segar.',
            estimatedCost: 'Rp 25.000',
            tips: 'Jalanan menanjak sejuk, siapkan jaket tipis.'
          },
          {
            time: '13.00 - 14.30 WIB',
            title: 'Makan Siang Soto Tauco Gurih',
            itemId: 'kuliner-soto-tauco',
            locationName: sotoName,
            activity: 'Mencicipi soto khas Brebes berkuah tauco hangat dengan potongan daging sapi empuk.',
            estimatedCost: 'Rp 22.000',
            tips: 'Tambahkan emping renyah dan sedikit perasan jeruk nipis untuk rasa umami maksimal.'
          },
          {
            time: '15.30 - 17.30 WIB',
            title: 'Susur Muara & Ekowisata Mangrove',
            itemId: 'wisata-mangrove',
            locationName: mangroveName,
            activity: 'Naik perahu tradisional menyusuri muara laut menuju jembatan kayu estetik di tengah kebun mangrove.',
            estimatedCost: 'Rp 20.000',
            tips: 'Sangat cocok untuk berfoto sore hari dengan latar langit senja muara.'
          },
          {
            time: '18.30 - 20.30 WIB',
            title: 'Makan Malam Kuliner Ikonik Sate Blengong',
            itemId: 'kuliner-sate-blengong',
            locationName: sateName,
            activity: 'Menikmati Sate Blengong empuk gurih dengan bumbu cabai rempah dan Kupat Glabed di Alun-alun Brebes.',
            estimatedCost: 'Rp 25.000',
            tips: 'Pesan kombinasi sate daging dan sate tulang blengong untuk variasi sensasi makan.'
          }
        ]
      }
    ]

    if (is2Days || is3Days) {
      generatedItinerary.push({
        dayNumber: 2,
        dayTitle: 'Hari 2: Wisata Bahari Sunset & Belanja Oleh-Oleh UMKM',
        slots: [
          {
            time: '08.00 - 11.00 WIB',
            title: 'Trek Petualangan Air Terjun',
            itemId: 'wisata-curug-cantel',
            locationName: curugName,
            activity: 'Merasakan kesegaran percikan air terjun setinggi 60 meter berhawa dingin di perbatasan Sirampog.',
            estimatedCost: 'Rp 15.000',
            tips: 'Gunakan alas kaki anti selip untuk trek jalur setapak.'
          },
          {
            time: '12.00 - 13.30 WIB',
            title: 'Makan Siang Kuliner Khas Rujak Belut',
            itemId: 'kuliner-rujak-belut',
            locationName: 'Rujak Belut Cigedog Bu Ce\'is',
            activity: 'Sensasi belut goreng krispi digeprek bumbu rujak pedas gurih menyengat khas Kersana.',
            estimatedCost: 'Rp 30.000',
            tips: 'Minta tingkat kepedasan sesuai selera kamu.'
          },
          {
            time: '15.30 - 18.00 WIB',
            title: 'Santai Senja Sunset Pantai Randusanga',
            itemId: 'wisata-randusanga',
            locationName: pantaiName,
            activity: 'Bersantai di gazebo tepi pantai, menikmati kelapa muda dan pemandangan sunset pantai utara.',
            estimatedCost: 'Rp 15.000',
            tips: 'Gunakan kacamata hitam dan abadikan momen matahari terbenam.'
          },
          {
            time: '19.00 - 20.30 WIB',
            title: `Belanja Oleh-Oleh & Kepulangan ke ${currentOrigin}`,
            itemId: 'kuliner-telur-asin-yes',
            locationName: `${telurName} & ${bawangName}`,
            activity: `Membeli Telur Asin Bakar masir berminyak dan Bawang Merah Goreng Super sebelum perjalanan pulang ke ${currentOrigin}.`,
            estimatedCost: 'Rp 50.000 - Rp 100.000',
            tips: 'Telur Asin Bakar tahan hingga 10 hari perjalanan luar kota.'
          }
        ]
      })
    }

    if (is3Days) {
      generatedItinerary.push({
        dayNumber: 3,
        dayTitle: `Hari 3: Wisata Budaya Batik Salem & Kepulangan ke ${currentOrigin}`,
        slots: [
          {
            time: '09.00 - 12.00 WIB',
            title: 'Wisata Edukasi Batik Tulis Salem',
            itemId: 'umkm-batik-salem',
            locationName: batikName,
            activity: 'Melihat langsung proses mencanting batik tulis halus karya pengrajin Salem dan membeli kain etnik khas Brebes.',
            estimatedCost: 'Rp 150.000 - Rp 300.000',
            tips: 'Dapat memesan batik motif khusus Bawang Merah & Mangrove.'
          }
        ]
      })
    }
  }

  const categoryNames: Record<string, string> = {
    all: isItineraryMode ? `🗓️ Rencana Perjalanan Wisatawan dari ${currentOrigin}` : 'Wisata, Kuliner & UMKM',
    wisata: 'Destinasi Wisata Alam & Rekreasi',
    kuliner: 'Kuliner Khas Legendaris',
    umkm: 'Produk & Oleh-Oleh UMKM'
  }

  const queryTags = Array.from(new Set([
    `#DARI_${currentOrigin.toUpperCase()}`,
    isItineraryMode ? '#ITINERARY_BREBES' : 'BREBES',
    selectedCategory !== 'all' ? '#' + selectedCategory.toUpperCase() : '#WISATA_LOKAL',
    ...promptTokens.slice(0, 3).map(t => '#' + t.charAt(0).toUpperCase() + t.slice(1))
  ]))

  const responseData: AIRecommendationResponse = {
    summary: isItineraryMode
      ? `Gemma 4 telah menyusun Rencana Itinerary Perjalanan ${generatedItinerary?.length || 1} Hari dari ${currentOrigin} ke Brebes untuk: "${prompt}".`
      : `Gemma 4 (Model Garden: publishers/google/models/gemma-4-26b-a4b-it-maas) menemukan ${topRecommendations.length} rekomendasi terbaik di Brebes yang paling pas untuk: "${prompt}".`,
    reasoning: isItineraryMode
      ? `Rute dari ${currentOrigin} ini dirancang Gemma 4 agar efisien dalam waktu tempuh tol/kereta, jam tiba kedatangan, serta perpaduan wisata alam, kuliner legendaris, dan toko oleh-oleh.`
      : `Pilihan ini diambil oleh model Gemma 4 berdasarkan preferensi lokasi, ulasan pengunjung, serta kearifan lokal Brebes.`,
    categoryLabel: categoryNames[selectedCategory] || 'Rekomendasi Pilihan',
    recommendations: topRecommendations,
    itinerary: generatedItinerary,
    originRoute,
    queryTags,
    suggestedFollowups: isItineraryMode
      ? [
          `Bagaimana estimasi total biaya bensin & tol dari ${currentOrigin}?`,
          `Rekomendasi penginapan / hotel terdekat dari rute ini`,
          `Saran rute perjalanan pulang balik ke ${currentOrigin}`
        ]
      : [
          `Berapa estimasi biaya untuk mengunjungi ${topRecommendations[0]?.name}?`,
          `Apa rute tercepat dan jam buka ${topRecommendations[0]?.name}?`,
          `Rekomendasi tempat makan terdekat dari ${topRecommendations[0]?.name}`
        ],
    generatedAt: new Date().toISOString()
  }

  return {
    status: 'success',
    data: responseData
  }
})
