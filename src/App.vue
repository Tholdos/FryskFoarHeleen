<template>
  <div id="app">
    <header class="app-header">
      <h1>Frysk foar Heleen</h1>
    </header>

    <main class="app-main">
      <nav class="game-selector">
        <button 
          @click="currentGame = 'flashcard'" 
          :class="{ active: currentGame === 'flashcard' }"
        >
          Flashcards
        </button>
        <button 
          @click="currentGame = 'zinnen'" 
          :class="{ active: currentGame === 'zinnen' }"
        >
          Zinnen
        </button>
        <button 
          @click="currentGame = 'matching'" 
          :class="{ active: currentGame === 'matching' }"
        >
          Koppelen
        </button>
        <button 
          @click="currentGame = 'typing'" 
          :class="{ active: currentGame === 'typing' }"
        >
          Typen
        </button>
      </nav>

      <div class="game-container">
        <FlashCard v-if="currentGame === 'flashcard'" />
        <SentencesFlashCard v-else-if="currentGame === 'zinnen'" />
        <MatchingGame v-else-if="currentGame === 'matching'" />
        <TypingGame v-else-if="currentGame === 'typing'" />
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </main>

    <footer class="app-footer">
      <p><img src="/Pompeblêd.svg" class="footer-icon" alt="" /> voor Heleen</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useWordStore } from './stores/wordStore'
import { useSentenceStore } from './stores/sentenceStore'
import FlashCard from './components/FlashCard.vue'
import SentencesFlashCard from './components/SentencesFlashCard.vue'
import MatchingGame from './components/MatchingGame.vue'
import TypingGame from './components/TypingGame.vue'

const wordStore = useWordStore()
const sentenceStore = useSentenceStore()
const currentGame = ref('flashcard')
const error = ref('')

onMounted(async () => {
  try {
    await Promise.all([
      wordStore.fetchWords(),
      sentenceStore.fetchSentences()
    ])
  } catch (err) {
    error.value = 'Kon data niet laden. Controleer of de server draait.'
    console.error('Error loading data:', err)
  }
})
</script>

<style scoped>
.app-header {
  text-align: center;
  padding: 3rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.app-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('/Pompeblêd.svg');
  background-repeat: repeat;
  background-size: 150px 150px;
  opacity: 0.15;
  pointer-events: none;
}

.app-header h1 {
  margin: 0;
  font-size: 2.5rem;
  font-weight: bold;
  position: relative;
  z-index: 1;
}

.app-main {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

.game-selector {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.game-selector button {
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

.game-selector button:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
}

.game-selector button.active {
  background: #667eea;
  color: white;
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
}

.game-container {
  min-height: 400px;
}

.error-message {
  padding: 1rem;
  background: #fee;
  color: #c33;
  border-radius: 8px;
  margin-top: 1rem;
  text-align: center;
}

.app-footer {
  text-align: center;
  padding: 2rem;
  color: #666;
  font-size: 0.9rem;
}

.footer-icon {
  height: 1.3em;
  width: auto;
  vertical-align: middle;
  display: inline-block;
  margin: 0 0.2em;
}
</style>
