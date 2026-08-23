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

  <el-dialog
    v-model="showComparePanel"
    title="도시 비교"
    class="compare-dialog"
    align-center
  >
    <div class="compare-cards">
      <div v-for="city in compareStore.comparedCities" :key="city.id" class="compare-card">
        <h4>{{ city.name }}</h4>
        <p><span>기온</span><strong>{{ city.temp }}°C</strong></p>
        <p><span>풍속</span><strong>{{ city.wind }}m/s</strong></p>
        <p><span>대기질</span><strong>{{ getAqiLabel(city.aqi) }}</strong></p>
        <p><span>날씨</span><strong>{{ city.status }}</strong></p>
      </div>
    </div>
  </el-dialog>
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
  background: rgba(10, 10, 10, 0.85);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 10px 14px;
  border-radius: 999px;
}
.compare-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
  font-size: 13px;
  padding: 6px 8px 6px 12px;
  border-radius: 999px;
  white-space: nowrap;
}
.chip-remove {
  background: none;
  border: none;
  color: #ffffff;
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
  background: #ffffff;
  color: #000000;
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

.compare-cards {
  display: inline-flex;
  gap: 16px;
  overflow-x: auto;
}
.compare-card {
  min-width: 160px;
  background: var(--bg-panel);
  border: 1px solid var(--border-soft);
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
}
.compare-card p span {
  color: var(--text-muted);
}
.compare-card p strong {
  color: var(--text-body);
}
.compare-card p:last-child {
  margin-bottom: 0;
}
</style>

<style>
/* el-dialog는 Teleport로 렌더링되어 scoped 셀렉터가 닿지 않아 전역 스타일로 톤을 맞춤 */
.compare-dialog.el-dialog {
  --el-dialog-bg-color: var(--bg-panel);
  border-radius: 16px;
  width: fit-content !important;
  min-width: 320px;
  max-width: 92vw;
}
.compare-dialog .el-dialog__title {
  color: var(--text-body);
  font-weight: 700;
}
.compare-dialog .el-dialog__headerbtn .el-dialog__close {
  color: var(--text-body);
}
.compare-dialog .el-dialog__body {
  padding-top: 8px;
}
</style>
