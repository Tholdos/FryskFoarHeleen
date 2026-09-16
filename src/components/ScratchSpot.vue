<template>
  <div class="scratch-spot" ref="containerRef">
    <div class="scratch-text" :style="{ fontSize }">
      <div v-for="(lineSegments, li) in textLines" :key="li" class="gift-line">
        <template v-for="(segment, i) in lineSegments" :key="i">
          <span v-if="segment.color" :class="'highlight-' + segment.color">{{ segment.text }}</span>
          <template v-else>{{ segment.text }}</template>
        </template>
      </div>
    </div>
    <canvas
      ref="canvasRef"
      class="scratch-canvas"
      @mousedown="startScratch"
      @mousemove="scratchMove"
      @mouseup="endScratch"
      @mouseleave="endScratch"
      @touchstart.prevent="startScratch"
      @touchmove.prevent="scratchMove"
      @touchend.prevent="endScratch"
    ></canvas>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  text: { type: String, default: '' }
})

const emit = defineEmits(['scratch-start'])

// Wrap letters in *asterisks* to highlight them, e.g. "Kra*s*loten" (color 1) or "Kra*2:s*loten" (color 2, 1-3 supported).
// Use | to force a line break, e.g. "Dagje|Welness".
function parseSegments(line) {
  const segments = []
  const regex = /\*(?:(\d):)?(.*?)\*/g
  let lastIndex = 0
  let match
  while ((match = regex.exec(line)) !== null) {
    if (match.index > lastIndex) segments.push({ text: line.slice(lastIndex, match.index), color: null })
    segments.push({ text: match[2], color: Number(match[1]) || 1 })
    lastIndex = regex.lastIndex
  }
  if (lastIndex < line.length) segments.push({ text: line.slice(lastIndex), color: null })
  return segments
}

const textLines = computed(() => props.text.split('|').map(parseSegments))

// Shrink the font as the visible text gets longer so it stays inside the small leaf shape.
// Uses cqw (container query width) so the size scales with the actual rendered pompeblêd size on any device.
const fontSize = computed(() => {
  const len = props.text.replace(/\*(?:\d:)?/g, '').replace(/\|/g, '').length
  if (len <= 10) return '11cqw'
  if (len <= 16) return '9.2cqw'
  if (len <= 22) return '8cqw'
  return '6.8cqw'
})

const BRUSH_RADIUS = 16

const containerRef = ref(null)
const canvasRef = ref(null)
let ctx = null
let isScratching = false
let hasStartedScratch = false
let resizeObserver = null

// Draws (or redraws) the scratch coating covering the hidden text
function paintCoating() {
  const container = containerRef.value
  const canvas = canvasRef.value
  if (!container || !canvas) return

  const rect = container.getBoundingClientRect()
  const dpr = window.devicePixelRatio || 1
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  canvas.style.width = `${rect.width}px`
  canvas.style.height = `${rect.height}px`

  ctx = canvas.getContext('2d')
  ctx.scale(dpr, dpr)
  ctx.globalCompositeOperation = 'source-over'
  ctx.fillStyle = '#ea2117'
  ctx.fillRect(0, 0, rect.width, rect.height)
}

function getPointerPos(event) {
  const canvas = canvasRef.value
  const rect = canvas.getBoundingClientRect()
  const point = event.touches ? event.touches[0] : event
  return { x: point.clientX - rect.left, y: point.clientY - rect.top }
}

function scratchAt(x, y) {
  if (!ctx) return
  ctx.globalCompositeOperation = 'destination-out'
  ctx.beginPath()
  ctx.arc(x, y, BRUSH_RADIUS, 0, Math.PI * 2)
  ctx.fill()
}

function startScratch(event) {
  isScratching = true
  if (!hasStartedScratch) {
    hasStartedScratch = true
    emit('scratch-start')
  }
  const { x, y } = getPointerPos(event)
  scratchAt(x, y)
}

function scratchMove(event) {
  if (!isScratching) return
  const { x, y } = getPointerPos(event)
  scratchAt(x, y)
}

function endScratch() {
  isScratching = false
}

onMounted(() => {
  paintCoating()
  resizeObserver = new ResizeObserver(() => paintCoating())
  if (containerRef.value) resizeObserver.observe(containerRef.value)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
})
</script>

<style scoped>
.scratch-spot {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  /* Establishes a query container so .scratch-text can size its font in cqw units */
  container-type: inline-size;
  /* Clip both the hidden text and the scratch coating to the pompeblêd silhouette */
  -webkit-mask-image: url('/Pompeblêd.svg');
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  -webkit-mask-size: contain;
  mask-image: url('/Pompeblêd.svg');
  mask-repeat: no-repeat;
  mask-position: center;
  mask-size: contain;
}

.scratch-text {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  line-height: 1.05;
  color: white;
  background: #667eea;
  text-align: center;
  padding: 0.2rem;
  user-select: none;
  /* Nudge text down to stay inside the pompeblêd silhouette, which narrows near the top */
  transform: translateY(12%);
}

.gift-line {
  width: 100%;
}

.highlight-1 {
  color: #ffd700;
}

.highlight-2 {
  color: #00e5ff;
}

.highlight-3 {
  color: #ff6ec7;
}

.scratch-canvas {
  position: absolute;
  inset: 0;
  touch-action: none;
  cursor: pointer;
}
</style>
