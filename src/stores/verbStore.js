import { defineStore } from 'pinia'
import { ref } from 'vue'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const useVerbStore = defineStore('verb', () => {
  const verbs = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchVerbs() {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(`${API_URL}/api/verbs`)
      if (!response.ok) {
        throw new Error('Failed to fetch verbs')
      }
      const data = await response.json()
      verbs.value = data
    } catch (err) {
      error.value = err.message
      console.error('Error fetching verbs:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    verbs,
    loading,
    error,
    fetchVerbs
  }
})
