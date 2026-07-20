import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const useSentenceStore = defineStore('sentence', () => {
  const sentences = ref([])
  const currentSentence = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const totalSentences = computed(() => sentences.value.length)
  
  const getRandomSentence = computed(() => {
    if (sentences.value.length === 0) return null
    const randomIndex = Math.floor(Math.random() * sentences.value.length)
    return sentences.value[randomIndex]
  })

  async function fetchSentences() {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(`${API_URL}/api/sentences`)
      if (!response.ok) {
        throw new Error('Failed to fetch sentences')
      }
      const data = await response.json()
      sentences.value = data
      
      // Set first random sentence
      if (sentences.value.length > 0) {
        currentSentence.value = getRandomSentence.value
      }
    } catch (err) {
      error.value = err.message
      console.error('Error fetching sentences:', err)
      // Use fallback data if API fails
      loadFallbackData()
    } finally {
      loading.value = false
    }
  }

  function loadFallbackData() {
    // Fallback data for development/offline use
    sentences.value = [
      {
        _id: 's1',
        frisian: 'Hoe giet it mei dy?',
        dutch: 'Hoe gaat het met jou?',
        pronunciation: 'Hoe gjit \'t maai dij?',
        audioUrl: 'hoe-giet-it-mei-dy.mp3'
      },
      {
        _id: 's2',
        frisian: 'Goeiemoarn',
        dutch: 'Goedemorgen!',
        pronunciation: 'Goeiemowen (rijmt ongeveer op Engelse \'Owen\' en begint met een harde \'g\')',
        audioUrl: 'goeiemoarn.mp3'
      },
      {
        _id: 's3',
        frisian: 'Oant sjen!',
        dutch: 'Tot ziens!',
        pronunciation: 'Owent sjen',
        audioUrl: 'oant-sjen.mp3'
      },
      {
        _id: 's4',
        frisian: 'Ik fyn dy leuk.',
        dutch: 'Ik vind je leuk.',
        pronunciation: 'ik fien die leuk',
        audioUrl: 'ik-fyn-dy-leuk.mp3'
      },
      {
        _id: 's5',
        frisian: 'Danke wol!',
        dutch: 'Dank je wel!',
        pronunciation: 'Danke wol',
        audioUrl: 'danke-wol.mp3'
      },
      {
        _id: 's6',
        frisian: 'Wolkom yn Fryslân!',
        dutch: 'Welkom in Friesland!',
        pronunciation: 'Wolkom yn Frieslowen (rijmt ongeveer op Engelse \'Owen\')',
        audioUrl: 'wolkom-yn-fryslân.mp3'
      },
      {
        _id: 's7',
        frisian: 'Hoe hiesto?',
        dutch: 'Hoe heet jij?',
        pronunciation: 'Hoe hiesto?',
        audioUrl: 'hoe-hiesto.mp3'
      },
      {
        _id: 's8',
        frisian: 'Ik bin Heleen.',
        dutch: 'Ik ben Heleen.',
        pronunciation: 'ik bin Heleen',
        audioUrl: 'ik-bin-heleen.mp3'
      },
      {
        _id: 's9',
        frisian: 'Wêr wennesto?',
        dutch: 'Waar woon je?',
        pronunciation: 'Wèèr wennesto?',
        audioUrl: 'wêr-wennesto.mp3'
      },
      {
        _id: 's10',
        frisian: 'Moai waar hjoed!',
        dutch: 'Mooi weer vandaag!',
        pronunciation: 'Mooi waar jóé-\'t',
        audioUrl: 'moai-waar-hjoed.mp3'
      }
    ]
    currentSentence.value = getRandomSentence.value
  }

  function nextSentence() {
    if (sentences.value.length === 0) return
    const randomIndex = Math.floor(Math.random() * sentences.value.length)
    currentSentence.value = sentences.value[randomIndex]
  }

  function getRandomSentences(count) {
    const shuffled = [...sentences.value].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, Math.min(count, sentences.value.length))
  }

  return {
    sentences,
    currentSentence,
    loading,
    error,
    totalSentences,
    fetchSentences,
    nextSentence,
    getRandomSentences,
    getRandomSentence
  }
})
