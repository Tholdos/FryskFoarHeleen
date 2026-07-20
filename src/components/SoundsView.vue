<template>
  <div class="sounds-container">
    <div class="sounds-header">
      <h2>Friese Klankcombinaasjes</h2>
      <p class="subtitle">Leer hoe letters in het Fries worden uitgesproken</p>
    </div>

    <div v-if="loading" class="loading">
      Klanken laden...
    </div>

    <div v-else-if="sounds.length > 0" class="sounds-list">
      <div 
        v-for="sound in sounds" 
        :key="sound.combination"
        class="sound-item"
      >
        <div class="sound-combination">
          {{ sound.combination }}
        </div>
        <div class="sound-details">
          <div class="pronunciation">
            {{ sound.pronunciation }}
          </div>
          <div v-if="sound.example" class="example">
            Voorbeeld: {{ sound.example }}
          </div>
        </div>
        <button 
          v-if="sound.audioUrl"
          @click="playAudio(sound)" 
          class="audio-btn"
          :disabled="currentlyPlaying === sound.combination"
          :title="'Luister naar ' + sound.combination"
        >
          <span v-if="currentlyPlaying === sound.combination">⏸</span>
          <span v-else>🔊</span>
        </button>
        <div v-else class="no-audio" title="Audio nog niet beschikbaar">
          🔇
        </div>
      </div>
    </div>

    <div v-else class="no-sounds">
      Geen klanken beschikbaar. Start de backend server.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const sounds = ref([])
const loading = ref(true)
const currentlyPlaying = ref(null)
const audioElement = ref(null)

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

onMounted(async () => {
  await fetchSounds()
})

async function fetchSounds() {
  loading.value = true
  try {
    const response = await fetch(`${API_URL}/api/sounds`)
    if (!response.ok) {
      throw new Error('Failed to fetch sounds')
    }
    const data = await response.json()
    sounds.value = data
  } catch (error) {
    console.error('Error fetching sounds:', error)
    // Use fallback data
    sounds.value = [
      {
        combination: 'aai',
        pronunciation: 'Tussen "aai" en "òòi"',
        example: 'paai (paal)',
        audioUrl: null
      },
      {
        combination: 'ie',
        pronunciation: 'ieje (zoals het begin van de naam "Ian")',
        example: 'bier, hier',
        audioUrl: null
      }
    ]
  } finally {
    loading.value = false
  }
}

function playAudio(sound) {
  if (!sound.audioUrl) return
  
  const fullAudioUrl = `${API_URL}/api/audio/${sound.audioUrl}`
  
  try {
    if (!audioElement.value || audioElement.value.src !== fullAudioUrl) {
      audioElement.value = new Audio(fullAudioUrl)
      audioElement.value.addEventListener('ended', () => {
        currentlyPlaying.value = null
      })
      audioElement.value.addEventListener('error', (e) => {
        console.error('Audio playback error:', e)
        currentlyPlaying.value = null
      })
    }
    
    audioElement.value.play()
    currentlyPlaying.value = sound.combination
  } catch (error) {
    console.error('Error playing audio:', error)
    currentlyPlaying.value = null
  }
}
</script>

<style scoped>
.sounds-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.sounds-header {
  text-align: center;
  margin-bottom: 2rem;
}

.sounds-header h2 {
  color: #667eea;
  margin-bottom: 0.5rem;
  font-size: 2rem;
}

.subtitle {
  color: #666;
  font-size: 1rem;
}

.sounds-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.sound-item {
  display: grid;
  grid-template-columns: 80px 1fr auto;
  align-items: center;
  gap: 1.5rem;
  padding: 1.25rem;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.sound-item:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  transform: translateY(-2px);
}

.sound-combination {
  font-size: 2rem;
  font-weight: bold;
  color: #667eea;
  text-align: center;
  font-family: 'Courier New', monospace;
  background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
  padding: 0.5rem;
  border-radius: 8px;
}

.sound-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.pronunciation {
  font-size: 1.1rem;
  color: #333;
  font-weight: 500;
}

.example {
  font-size: 0.9rem;
  color: #666;
  font-style: italic;
}

.audio-btn {
  padding: 0.75rem 1rem;
  font-size: 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.audio-btn:hover:not(:disabled) {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.audio-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.no-audio {
  font-size: 1.5rem;
  color: #ccc;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading,
.no-sounds {
  padding: 2rem;
  text-align: center;
  color: #666;
  font-size: 1.2rem;
}

@media (max-width: 600px) {
  .sounds-container {
    padding: 1rem;
  }

  .sound-item {
    grid-template-columns: 60px 1fr auto;
    gap: 1rem;
    padding: 1rem;
  }

  .sound-combination {
    font-size: 1.5rem;
  }

  .pronunciation {
    font-size: 1rem;
  }

  .example {
    font-size: 0.85rem;
  }

  .audio-btn,
  .no-audio {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
}
</style>
