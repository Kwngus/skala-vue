<script setup>
import { ref } from 'vue'
import { useCompareStore } from '../../stores/compareStore.js'
import { getAqiLabel } from '../../api/weatherApi.js'

const compareStore = useCompareStore()
const showComparePanel = ref(false)
</script>

<template>
  <div v-if="compareStore.compareCount > 0" class="compare-tray">
    <div class="compare-chip" v-for="city in compareStore.comparedCities" :key="city.id">
      <span>{{ city.name }} {{ city.temp }}°</span>
      <button type="button" class="chip-remove" @click="compareStore.removeFromCompare(city.id)">×</button>
    </div>

    <button type="button" class="compare-btn" @click="showComparePanel = true">
      비교하기 ({{ compareStore.compareCount }})
    </button>
  </div>

  <div v-if="showComparePanel" class="compare-modal-backdrop" @click.self="showComparePanel = false">
    <div class="compare-modal">
      <button type="button" class="modal-close" @click="showComparePanel = false">×</button>
      <div class="compare-cards">
        <div v-for="city in compareStore.comparedCities" :key="city.id" class="compare-card">
          <h4>{{ city.name }}</h4>
          <p><span>기온</span><strong>{{ city.temp }}°C</strong></p>
          <p><span>풍속</span><strong>{{ city.wind }}m/s</strong></p>
          <p><span>대기질</span><strong>{{ getAqiLabel(city.aqi) }}</strong></p>
          <p><span>날씨</span><strong>{{ city.status }}</strong></p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.compare-tray {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(27, 43, 34, 0.85);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 10px 14px;
  border-radius: 999px;
}
.compare-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(245, 241, 232, 0.12);
  color: var(--forest-cream);
  font-size: 13px;
  padding: 6px 8px 6px 12px;
  border-radius: 999px;
  white-space: nowrap;
}
.chip-remove {
  background: none;
  border: none;
  color: var(--forest-cream);
  opacity: 0.7;
  font-size: 15px;
  line-height: 1;
  cursor: pointer;
  padding: 0 2px;
}
.chip-remove:hover {
  opacity: 1;
}
.compare-btn {
  background: var(--forest-cream);
  color: var(--forest-dark);
  border: none;
  border-radius: 999px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}
.compare-btn:hover {
  opacity: 0.9;
}

.compare-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(11, 20, 14, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.compare-modal {
  position: relative;
  background: var(--bg-panel);
  border-radius: 16px;
  padding: 32px 24px 24px;
  max-width: 90vw;
  overflow-x: auto;
}
.modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  font-size: 20px;
  line-height: 1;
  color: var(--text-body);
  cursor: pointer;
}
.compare-cards {
  display: flex;
  gap: 16px;
}
.compare-card {
  min-width: 160px;
  background: var(--bg-panel);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(27, 43, 34, 0.08);
}
.compare-card h4 {
  margin: 0 0 12px;
  font-size: 16px;
  color: var(--text-body);
}
.compare-card p {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin: 0 0 8px;
  font-size: 13px;
  color: var(--text-body);
}
.compare-card p span {
  opacity: 0.6;
}
.compare-card p:last-child {
  margin-bottom: 0;
}
</style>
