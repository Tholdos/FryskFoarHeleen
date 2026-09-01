<template>
  <div class="secret-page">
    <button class="back-button" @click="$emit('back')">&larr; Terug</button>
    <h2>Geheime pagina</h2>
    <p>Kras de pompeblêden open om te zien wat je gewonnen hebt!</p>

    <div class="flag-container">
      <img src="/fryskeFlage.png" alt="Fryske flagge" class="flag-image" />
      <div
        v-for="(spot, index) in scratchSpots"
        :key="index"
        class="scratch-spot-wrapper"
        :style="{ left: spot.left, top: spot.top }"
      >
        <ScratchSpot :text="spotText(index)" @scratch-start="handleScratchStart(index)" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import ScratchSpot from './ScratchSpot.vue'

defineEmits(['back'])

// Order in which spots are scratched: { [spotIndex]: revealNumber }
const revealOrder = reactive({})
let nextRevealNumber = 1

// Placeholder gifts, indexed by reveal order. Replace with the real gift list later.
const gifts = ['CADEAU 1', 'CADEAU 2', 'CADEAU 3', 'CADEAU 4', 'CADEAU 5', 'CADEAU 6', 'CADEAU 7']

const handleScratchStart = (index) => {
  if (revealOrder[index] !== undefined) return
  revealOrder[index] = nextRevealNumber
  nextRevealNumber += 1
}

const spotText = (index) => {
  const revealNumber = revealOrder[index]
  return revealNumber ? gifts[revealNumber - 1] : ''
}

// Approximate center positions (%) of the 7 pompeblêden on fryskeFlage.png
const scratchSpots = [
  { left: '24.1%', top: '22%' },
  { left: '73.4%', top: '14.6%' },
  { left: '90.88%', top: '31.3%' },
  { left: '50.88%', top: '48.7%' },
  { left: '11%', top: '66%' },
  { left: '28.2%', top: '83%' },
  { left: '77.5%', top: '75.5%' }
]
</script>

<style scoped>
.secret-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.back-button {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  border: 2px solid #667eea;
  background: white;
  color: #667eea;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.back-button:hover {
  background: #667eea;
  color: white;
}

.flag-container {
  position: relative;
  width: 100%;
  max-width: 500px;
  margin: 1.5rem auto 0;
}

.flag-image {
  width: 100%;
  height: auto;
  display: block;
}

.scratch-spot-wrapper {
  position: absolute;
  width: 16%;
  aspect-ratio: 1 / 1;
  transform: translate(-50%, -50%);
}
</style>
