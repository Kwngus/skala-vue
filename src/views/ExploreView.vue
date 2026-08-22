<script setup>
import { onMounted } from 'vue'
import CityMap from '../components/exercise/CityMap.vue'
import CompareTray from '../components/exercise/CompareTray.vue'
import { useExploreStore } from '../stores/exploreStore.js'

const exploreStore = useExploreStore()

onMounted(() => {
  exploreStore.fetchGlobalCities()
})
</script>

<template>
  <div class="explore-page">
    <div class="explore-title">🌍 전세계 숲과 도시</div>

    <div v-if="exploreStore.isLoading" class="loading-overlay">🌍 전세계 날씨를 불러오는 중...</div>
    <p v-if="exploreStore.loadError" class="error-overlay">⚠️ 일부 도시 정보를 불러오지 못했습니다.</p>

    <CityMap
      class="explore-map"
      :cities="exploreStore.cities"
      map-height="100vh"
      :center-lat="20"
      :center-lon="20"
      :zoom="2"
      :dark-mode="true"
    />

    <CompareTray />
  </div>
</template>

<style scoped>
.explore-page {
  position: relative;
}
.explore-map {
  width: 100vw;
  margin-left: calc(50% - 50vw);
}
.explore-title {
  position: absolute;
  top: 24px;
  left: 24px;
  z-index: 10;
  background: rgba(27, 43, 34, 0.55);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: var(--forest-cream);
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
  padding: 10px 18px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  pointer-events: none;
}
.loading-overlay,
.error-overlay {
  position: absolute;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  background: rgba(27, 43, 34, 0.55);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: #f5f1e8;
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 12px;
  pointer-events: none;
}
</style>
