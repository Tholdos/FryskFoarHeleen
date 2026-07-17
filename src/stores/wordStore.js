import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const useWordStore = defineStore('word', () => {
  const words = ref([])
  const currentWord = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const totalWords = computed(() => words.value.length)
  
  const getRandomWord = computed(() => {
    if (words.value.length === 0) return null
    const randomIndex = Math.floor(Math.random() * words.value.length)
    return words.value[randomIndex]
  })

  async function fetchWords() {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(`${API_URL}/api/words`)
      if (!response.ok) {
        throw new Error('Failed to fetch words')
      }
      const data = await response.json()
      words.value = data
      
      // Set first random word
      if (words.value.length > 0) {
        currentWord.value = getRandomWord.value
      }
    } catch (err) {
      error.value = err.message
      console.error('Error fetching words:', err)
      // Use fallback data if API fails
      loadFallbackData()
    } finally {
      loading.value = false
    }
  }

  function loadFallbackData() {
    // Fallback data for development/offline use
    words.value = [
      {
        _id: '1',
        frisian: 'hûs',
        dutch: 'huis',
        pronunciation: 'hoos',
        audioUrl: null,
        category: 'nouns'
      },
      {
        _id: '2',
        frisian: 'heit',
        dutch: 'vader',
        pronunciation: 'hait',
        audioUrl: null,
        category: 'family'
      },
      {
        _id: '3',
        frisian: 'mem',
        dutch: 'moeder',
        pronunciation: 'mem',
        audioUrl: null,
        category: 'family'
      },
      {
        _id: '4',
        frisian: 'wetter',
        dutch: 'water',
        pronunciation: 'vetter',
        audioUrl: null,
        category: 'nouns'
      },
      {
        _id: '5',
        frisian: 'wyn',
        dutch: 'wind',
        pronunciation: 'win',
        audioUrl: null,
        category: 'nouns'
      }
    ]
    currentWord.value = getRandomWord.value
  }

  function nextWord() {
    if (words.value.length === 0) return
    const randomIndex = Math.floor(Math.random() * words.value.length)
    currentWord.value = words.value[randomIndex]
  }

  function getRandomWords(count) {
    const shuffled = [...words.value].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, Math.min(count, words.value.length))
  }

  return {
    words,
    currentWord,
    loading,
    error,
    totalWords,
    fetchWords,
    nextWord,
    getRandomWords,
    getRandomWord
  }
})
