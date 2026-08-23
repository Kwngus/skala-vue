<script setup>
import { useConfigStore } from '../../stores/configStore.js'

const configStore = useConfigStore()

const selectUnit = (target) => {
  if (configStore.unit !== target) configStore.toggleUnit()
}
</script>

<template>
  <div class="segmented">
    <button
      type="button"
      class="segment"
      :class="{ active: configStore.unit === 'celsius' }"
      @click="selectUnit('celsius')"
    >°C</button>
    <button
      type="button"
      class="segment"
      :class="{ active: configStore.unit === 'fahrenheit' }"
      @click="selectUnit('fahrenheit')"
    >°F</button>
  </div>
</template>

<style scoped>
.segmented {
  display: inline-flex;
  background: var(--bg-muted);
  border: 1px solid var(--border-soft);
  border-radius: 999px;
  padding: 2px;
  gap: 2px;
  margin-top: 4px;
}
.segment {
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.03em;
  padding: 4px 12px;
  border-radius: 999px;
  cursor: pointer;
  transition: background-color 0.25s ease, color 0.25s ease;
}
.segment.active {
  background: var(--accent-block);
  color: var(--accent-block-text);
}
.segment:hover:not(.active) {
  color: var(--text-body);
}
</style>
