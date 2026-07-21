<template>
  <div class="verbs-view">
    <h2>Friese werkwoorden</h2>
    <div v-if="verbStore.loading" class="loading">
      Lade...
    </div>

    <div v-else-if="verbStore.error" class="error">
      {{ verbStore.error }}
    </div>

    <div v-else class="verbs-list">
      <button
        v-for="verb in verbStore.verbs"
        :key="verb._id"
        @click="openModal(verb)"
        class="verb-button"
      >
        <span class="verb-infinitive">{{ verb.infinitive }}</span>
        <span class="verb-translation">{{ verb.translation }}</span>
      </button>
    </div>

    <!-- Modal for conjugation -->
    <div v-if="selectedVerb" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="close-button" @click="closeModal">&times;</button>
        
        <h3 class="modal-title">{{ selectedVerb.infinitive }}</h3>
        <p class="modal-subtitle">{{ selectedVerb.translation }}</p>

        <div class="conjugation-section">
          <h4>Foar de tiid (Tegenwoordige tijd)</h4>
          <div class="conjugation-grid">
            <div class="conjugation-row">
              <span class="pronoun">ik</span>
              <span class="conjugation">{{ selectedVerb.present.ik }}</span>
            </div>
            <div class="conjugation-row">
              <span class="pronoun">do</span>
              <span class="conjugation">{{ selectedVerb.present.do }}</span>
            </div>
            <div class="conjugation-row">
              <span class="pronoun">hy/sy</span>
              <span class="conjugation">{{ selectedVerb.present.hy_sy }}</span>
            </div>
            <div class="conjugation-row">
              <span class="pronoun">wy</span>
              <span class="conjugation">{{ selectedVerb.present.wy }}</span>
            </div>
            <div class="conjugation-row">
              <span class="pronoun">jim</span>
              <span class="conjugation">{{ selectedVerb.present.jim }}</span>
            </div>
            <div class="conjugation-row">
              <span class="pronoun">sy</span>
              <span class="conjugation">{{ selectedVerb.present.sy }}</span>
            </div>
          </div>
        </div>

        <div class="conjugation-section">
          <h4>Ferline tiid (Verleden tijd)</h4>
          <div class="conjugation-grid">
            <div class="conjugation-row">
              <span class="pronoun">ik</span>
              <span class="conjugation">{{ selectedVerb.past.ik }}</span>
            </div>
            <div class="conjugation-row">
              <span class="pronoun">do</span>
              <span class="conjugation">{{ selectedVerb.past.do }}</span>
            </div>
            <div class="conjugation-row">
              <span class="pronoun">hy/sy</span>
              <span class="conjugation">{{ selectedVerb.past.hy_sy }}</span>
            </div>
            <div class="conjugation-row">
              <span class="pronoun">wy</span>
              <span class="conjugation">{{ selectedVerb.past.wy }}</span>
            </div>
            <div class="conjugation-row">
              <span class="pronoun">jim</span>
              <span class="conjugation">{{ selectedVerb.past.jim }}</span>
            </div>
            <div class="conjugation-row">
              <span class="pronoun">sy</span>
              <span class="conjugation">{{ selectedVerb.past.sy }}</span>
            </div>
          </div>
        </div>

        <div class="conjugation-section">
          <h4>Foltooid tiid (Voltooid tegenwoordige tijd)</h4>
          <div class="perfect-tense">
            <span class="pronoun">ik</span>
            <span class="conjugation">{{ selectedVerb.perfect }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useVerbStore } from '../stores/verbStore'

const verbStore = useVerbStore()
const selectedVerb = ref(null)

onMounted(async () => {
  if (verbStore.verbs.length === 0) {
    await verbStore.fetchVerbs()
  }
})

function openModal(verb) {
  selectedVerb.value = verb
}

function closeModal() {
  selectedVerb.value = null
}
</script>

<style scoped>
.verbs-view {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

h2 {
  text-align: center;
  color: #667eea;
  margin-bottom: 0.5rem;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
  font-size: 0.95rem;
}

.loading,
.error {
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
}

.error {
  color: #c33;
}

.verbs-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.verb-button {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1.25rem;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.verb-button:hover {
  border-color: #9f7aea;
  box-shadow: 0 4px 12px rgba(159, 122, 234, 0.2);
  transform: translateY(-2px);
}

.verb-infinitive {
  font-size: 1.3rem;
  font-weight: 600;
  color: #667eea;
  margin-bottom: 0.5rem;
}

.verb-translation {
  font-size: 0.9rem;
  color: #666;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
  overflow-y: auto;
}

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 2rem;
  color: #999;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.close-button:hover {
  color: #333;
}

.modal-title {
  font-size: 2rem;
  color: #667eea;
  margin-bottom: 0.5rem;
}

.modal-subtitle {
  color: #666;
  margin-bottom: 2rem;
  font-size: 1rem;
}

.conjugation-section {
  margin-bottom: 2rem;
}

.conjugation-section:last-child {
  margin-bottom: 0;
}

.conjugation-section h4 {
  color: #9f7aea;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.conjugation-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.conjugation-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.pronoun {
  font-weight: 600;
  color: #555;
  min-width: 60px;
}

.conjugation {
  color: #667eea;
  font-size: 1.1rem;
  font-weight: 500;
}

.perfect-tense {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

@media (max-width: 600px) {
  .verbs-view {
    padding: 1rem;
  }

  .verbs-list {
    grid-template-columns: 1fr;
  }

  .modal-content {
    padding: 1.5rem;
  }

  .modal-title {
    font-size: 1.5rem;
  }
}
</style>
