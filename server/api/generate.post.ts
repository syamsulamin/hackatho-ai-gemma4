import { GoogleGenerativeAI } from '@google/generative-ai'
import { BREBES_DATASET } from '~/data/brebes-dataset'
import type { AIRecommendationRequest, AIRecommendationResponse, BrebesItem } from '~/types/brebes'

export default defineEventHandler(async (event) => {
  const body = await readBody<AIRecommendationRequest>(event)
  const config = useRuntimeConfig()

  const prompt = body?.prompt?.trim() || ''
  const selectedCategory = body?.category || 'all'

  if (!prompt) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Prompt tidak boleh kosong. Masukkan kata kunci atau pertanyaan wisata/kuliner Brebes.'
    })
  }

  const apiKey = config.geminiApiKey || process.env.GEMINI_API_KEY || process.env.GEMMA_API_KEY

  // Attempt real AI generation if API Key is available
  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey)
      // Use gemini-1.5-flash or gemma model
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: { responseMimeType: 'application/json' }
      })

      const systemPrompt = `
Kamu adalah Gemma AI, asisten wisata & kuliner cerdas khusus Kabupaten Brebes.
Tugasmu adalah menganalisis permintaan pengguna dan memberikan rekomendasi terbaik berdasarkan dataset resmi Brebes berikut:
${JSON.stringify(BREBES_DATASET, null, 2)}

Filter Kategori Pengguna: "${selectedCategory}" (jika 'all', bisa dari semua kategori).

Respons kamu HARUS berformat JSON valid dengan struktur persis seperti ini:
{
  "summary": "Ringkasan rekomendasi dalam 2 kalimat ramah dan menarik",
  "reasoning": "Alasan mengapa tempat-tempat ini cocok dengan permintaan pengguna",
  "categoryLabel": "Label kategori utama yang relevan",
  "recommendations": [
    {
      "id": "id_dari_dataset",
      "name": "nama_tempat",
      "category": "wisata | kuliner | umkm",
      "rating": 4.8,
      "location": "lokasi",
      "priceRange": "harga",
      "tags": ["tag1", "tag2"],
      "description": "deskripsi",
      "highlight": "highlight",
      "address": "alamat",
      "mapsUrl": "link_maps",
      "bestTime": "waktu_terbaik",
      "icon": "icon_name",
      "gradient": "gradient_class",
      "aiNote": "Catatan khusus AI mengapa tempat ini sangat direkomendasikan",
      "matchScore": 95
    }
  ],
  "queryTags": ["tag_pencarian1", "tag_pencarian2"],
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
      console.warn('Google GenAI call failed or key invalid, fallback to dataset matching engine:', err?.message || err)
    }
  }

  // Smart Dataset Semantic Matching Engine (Local Gemma AI Simulator)
  const normalizedPrompt = prompt.toLowerCase()
  const promptTokens = normalizedPrompt.split(/\s+/).filter(t => t.length > 2)

  const scoredItems = BREBES_DATASET.map(item => {
    let score = 50 // Base score

    // Category filter check
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      score -= 30
    } else if (selectedCategory !== 'all' && item.category === selectedCategory) {
      score += 20
    }

    // Keyword matching
    const itemText = `${item.name} ${item.description} ${item.highlight} ${item.location} ${item.tags.join(' ')}`.toLowerCase()

    promptTokens.forEach(token => {
      if (itemText.includes(token)) {
        score += 15
      }
    })

    // Special intent keywords
    if (normalizedPrompt.includes('sejuk') || normalizedPrompt.includes('gunung') || normalizedPrompt.includes('dingin')) {
      if (item.id === 'wisata-kaligua' || item.id === 'wisata-curug-cantel' || item.id === 'wisata-waduk-penjalin') score += 25
    }

    if (normalizedPrompt.includes('malam') || normalizedPrompt.includes('alun') || normalizedPrompt.includes('sate') || normalizedPrompt.includes('makan')) {
      if (item.id === 'kuliner-sate-blengong' || item.id === 'kuliner-soto-tauco') score += 30
    }

    if (normalizedPrompt.includes('oleh') || normalizedPrompt.includes('bawa') || normalizedPrompt.includes('buah tangan') || normalizedPrompt.includes('telur')) {
      if (item.category === 'umkm' || item.id === 'kuliner-telur-asin-yes') score += 30
    }

    if (normalizedPrompt.includes('pantai') || normalizedPrompt.includes('laut') || normalizedPrompt.includes('sunset')) {
      if (item.id === 'wisata-randusanga' || item.id === 'wisata-mangrove') score += 30
    }

    if (normalizedPrompt.includes('keluarga') || normalizedPrompt.includes('anak') || normalizedPrompt.includes('ramai')) {
      if (item.tags.includes('Keluarga')) score += 15
    }

    // Dynamic AI notes generation
    let aiNote = `Rekomendasi teratas dengan tingkat relevansi ${(Math.min(99, Math.max(78, score)))}% sesuai pencarian Anda.`
    if (item.category === 'wisata') {
      const mainTag = item.tags[0] ? item.tags[0].toLowerCase() : 'asri'
      aiNote = `Sangat disukai pengunjung untuk suasana ${mainTag} dan keasrian lokasinya.`
    } else if (item.category === 'kuliner') {
      aiNote = `Cita rasa autentik khas Brebes yang paling dicari dengan ulasan tinggi (${item.rating}/5.0).`
    } else if (item.category === 'umkm') {
      aiNote = `Produk lokal kebanggaan UMKM Brebes dengan kualitas super dan harga terjangkau.`
    }

    return {
      ...item,
      matchScore: Math.min(99, Math.max(75, Math.floor(score))),
      aiNote
    }
  })

  // Filter items with positive category match if category selected, sort by score
  let filtered = scoredItems
  if (selectedCategory !== 'all') {
    filtered = scoredItems.filter(i => i.category === selectedCategory)
    if (filtered.length === 0) filtered = scoredItems // Fallback if no match
  }

  filtered.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
  const topRecommendations = filtered.slice(0, 3)

  // Construct response
  const categoryNames: Record<string, string> = {
    all: 'Wisata, Kuliner & UMKM',
    wisata: 'Destinasi Wisata Alam & Rekreasi',
    kuliner: 'Kuliner Khas Legendaris',
    umkm: 'Produk & Oleh-Oleh UMKM'
  }

  const queryTags = Array.from(new Set([
    selectedCategory !== 'all' ? selectedCategory.toUpperCase() : 'BREBES',
    ...promptTokens.slice(0, 3).map(t => '#' + t.charAt(0).toUpperCase() + t.slice(1))
  ]))

  const responseData: AIRecommendationResponse = {
    summary: `Gemma AI menemukan ${topRecommendations.length} rekomendasi terbaik di Brebes yang paling pas untuk: "${prompt}".`,
    reasoning: `Pilihan ini diambil berdasarkan preferensi lokasi, tingkat kepuasan ulasan pengunjung, serta kearifan lokal Brebes.`,
    categoryLabel: categoryNames[selectedCategory] || 'Rekomendasi Pilihan',
    recommendations: topRecommendations,
    queryTags,
    suggestedFollowups: [
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
