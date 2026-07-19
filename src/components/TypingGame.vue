<template>
  <div class="typing-game">
    <div class="game-header">
      <h2>Typ de vertaling</h2>
      <div class="stats">
        <span>{{ correctCount }}/{{ totalQuestions }}</span>
      </div>
    </div>

    <div v-if="!gameStarted" class="start-screen">
      <p>Typ de juiste vertaling van de gegeven woorden</p>
      <div class="difficulty-selector">
        <label>
          <input type="radio" v-model="direction" value="fry-nl" />
          Fries → Nederlands
        </label>
        <label>
          <input type="radio" v-model="direction" value="nl-fry" />
          Nederlands → Fries
        </label>
      </div>
      <div class="word-count-selector">
        <label for="wordCount">Aantal woorden:</label>
        <input 
          id="wordCount"
          v-model.number="totalQuestions" 
          type="number" 
          min="5" 
          max="25" 
          class="word-count-input"
        />
      </div>
      <button @click="startGame" class="btn-start">Start spel</button>
    </div>

    <div v-else-if="gameComplete" class="complete-screen">
      <p class="final-score">Score: {{ correctCount }}/{{ totalQuestions }}</p>
      <p class="percentage">{{ Math.round((correctCount / totalQuestions) * 100) }}% correct</p>
      <button @click="startGame" class="btn-restart">Opnieuw Spelen</button>
    </div>

    <div v-else class="game-board">
      <div class="question-card">
        <div class="question-number">
          Vraag {{ currentQuestionIndex + 1 }} / {{ totalQuestions }}
        </div>
        
        <div class="prompt">
          <div class="language-label">
            {{ direction === 'fry-nl' ? 'Fries' : 'Nederlands' }}
          </div>
          <div class="prompt-word">{{ currentQuestion.prompt }}</div>
          <div v-if="direction === 'fry-nl' && currentQuestion.pronunciation" class="pronunciation">
            ({{ currentQuestion.pronunciation }})
          </div>
        </div>

        <div class="answer-section">
          <label class="answer-label">
            {{ direction === 'fry-nl' ? 'Nederlands' : 'Fries' }}:
          </label>
          <input 
            ref="answerInput"
            v-model="userAnswer"
            type="text"
            class="answer-input"
            :class="{ 
              correct: feedback === 'correct',
              incorrect: feedback === 'incorrect'
            }"
            :disabled="feedback !== null"
            placeholder="Typ je antwoord..."
          />
        </div>

        <div v-if="feedback" class="feedback" :class="feedback">
          <div v-if="feedback === 'correct'" class="feedback-text">
            ✓ Correct!
          </div>
          <div v-else class="feedback-text">
            ✗ Fout. Het juiste antwoord is: <strong>{{ currentQuestion.correctAnswer }}</strong>
          </div>
        </div>

        <button 
          v-if="!feedback"
          @click="checkAnswer" 
          class="btn-check"
          :disabled="!userAnswer.trim()"
        >
          Controleer
        </button>
        <button 
          v-else
          @click="nextQuestion" 
          class="btn-next"
        >
          Volgende →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { useWordStore } from '../stores/wordStore'
import { useGameStore } from '../stores/gameStore'

const wordStore = useWordStore()
const gameStore = useGameStore()

const gameStarted = ref(false)
const gameComplete = ref(false)
const direction = ref('fry-nl') // 'fry-nl' or 'nl-fry'
const questions = ref([])
const currentQuestionIndex = ref(0)
const userAnswer = ref('')
const feedback = ref(null)
const correctCount = ref(0)
const answerInput = ref(null)
const totalQuestions = ref(10) // Default to 10 questions
const canProceed = ref(true) // Flag to prevent immediate Enter after checking

const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])

// Handle keyboard events at document level
function handleKeyPress(event) {
  if (event.key === 'Enter' && gameStarted.value && !gameComplete.value) {
    handleEnter()
  }
}

onMounted(() => {
  document.addEventListener('keyup', handleKeyPress)
})

onUnmounted(() => {
  document.removeEventListener('keyup', handleKeyPress)
})

