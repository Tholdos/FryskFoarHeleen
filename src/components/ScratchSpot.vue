<template>
  <div class="scratch-spot" ref="containerRef">
    <div class="scratch-text">{{ text }}</div>
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
import { ref, onMounted, onBeforeUnmount } from 'vue'

defineProps({
  text: { type: String, default: '' }
})

const emit = defineEmits(['scratch-start'])

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
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.55rem;
  color: white;
  background: #667eea;
  text-align: center;
  padding: 0.2rem;
  user-select: none;
}

.scratch-canvas {
  position: absolute;
  inset: 0;
  touch-action: none;
  cursor: pointer;
}
</style>
