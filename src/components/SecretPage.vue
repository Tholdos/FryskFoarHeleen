<template>
  <div class="secret-page">
    <button class="back-button" @click="$emit('back')">&larr; Terug</button>
    <p>Leave Heleen,</p>
    <p>Fan herte lokwinske mei dyn jierdei! 
      Kras de pompeblêden iepen om te sjen watst wûn hast!</p>
    <p>-xx- Douwe</p>

    <div class="flag-container" ref="flagContainerRef">
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

    <div v-if="overlayState !== 'hidden'" class="names-overlay" :class="{ 'is-fading': overlayState === 'fading', 'is-visible-backdrop': overlayState === 'visible' }">
      <div class="names-overlay-content">
        <div class="name-line name-line-heleen">
          <span
            v-for="(letter, i) in heleenLetters"
            :key="'h' + i"
            :ref="el => setHeleenRef(el, i)"
            class="name-letter letter-gold"
          >{{ letter }}</span>
        </div>
        <div class="name-line name-line-xx">
          <span v-for="i in [0, 1]" :key="'x' + i" :ref="el => setXxRef(el, i)" class="name-letter letter-pink">x</span>
        </div>
        <div class="name-line name-line-douwe">
          <span
            v-for="(letter, i) in douweLetters"
            :key="'d' + i"
            :ref="el => setDouweRef(el, i)"
            class="name-letter letter-cyan"
          >{{ letter }}</span>
        </div>
      </div>
    </div>

    <div v-if="overlayState !== 'hidden'" class="flight-layer">
      <span
        v-for="fl in flyingLetters"
        :key="fl.id"
        class="flying-letter"
        :class="fl.colorClass"
        :style="fl.style"
      >{{ fl.text }}</span>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, nextTick, onBeforeUnmount } from 'vue'
import ScratchSpot from './ScratchSpot.vue'

defineEmits(['back'])

// Order in which spots are scratched: { [spotIndex]: revealNumber }
const revealOrder = reactive({})
let nextRevealNumber = 1

// Overlay lifecycle: 'hidden' -> 'highlighting' (letters grow in place) -> 'visible' (rearranged) -> 'fading' -> 'hidden'
const overlayState = ref('hidden')
const heleenLetters = 'HELEEN'.split('')
const douweLetters = 'DOUWE'.split('')
let overlayTimers = []

const flagContainerRef = ref(null)
const heleenLetterEls = ref([])
const xxLetterEls = ref([])
const douweLetterEls = ref([])
// Clones flying over the flag; the name-letter spans above are invisible layout anchors used to measure targets
const flyingLetters = ref([])
// Highlighted flag letters the flying letters originated from, so we can restore them afterwards
let capturedSources = null

function setHeleenRef(el, i) { if (el) heleenLetterEls.value[i] = el }
function setXxRef(el, i) { if (el) xxLetterEls.value[i] = el }
function setDouweRef(el, i) { if (el) douweLetterEls.value[i] = el }

// Grab the actual colored letter elements currently shown on the flag, grouped by highlight color
function collectSourceLetters() {
  if (!flagContainerRef.value) return { color1: [], color2: [], color3: [] }
  return {
    color1: Array.from(flagContainerRef.value.querySelectorAll('.highlight-1')),
    color2: Array.from(flagContainerRef.value.querySelectorAll('.highlight-2')),
    color3: Array.from(flagContainerRef.value.querySelectorAll('.highlight-3'))
  }
}

// Pair each letter of a target word with a source element that displays that same letter
function matchSourcesToWord(sources, word) {
  const pool = [...sources]
  return word.split('').map((letter) => {
    const idx = pool.findIndex((el) => el.textContent.trim().toUpperCase() === letter)
    const [match] = pool.splice(idx === -1 ? 0 : idx, 1)
    return match || null
  })
}

function makeFlyingLetter(id, text, colorClass, sourceEl, targetEl) {
  const rect = sourceEl ? sourceEl.getBoundingClientRect() : null
  const startFontSize = sourceEl ? parseFloat(getComputedStyle(sourceEl).fontSize) : 16
  const cx = rect ? rect.left + rect.width / 2 : window.innerWidth / 2
  const cy = rect ? rect.top + rect.height / 2 : window.innerHeight / 2
  return {
    id,
    text,
    colorClass,
    targetEl,
    style: {
      left: `${cx}px`,
      top: `${cy}px`,
      fontSize: `${startFontSize}px`,
      transition: 'none'
    }
  }
}

function buildFlyingLetters(sources) {
  const heleenSources = matchSourcesToWord(sources.color1, 'HELEEN')
  const douweSources = matchSourcesToWord(sources.color2, 'DOUWE')
  const xxSource = sources.color3[0] || null

  return [
    ...heleenLetters.map((letter, i) =>
      makeFlyingLetter('h' + i, letter, 'letter-gold', heleenSources[i], heleenLetterEls.value[i])),
    ...[0, 1].map((i) =>
      makeFlyingLetter('x' + i, 'x', 'letter-pink', xxSource, xxLetterEls.value[i])),
    ...douweLetters.map((letter, i) =>
      makeFlyingLetter('d' + i, letter, 'letter-cyan', douweSources[i], douweLetterEls.value[i]))
  ]
}

