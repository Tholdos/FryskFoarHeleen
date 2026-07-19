<template>
  <div class="flashcard-container">
    <div v-if="wordStore.loading" class="loading">
      Loading words...
    </div>

    <div v-else-if="currentWord" class="flashcard-wrapper">
      <!-- Direction Toggle -->
      <div class="direction-toggle">
        <button 
          @click="toggleDirection" 
          class="toggle-btn"
          :title="dutchToFrisian ? 'Wissel naar Fries → Nederlands' : 'Wissel naar Nederlands → Fries'"
        >
          {{ dutchToFrisian ? '🇳🇱 → 🏴' : '🏴 → 🇳🇱' }}
          {{ dutchToFrisian ? 'Nederlands → Fries' : 'Fries → Nederlands' }}
        </button>
      </div>

      <div 
        class="flashcard" 
        :class="{ flipped: isFlipped }"
        @click="flipCard"
      >
        <!-- Dutch to Frisian mode (default) -->
        <template v-if="dutchToFrisian">
          <div class="card-front">
            <div class="language-label">Nederlands</div>
            <div class="word">{{ currentWord.dutch }}</div>
            <div class="hint">Klik om te draaien</div>
          </div>
          <div class="card-back">
            <div class="language-label">Fries</div>
            <div class="word">{{ currentWord.frisian }}</div>
            <div class="pronunciation">Uitspraak: {{ currentWord.pronunciation }}</div>
            <button 
              @click.stop="playAudio" 
              class="audio-icon"
              :disabled="isPlaying"
              :title="currentWord.audioUrl ? 'Speel uitspraak af' : 'Audio nog niet beschikbaar'"
            >
              <span v-if="isPlaying">⏸</span>
              <span v-else>🔊</span>
            </button>
          </div>
        </template>

        <!-- Frisian to Dutch mode -->
        <template v-else>
          <div class="card-front">
            <div class="language-label">Fries</div>
            <div class="word">{{ currentWord.frisian }}</div>
            <div class="pronunciation">Uitspraak: {{ currentWord.pronunciation }}</div>
            <button 
              @click.stop="playAudio" 
              class="audio-icon"
              :disabled="isPlaying"
              :title="currentWord.audioUrl ? 'Speel uitspraak af' : 'Audio nog niet beschikbaar'"
            >
              <span v-if="isPlaying">⏸</span>
              <span v-else>🔊</span>
            </button>
            <div class="hint">Klik om te draaien</div>
          </div>
          <div class="card-back">
            <div class="language-label">Nederlands</div>
            <div class="word">{{ currentWord.dutch }}</div>
          </div>
        </template>
      </div>

      <div class="controls">
        <button @click="nextCard" class="btn-next">
          Volgende →
        </button>
      </div>
    </div>

    <div v-else class="no-words">
      Geen woorden beschikbaar. Start de backend server.
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useWordStore } from '../stores/wordStore'
import { useGameStore } from '../stores/gameStore'

const wordStore = useWordStore()
const gameStore = useGameStore()
const isFlipped = ref(false)
const dutchToFrisian = ref(true) // Default: Dutch → Frisian
const isPlaying = ref(false)
const audio = ref(null)

const currentWord = computed(() => wordStore.currentWord)

function flipCard() {
  isFlipped.value = !isFlipped.value
}

function nextCard() {
  wordStore.nextWord()
  isFlipped.value = false
  gameStore.recordAttempt()
}

function toggleDirection() {
  dutchToFrisian.value = !dutchToFrisian.value
  isFlipped.value = false // Reset card when toggling
}

function playAudio() {
  // If audio URL exists, play it
  if (currentWord.value?.audioUrl) {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    const fullAudioUrl = `${API_URL}/api/audio/${currentWord.value.audioUrl}`
    
    try {
      if (!audio.value || audio.value.src !== fullAudioUrl) {
        audio.value = new Audio(fullAudioUrl)
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
  } else {
    // Show message that audio is not available yet
    console.log('Audio not available for this word yet')
  }
}
</script>

<style scoped>
.flashcard-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.flashcard-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  width: 100%;
}

.direction-toggle {
  margin-bottom: 0.5rem;
}

.toggle-btn {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border: 2px solid #667eea;
  background: white;
  color: #667eea;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.toggle-btn:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
}

.flashcard {
  width: 400px;
  height: 300px;
  position: relative;
  cursor: pointer;
  perspective: 1000px;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.flashcard.flipped {
  transform: rotateY(180deg);
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.card-front {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.card-back {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  transform: rotateY(180deg);
}

.language-label {
  font-size: 0.9rem;
  opacity: 0.8;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.word {
  font-size: 3rem;
  font-weight: bold;
  margin: 1rem 0;
}

.pronunciation {
  font-size: 1.2rem;
  opacity: 0.9;
  font-style: italic;
  margin-bottom: 0.5rem;
}

.audio-icon {
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
  margin-top: 0.5rem;
}

.audio-icon:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.audio-icon:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.audio-icon span {
  font-size: 1.2rem;
}

.hint {
  position: absolute;
  bottom: 1rem;
  font-size: 0.9rem;
  opacity: 0.7;
}

.controls {
  display: flex;
  gap: 1rem;
}

.controls button {
  padding: 1rem 2rem;
  font-size: 1.1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-next {
  background: #667eea;
  color: white;
}

.btn-next:hover {
  background: #5568d3;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
}

.loading,
.no-words {
  padding: 2rem;
  text-align: center;
  color: #666;
  font-size: 1.2rem;
}

@media (max-width: 600px) {
  .flashcard {
    width: 90%;
    max-width: 350px;
  }
  
  .word {
    font-size: 2rem;
  }

  .toggle-btn {
    font-size: 0.9rem;
    padding: 0.6rem 1.2rem;
  }
}
</style>
