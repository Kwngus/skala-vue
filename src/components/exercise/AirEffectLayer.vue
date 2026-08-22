<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'

const props = defineProps({
  aqi: { type: Number, default: 1 },
})

const effectRoot = ref(null)

const tier = computed(() => {
  if (props.aqi >= 4) return 'bad'
  if (props.aqi === 3) return 'moderate'
  return 'clear'
})

let lastSparkleTime = 0
let fogEl = null
const fogPos = { x: 0, y: 0 }
const fogTarget = { x: 0, y: 0 }
let rafId = null

const spawnSparkle = (x, y) => {
  const now = performance.now()
  if (now - lastSparkleTime < 80) return
  lastSparkleTime = now

  const size = 4 + Math.random() * 4
  const dot = document.createElement('div')
  dot.className = 'air-sparkle'
  dot.style.width = `${size}px`
  dot.style.height = `${size}px`
  dot.style.left = `${x - size / 2}px`
  dot.style.top = `${y - size / 2}px`
  effectRoot.value.appendChild(dot)

  setTimeout(() => dot.remove(), 1000)
}

const removeFog = () => {
  if (fogEl) {
    fogEl.remove()
    fogEl = null
  }
}

const updateFog = (x, y) => {
  fogTarget.x = x
  fogTarget.y = y

  const isNewFog = !fogEl
  if (isNewFog) {
    fogEl = document.createElement('div')
    fogEl.className = 'air-fog'
    effectRoot.value.appendChild(fogEl)
    fogPos.x = x
    fogPos.y = y
  }
  fogEl.classList.toggle('fog-bad', tier.value === 'bad')
  fogEl.classList.toggle('fog-moderate', tier.value !== 'bad')
}

const tickFog = () => {
  fogPos.x += (fogTarget.x - fogPos.x) * 0.08
  fogPos.y += (fogTarget.y - fogPos.y) * 0.08
  if (fogEl) {
    const radius = tier.value === 'bad' ? 100 : 60
    fogEl.style.transform = `translate(${fogPos.x - radius}px, ${fogPos.y - radius}px)`
  }
  rafId = requestAnimationFrame(tickFog)
}

const handleMouseMove = (e) => {
  if (tier.value === 'clear') {
    removeFog()
    spawnSparkle(e.clientX, e.clientY)
    return
  }
  updateFog(e.clientX, e.clientY)
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
  rafId = requestAnimationFrame(tickFog)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  if (rafId) cancelAnimationFrame(rafId)
  removeFog()
})
</script>

<template>
  <div class="air-effect" ref="effectRoot"></div>
</template>

<style scoped>
.air-effect {
  position: fixed;
  inset: 0;
  z-index: 5;
  pointer-events: none;
  overflow: hidden;
}
</style>

<style>
.air-sparkle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 253, 235, 0.85);
  box-shadow: 0 0 6px 2px rgba(255, 245, 200, 0.55);
  animation: air-sparkle-rise 1s ease-out forwards;
}
@keyframes air-sparkle-rise {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-18px);
  }
}

.air-fog {
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 50%;
  filter: blur(20px);
  will-change: transform;
}
.fog-moderate {
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, rgba(120, 120, 116, 0.55) 0%, rgba(120, 120, 116, 0) 70%);
}
.fog-bad {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(90, 78, 66, 0.72) 0%, rgba(90, 78, 66, 0) 70%);
}
</style>
