<template>
  <div class="audio-player">
    <button 
      @click="playAudio" 
      class="play-button"
      :disabled="!audioUrl || isPlaying"
      :title="audioUrl ? 'Speel uitspraak af' : 'Geen audio beschikbaar'"
    >
      <span v-if="isPlaying">⏸</span>
      <span v-else>🔊</span>
      Uitspraak
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  audioUrl: {
    type: String,
    default: null
  }
})

const isPlaying = ref(false)
const audio = ref(null)

const fullAudioUrl = computed(() => {
  if (!props.audioUrl) return null
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
  return `${API_URL}/api/audio/${props.audioUrl}`
})

function playAudio() {
  if (!fullAudioUrl.value) return
  
  try {
    if (!audio.value) {
      audio.value = new Audio(fullAudioUrl.value)
      audio.value.addEventListener('ended', () => {
        isPlaying.value = false
      })
      audio.value.addEventListener('error', (e) => {
        console.error('Audio playback error:', e)
        isPlaying.value = false
      })
    }
    
    audio.value.play()
    isPlaying.value = true
  } catch (error) {
    console.error('Error playing audio:', error)
    isPlaying.value = false
  }
}
</script>

<style scoped>
.audio-player {
  margin-top: 1rem;
}

.play-button {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.play-button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.play-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.play-button span {
  font-size: 1.2rem;
}
</style>
