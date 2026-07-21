<template>
  <div id="app">
    <header class="app-header">
      <h1>Frysk foar Heleen</h1>
    </header>

    <main class="app-main">
      <!-- Main tabs -->
      <nav class="main-tabs">
        <button 
          @click="selectMainTab('flashcards')" 
          :class="{ active: currentMainTab === 'flashcards' }"
        >
          Flashcards
        </button>
        <button 
          @click="selectMainTab('spellen')" 
          :class="{ active: currentMainTab === 'spellen' }"
        >
          Spellen
        </button>
        <button 
          @click="selectMainTab('basis')" 
          :class="{ active: currentMainTab === 'basis' }"
        >
          Basis
        </button>
      </nav>

      <!-- Subtabs - only visible for active main tab -->
      <nav class="sub-tabs" v-if="currentMainTab === 'flashcards'">
        <button 
          @click="currentSubTab = 'woorden'" 
          :class="{ active: currentSubTab === 'woorden' }"
        >
          Woorden
        </button>
        <button 
          @click="currentSubTab = 'zinnen'" 
          :class="{ active: currentSubTab === 'zinnen' }"
        >
          Zinnen
        </button>
      </nav>

      <nav class="sub-tabs" v-if="currentMainTab === 'spellen'">
        <button 
          @click="currentSubTab = 'koppelen'" 
          :class="{ active: currentSubTab === 'koppelen' }"
        >
          Koppelen
        </button>
        <button 
          @click="currentSubTab = 'typen'" 
          :class="{ active: currentSubTab === 'typen' }"
        >
          Typen
        </button>
      </nav>

      <nav class="sub-tabs" v-if="currentMainTab === 'basis'">
        <button 
          @click="currentSubTab = 'klanken'" 
          :class="{ active: currentSubTab === 'klanken' }"
        >
          Klanken
        </button>
        <button 
          @click="currentSubTab = 'werkwoorden'" 
          :class="{ active: currentSubTab === 'werkwoorden' }"
          disabled
          title="Komt binnenkort"
        >
          Werkwoorden
        </button>
      </nav>

      <div class="game-container">
        <!-- Flashcards main tab content -->
        <FlashCard v-if="currentMainTab === 'flashcards' && currentSubTab === 'woorden'" />
        <SentencesFlashCard v-else-if="currentMainTab === 'flashcards' && currentSubTab === 'zinnen'" />
        
        <!-- Spellen main tab content -->
        <MatchingGame v-else-if="currentMainTab === 'spellen' && currentSubTab === 'koppelen'" />
        <TypingGame v-else-if="currentMainTab === 'spellen' && currentSubTab === 'typen'" />
        
        <!-- Basis main tab content -->
        <SoundsView v-else-if="currentMainTab === 'basis' && currentSubTab === 'klanken'" />
        <div v-else-if="currentMainTab === 'basis' && currentSubTab === 'werkwoorden'" class="placeholder">
          <p>Werkwoorden oefeningen komen binnenkort!</p>
        </div>
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
import SoundsView from './components/SoundsView.vue'
import MatchingGame from './components/MatchingGame.vue'
import TypingGame from './components/TypingGame.vue'

const wordStore = useWordStore()
const sentenceStore = useSentenceStore()
const currentMainTab = ref('flashcards')
const currentSubTab = ref('woorden')
const error = ref('')

// Function to handle main tab selection and set appropriate default subtab
const selectMainTab = (mainTab) => {
  currentMainTab.value = mainTab
  
  // Set default subtab based on main tab
  if (mainTab === 'flashcards') {
    currentSubTab.value = 'woorden'
  } else if (mainTab === 'spellen') {
    currentSubTab.value = 'koppelen'
  } else if (mainTab === 'basis') {
    currentSubTab.value = 'klanken'
  }
}

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
  width: 100%;
}

/* Main tabs */
.main-tabs {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1rem;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding: 0.5rem 0;
  margin-left: -2rem;
  margin-right: -2rem;
  padding-left: 2rem;
  padding-right: 2rem;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.main-tabs::-webkit-scrollbar {
  display: none;
}

.main-tabs button {
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
  border: 2px solid #667eea;
  background: white;
  color: #667eea;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
}

.main-tabs button:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
}

.main-tabs button.active {
  background: #667eea;
  color: white;
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
}

/* Subtabs */
.sub-tabs {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  margin-bottom: 1.5rem;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding: 0.5rem 0;
  margin-left: -2rem;
  margin-right: -2rem;
  padding-left: 2rem;
  padding-right: 2rem;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.sub-tabs::-webkit-scrollbar {
  display: none;
}

.sub-tabs button {
  padding: 0.5rem 1.25rem;
  font-size: 0.9rem;
  border: 2px solid #9f7aea;
  background: white;
  color: #9f7aea;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
}

.sub-tabs button:hover:not(:disabled) {
  background: #9f7aea;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(159, 122, 234, 0.3);
}

.sub-tabs button.active {
  background: #9f7aea;
  color: white;
  box-shadow: 0 4px 8px rgba(159, 122, 234, 0.3);
}

.sub-tabs button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  border-color: #ccc;
  color: #999;
}

.game-container {
  min-height: 400px;
}

.placeholder {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
  font-size: 1.2rem;
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

/* Mobile optimizations */
@media (max-width: 768px) {
  .app-header h1 {
    font-size: 1.8rem;
  }

  .app-header {
    padding: 2rem 1rem;
  }

  .app-main {
    padding: 1rem;
    max-width: 100%;
  }

  .game-selector {
    justify-content: flex-start;
    margin-bottom: 1.5rem;
    margin-left: -1rem;
    margin-right: -1rem;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .game-selector button {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
  }

  .game-container {
    min-height: 300px;
  }
}
</style>