// Phase 1: grow the letter in place (still at its original flag position) and bring it to the front
function growInPlace(fl) {
  const startPx = parseFloat(fl.style.fontSize) || 16
  const grownPx = Math.min(Math.max(startPx * 3, 40), 90)
  fl.style.transition = 'font-size 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
  fl.style.fontSize = `${grownPx}px`
}

// Phase 2: move the grown letter to its slot in the final arranged names
function flyToTarget(fl) {
  if (!fl.targetEl) return
  const rect = fl.targetEl.getBoundingClientRect()
  const targetFontSize = getComputedStyle(fl.targetEl).fontSize
  fl.style.transition = 'left 0.9s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.9s cubic-bezier(0.34, 1.56, 0.64, 1), font-size 0.7s ease'
  fl.style.left = `${rect.left + rect.width / 2}px`
  fl.style.top = `${rect.top + rect.height / 2}px`
  fl.style.fontSize = targetFontSize
}

function scheduleOverlaySequence() {
  overlayTimers.push(setTimeout(async () => {
    capturedSources = collectSourceLetters()
    heleenLetterEls.value = []
    xxLetterEls.value = []
    douweLetterEls.value = []
    overlayState.value = 'highlighting'

    // Wait for the invisible name-letter placeholders to mount so we know their final target positions
    await nextTick()
    flyingLetters.value = buildFlyingLetters(capturedSources)

    // Hide the originals now that their clones sit exactly on top of them
    Object.values(capturedSources).flat().forEach((el) => {
      el.style.transition = 'opacity 0.2s ease'
      el.style.opacity = '0'
    })

    requestAnimationFrame(() => {
      flyingLetters.value.forEach((fl) => growInPlace(fl))
    })

    overlayTimers.push(setTimeout(() => {
      overlayState.value = 'visible'
      flyingLetters.value.forEach((fl) => flyToTarget(fl))

      overlayTimers.push(setTimeout(() => {
        overlayState.value = 'fading'
        overlayTimers.push(setTimeout(() => {
          overlayState.value = 'hidden'
          flyingLetters.value = []
          // Bring the flag's own letters back into view now that the overlay is gone
          if (capturedSources) {
            Object.values(capturedSources).flat().forEach((el) => {
              el.style.transition = ''
              el.style.opacity = ''
            })
            capturedSources = null
          }
        }, 2000))
      }, 10000))
    }, 1300))
  }, 3000))
}

onBeforeUnmount(() => {
  overlayTimers.forEach(clearTimeout)
})

// Placeholder gifts, indexed by reveal order. Replace with the real gift list later.
// Wrap letters in *asterisks* to highlight them: 'Kra*s*loten' = color 1, 'Kra*2:s*loten' = color 2 (1-3 supported).
// Use | to force a line break, e.g. 'Dagje|Welness'.
const gifts = ['*3:xx*', 'KRAS*L**2:O*TEN', 'KAARTJ*E*', 'KERSE*N*BOOGER*2:D*', 'P*2:U*ZZ*E*L', '*H**2:E*T PARADIJS',
 'DAGJ*E*|*2:W*ELNESS']
// const gifts = ['CADEAU 1', 'CADEAU 2', 'CADEAU 3', 'CADEAU 4', 'CADEAU 5', 'CADEAU 6', 'CADEAU 7']

const handleScratchStart = (index) => {
  if (revealOrder[index] !== undefined) return
  revealOrder[index] = nextRevealNumber
  nextRevealNumber += 1

  if (Object.keys(revealOrder).length === scratchSpots.length) {
    scheduleOverlaySequence()
  }
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

.names-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(8, 8, 28, 0.82);
  backdrop-filter: blur(6px);
  opacity: 0;
  transition: opacity 0.8s ease;
}

.names-overlay.is-visible-backdrop {
  opacity: 1;
}

.names-overlay.is-fading {
  opacity: 0;
  transition-duration: 2s;
}

.names-overlay-content {
  text-align: center;
}

.name-line {
  display: flex;
  justify-content: center;
  gap: 0.12em;
  flex-wrap: wrap;
}

.name-line-xx {
  margin: 0.4rem 0;
}

.name-letter {
  display: inline-block;
  font-weight: 800;
  font-size: clamp(2.2rem, 9vw, 4.5rem);
  opacity: 0;
}

.name-line-xx .name-letter {
  font-size: clamp(1.3rem, 5vw, 2.2rem);
}

.letter-gold {
  color: #ffd700;
}

.letter-cyan {
  color: #00e5ff;
}

.letter-pink {
  color: #ff6ec7;
}

.flight-layer {
  position: fixed;
  inset: 0;
  z-index: 1100;
  pointer-events: none;
}

.flying-letter {
  position: fixed;
  transform: translate(-50%, -50%);
  font-weight: 800;
  white-space: nowrap;
  text-shadow: 0 0 24px currentColor, 0 6px 16px rgba(0, 0, 0, 0.5);
}
</style>