function startGame() {
  // Validate and clamp totalQuestions
  if (totalQuestions.value < 5) totalQuestions.value = 5
  if (totalQuestions.value > 25) totalQuestions.value = 25
  
  gameStarted.value = true
  gameComplete.value = false
  currentQuestionIndex.value = 0
  correctCount.value = 0
  feedback.value = null
  userAnswer.value = ''
  
  // Get random words for questions
  const words = wordStore.getRandomWords(totalQuestions.value)
  questions.value = words.map(word => ({
    prompt: direction.value === 'fry-nl' ? word.frisian : word.dutch,
    correctAnswer: direction.value === 'fry-nl' ? word.dutch : word.frisian,
    pronunciation: word.pronunciation
  }))
  
  nextTick(() => {
    answerInput.value?.focus()
  })
}

function checkAnswer() {
  if (!userAnswer.value.trim()) return
  
  const correct = userAnswer.value.trim().toLowerCase() === 
                  currentQuestion.value.correctAnswer.toLowerCase()
  
  if (correct) {
    feedback.value = 'correct'
    correctCount.value++
    gameStore.incrementScore(10)
  } else {
    feedback.value = 'incorrect'
  }
  
  gameStore.recordAttempt()
  
  // Prevent immediate proceed, wait 500ms to show feedback
  canProceed.value = false
  setTimeout(() => {
    canProceed.value = true
  }, 500)
}

function handleEnter() {
  if (feedback.value && canProceed.value) {
    // If feedback is showing and enough time has passed, go to next question
    nextQuestion()
  } else if (!feedback.value) {
    // Otherwise, check the answer
    checkAnswer()
  }
}

function nextQuestion() {
  if (currentQuestionIndex.value < totalQuestions.value - 1) {
    currentQuestionIndex.value++
    userAnswer.value = ''
    feedback.value = null
    canProceed.value = true
    
    nextTick(() => {
      answerInput.value?.focus()
    })
  } else {
    gameComplete.value = true
  }
}
</script>

<style scoped>
.typing-game {
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

.stats {
  display: flex;
  gap: 2rem;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 600;
  color: #667eea;
}

.start-screen,
.complete-screen {
  text-align: center;
  padding: 3rem;
}

.start-screen p {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
}

.difficulty-selector {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  text-align: left;
}

.difficulty-selector label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  cursor: pointer;
}

.difficulty-selector input[type="radio"] {
  cursor: pointer;
}

.word-count-selector {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 2rem;
  align-items: center;
}

.word-count-selector label {
  font-size: 1.1rem;
  font-weight: 500;
  color: #333;
}

.word-count-input {
  padding: 0.5rem 1rem;
  font-size: 1.1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  text-align: center;
  width: 100px;
  transition: border-color 0.2s ease;
}

.word-count-input:focus {
  outline: none;
  border-color: #667eea;
}

.final-score {
  font-size: 2rem;
  font-weight: bold;
  color: #667eea;
  margin: 1rem 0;
}

.percentage {
  font-size: 1.3rem;
  color: #48bb78;
  margin-bottom: 2rem;
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
  width: 100%;
  max-width: 600px;
}

.question-card {
  background: white;
  padding: 3rem;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.question-number {
  text-align: center;
  color: #667eea;
  font-weight: 600;
  margin-bottom: 2rem;
}

.prompt {
  text-align: center;
  margin-bottom: 3rem;
}

.language-label {
  font-size: 0.9rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 1rem;
}

.prompt-word {
  font-size: 2.5rem;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 0.5rem;
}

.pronunciation {
  font-size: 1.1rem;
  color: #999;
  font-style: italic;
}

.answer-section {
  margin-bottom: 2rem;
}

.answer-label {
  display: block;
  font-weight: 600;
  color: #666;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.9rem;
}

.answer-input {
  width: 100%;
  padding: 1rem;
  font-size: 1.2rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.answer-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.answer-input.correct {
  border-color: #48bb78;
  background: #f0fff4;
}

.answer-input.incorrect {
  border-color: #f56565;
  background: #fff5f5;
}

.answer-input:disabled {
  background: #f7fafc;
  cursor: not-allowed;
}

.feedback {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  text-align: center;
  font-weight: 600;
}

.feedback.correct {
  background: #f0fff4;
  color: #38a169;
  border: 2px solid #48bb78;
}

.feedback.incorrect {
  background: #fff5f5;
  color: #c53030;
  border: 2px solid #f56565;
}

.feedback-text strong {
  font-weight: bold;
}

.btn-check,
.btn-next {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-check {
  background: #667eea;
  color: white;
}

.btn-check:hover:not(:disabled) {
  background: #5568d3;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
}

.btn-check:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
}

.btn-next {
  background: #48bb78;
  color: white;
}

.btn-next:hover {
  background: #38a169;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(72, 187, 120, 0.3);
}
</style>
