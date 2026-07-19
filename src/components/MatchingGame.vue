<template>
  <div class="matching-game">
    <div class="game-header">
      <h2>Koppel de woorden aan elkaar</h2>
    </div>

    <div v-if="!gameStarted" class="start-screen">
      <p>Koppel 5 Friese woorden aan hun Nederlandse vertaling</p>
      <button @click="startGame" class="btn-start">Start spel</button>
    </div>

    <div v-else-if="gameComplete" class="complete-screen">
      <h2>🎉 Gefeliciteerd!</h2>
      <p>Je hebt alle woorden correct gekoppeld!</p>
      <p class="final-score">Score: {{ gameStore.score }}</p>
      <button @click="startGame" class="btn-restart">Opnieuw Spelen</button>
    </div>

    <div v-else class="game-board">
      <div class="column frisian-column">
        <h3>Fries</h3>
        <div 
          v-for="word in frisianWords" 
          :key="word._id"
          class="word-card"
          :class="{ 
            selected: selectedFrisian === word._id,
            matched: matchedPairs.includes(word._id)
          }"
          @click="selectFrisian(word._id)"
        >
          {{ word.frisian }}
        </div>
      </div>

      <div class="column dutch-column">
        <h3>Nederlands</h3>
        <div 
          v-for="word in dutchWords" 
          :key="word._id"
          class="word-card"
          :class="{ 
            selected: selectedDutch === word._id,
            matched: matchedPairs.includes(word._id)
          }"
          @click="selectDutch(word._id)"
        >
          {{ word.dutch }}
        </div>
      </div>
    </div>

    <div v-if="feedback" class="feedback" :class="feedback.type">
      {{ feedback.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useWordStore } from '../stores/wordStore'
import { useGameStore } from '../stores/gameStore'

const wordStore = useWordStore()
const gameStore = useGameStore()

const gameStarted = ref(false)
const gameComplete = ref(false)
const frisianWords = ref([])
const dutchWords = ref([])
const selectedFrisian = ref(null)
const selectedDutch = ref(null)
const matchedPairs = ref([])
const feedback = ref(null)

function startGame() {
  gameStarted.value = true
  gameComplete.value = false
  matchedPairs.value = []
  selectedFrisian.value = null
  selectedDutch.value = null
  feedback.value = null
  
  // Get 5 random words
  const words = wordStore.getRandomWords(5)
  frisianWords.value = [...words]
  
  // Shuffle Dutch words
  dutchWords.value = [...words].sort(() => Math.random() - 0.5)
}

function selectFrisian(id) {
  if (matchedPairs.value.includes(id)) return
  selectedFrisian.value = id
  checkMatch()
}

function selectDutch(id) {
  if (matchedPairs.value.includes(id)) return
  selectedDutch.value = id
  checkMatch()
}

function checkMatch() {
  if (!selectedFrisian.value || !selectedDutch.value) return
  
  if (selectedFrisian.value === selectedDutch.value) {
    // Correct match!
    matchedPairs.value.push(selectedFrisian.value)
    gameStore.incrementScore(10)
    
    feedback.value = {
      type: 'success',
      message: '✓ Correct!'
    }
    
    setTimeout(() => {
      feedback.value = null
    }, 500)
    
    // Check if game is complete
    if (matchedPairs.value.length === frisianWords.value.length) {
      setTimeout(() => {
        gameComplete.value = true
      }, 500)
    }
  } else {
    // Wrong match
    feedback.value = {
      type: 'error',
      message: '✗ Probeer opnieuw'
    }
    
    setTimeout(() => {
      feedback.value = null
    }, 500)
  }
  
  selectedFrisian.value = null
  selectedDutch.value = null
  gameStore.recordAttempt()
}
</script>

<style scoped>
.matching-game {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.game-header {
  text-align: center;
}

.game-header h2 {
  margin: 0 0 0.5rem 0;
  color: #667eea;
}

.start-screen,
.complete-screen {
  text-align: center;
  padding: 3rem;
}

.start-screen p,
.complete-screen p {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
}

.final-score {
  font-size: 1.5rem;
  font-weight: bold;
  color: #667eea;
}

.btn-start,
.btn-restart {
  padding: 1rem 2rem;
  font-size: 1.2rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-start:hover,
.btn-restart:hover {
  background: #5568d3;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
}

.game-board {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  width: 100%;
  max-width: 700px;
}

.column h3 {
  text-align: center;
  color: #667eea;
  margin-bottom: 1rem;
}

.word-card {
  padding: 1rem 1.5rem;
  margin-bottom: 0.75rem;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1.1rem;
  text-align: center;
}

.word-card:hover {
  border-color: #667eea;
  transform: translateX(4px);
}

.word-card.selected {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.word-card.matched {
  background: #48bb78;
  color: white;
  border-color: #48bb78;
  cursor: not-allowed;
  opacity: 0.6;
}

.feedback {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 1.5rem 3rem;
  border-radius: 8px;
  font-size: 1.5rem;
  font-weight: bold;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s ease;
}

.feedback.success {
  background: #48bb78;
  color: white;
}

.feedback.error {
  background: #f56565;
  color: white;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

@media (max-width: 768px) {
  .game-board {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
</style>
