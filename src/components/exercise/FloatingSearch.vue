<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useWeatherStore } from '../../stores/weatherStore.js'

const router = useRouter()
const weatherStore = useWeatherStore()

const localQuery = ref('')
const isVisible = ref(false)

let ticking = false

const handleScroll = () => {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    isVisible.value = window.scrollY > window.innerHeight * 0.25
    ticking = false
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const handleSearch = () => {
  const term = localQuery.value.trim()
  if (!term) return

  const matched = weatherStore.cityList.find((city) => city.name.includes(term))
  if (matched) {
    router.push('/weather/' + matched.id)
  } else {
    router.push({ path: '/forest', query: { q: term } })
  }
}
</script>

<template>
  <div class="floating-search" :class="{ visible: isVisible }">
    <input
      v-model="localQuery"
      @keyup.enter="handleSearch"
      placeholder="도시를 검색해보세요"
    />
  </div>
</template>

<style scoped>
.floating-search {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) translateY(12px);
  z-index: 40;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.floating-search.visible {
  opacity: 1;
  pointer-events: auto;
  transform: translate(-50%, -50%);
}
.floating-search input {
  width: min(90vw, 420px);
  padding: 14px 20px;
  border-radius: 999px;
  background: rgba(245, 241, 232, 0.9);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: none;
  font-size: 15px;
  text-align: center;
  color: var(--forest-dark, #1b2b22);
}
.floating-search input:focus {
  outline: none;
}
.floating-search input::placeholder {
  color: var(--forest-dark, #1b2b22);
  opacity: 0.5;
}
</style>
