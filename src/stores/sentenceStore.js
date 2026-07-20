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
        pronunciation: 'hoo-geet-it-may-die',
        audioUrl: null
      },
      {
        _id: 's2',
        frisian: 'Goeie moarn!',
        dutch: 'Goedemorgen!',
        pronunciation: 'goo-ye-moarn',
        audioUrl: null
      },
      {
        _id: 's3',
        frisian: 'Oant sjen!',
        dutch: 'Tot ziens!',
        pronunciation: 'oant-sjen',
        audioUrl: null
      },
      {
        _id: 's4',
        frisian: 'Ik hâld fan dy.',
        dutch: 'Ik hou van jou.',
        pronunciation: 'ik-hold-fan-die',
        audioUrl: null
      },
      {
        _id: 's5',
        frisian: 'Dankewol!',
        dutch: 'Dankjewel!',
        pronunciation: 'danke-wol',
        audioUrl: null
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
