import { GoogleGenerativeAI } from '@google/generative-ai'
import { BREBES_DATASET } from '~/data/brebes-dataset'
import type { ChatMessage, BrebesItem } from '~/types/brebes'

const DEFAULT_GEMMA_MODEL = 'publishers/google/models/gemma-4-26b-a4b-it-maas'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ message: string }>(event)
  const config = useRuntimeConfig()

  const userQuery = body?.message?.trim() || ''

  if (!userQuery) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Pesan tidak boleh kosong.'
    })
  }

  const apiKey = config.geminiApiKey || process.env.GEMINI_API_KEY || process.env.GEMMA_API_KEY
  const modelName = process.env.GEMMA_MODEL || config.gemmaModel || DEFAULT_GEMMA_MODEL

  // Attempt real Gemma 4 API generation if available
  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({
        model: modelName
      })

      const systemPrompt = `
Kamu adalah "Mbak Brebes AI", Tour Guide (Pemandu Wisata) ramah dan cerdas khas Kabupaten Brebes yang ditenagai Gemma 4.
Jawablah pertanyaan wisatawan dengan ramah, informatif, dan membantu.
Fokus jawabanmu meliputi: jam operasional/buka, harga tiket masuk, kuliner favorit/makanan khas, rute lokasi, dan oleh-oleh UMKM.

Gunakan dataset resmi Kabupaten Brebes berikut sebagai acuan fakta:
${JSON.stringify(BREBES_DATASET, null, 2)}

Aturan Jawaban:
- Jawab secara langsung dan ringkas dalam 2-4 kalimat ramah ala pemandu wisata lokal.
- Sertakan estimasi harga tiket, jam buka, atau lokasi persis jika ditanyakan.
- Gunakan bahasa Indonesia yang ramah, sopan, dan bersemangat.
`

      const result = await model.generateContent([
        { text: systemPrompt },
        { text: `Pertanyaan Wisatawan: "${userQuery}"` }
      ])

      const responseText = result.response.text()
      if (responseText) {
        return {
          status: 'success',
          reply: responseText,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        }
      }
    } catch (err: any) {
      console.warn(`Gemma 4 Chat Tour Guide API error:`, err?.message || err)
    }
  }

  // Smart Tour Guide Fallback Engine (Local Gemma 4 AI Tour Guide Simulator)
  const queryLower = userQuery.toLowerCase()
  let replyText = 'Halo! Saya Mbak Brebes AI Tour Guide. Ada yang bisa saya bantu terkait destinasi wisata, jam buka, tiket, atau kuliner khas Brebes?'
  let matchedItem: BrebesItem | undefined = undefined

  // Jam Buka & Tiket Check
  if (queryLower.includes('jam') || queryLower.includes('buka') || queryLower.includes('operasional')) {
    if (queryLower.includes('kaligua') || queryLower.includes('teh')) {
      matchedItem = BREBES_DATASET.find(i => i.id === 'wisata-kaligua')
      replyText = `Agrowisata Kebun Teh Kaligua buka setiap hari mulai pukul 06.00 WIB hingga 17.00 WIB. Waktu berkunjung terbaik adalah pagi hari (06.00 - 10.00 WIB) untuk menikmati pemandangan gumpalan kabut sejuk dan udara segar pegunungan. Tiket masuknya Rp 20.000 - Rp 35.000.`
    } else if (queryLower.includes('mangrove') || queryLower.includes('pandansari')) {
      matchedItem = BREBES_DATASET.find(i => i.id === 'wisata-mangrove')
      replyText = `Hutan Mangrove Pandansari buka pukul 07.30 - 17.30 WIB. Tiket masuk Rp 15.000 - Rp 25.000 (sudah termasuk persewaan perahu perahu menyusuri muara laut). Waktu terbaik sore hari menjelang senja!`
    } else if (queryLower.includes('pantai') || queryLower.includes('randusanga')) {
      matchedItem = BREBES_DATASET.find(i => i.id === 'wisata-randusanga')
      replyText = `Pantai Randusanga Indah (Parin) buka 24 jam setiap hari. Tiket masuk sangat terjangkau hanya Rp 10.000/orang. Disarankan datang pukul 16.00 WIB untuk bersantai menikmati sunset pantai utara.`
    } else {
      replyText = `Sebagian besar destinasi wisata alam Brebes buka pukul 07.00 - 17.00 WIB dengan tiket masuk berkisar Rp 10.000 - Rp 35.000, sedangkan tempat kuliner malam seperti Sate Blengong Alun-alun buka pukul 17.00 - 23.00 WIB!`
    }
  } else if (queryLower.includes('tiket') || queryLower.includes('harga') || queryLower.includes('biaya')) {
    replyText = `Berikut estimasi harga tiket tempat wisata di Brebes:\n- Agrowisata Kebun Teh Kaligua: Rp 20.000 - Rp 35.000\n- Hutan Mangrove Pandansari: Rp 15.000 - Rp 25.000 (termasuk perahu)\n- Pantai Randusanga Indah: Rp 10.000\n- Curug Cantel: Rp 10.000 - Rp 15.000\n- Waduk Penjalin: Gratis - Rp 5.000.`
  } else if (queryLower.includes('makan') || queryLower.includes('kuliner') || queryLower.includes('sate') || queryLower.includes('soto') || queryLower.includes('malam')) {
    matchedItem = BREBES_DATASET.find(i => i.id === 'kuliner-sate-blengong')
    replyText = `Kuliner nomor 1 yang wajib kamu coba malam hari adalah Sate Blengong & Kupat Glabed Mas Yanto di Alun-alun Brebes (buka 17.00 - 23.00 WIB, harga Rp 15.000 - Rp 30.000). Untuk sarapan pagi, cobalah Soto Tauco Bang Ridho berkuah gurih hangat!`
  } else if (queryLower.includes('oleh') || queryLower.includes('telur') || queryLower.includes('bawang') || queryLower.includes('batik')) {
    matchedItem = BREBES_DATASET.find(i => i.id === 'kuliner-telur-asin-yes')
    replyText = `Oleh-oleh paling ikonik dari Brebes adalah Telur Asin Bakar di Toko YES Diponegoro (Rp 5.000 - Rp 8.000/butir), Bawang Merah Goreng Super Ratu Bawang (Rp 25.000 - Rp 65.000), dan Kain Batik Tulis Salem khas Brebesan.`
  } else {
    replyText = `Halo! Saya Mbak Brebes AI Tour Guide. Kamu bisa menanyakan apa saja seputar Brebes, seperti: "Kebun Teh Kaligua buka jam berapa?", "Berapa harga tiket Mangrove Pandansari?", atau "Rekomendasi makanan malam terenak".`
  }

  return {
    status: 'success',
    reply: replyText,
    matchedItem,
    timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  }
})
