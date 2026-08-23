<script setup>
import { useConfigStore } from '../../stores/configStore.js'

const configStore = useConfigStore()

const selectWind = (target) => {
  if (configStore.windUnit !== target) configStore.toggleWindUnit()
}
</script>

<template>
  <div class="segmented">
    <button
      type="button"
      class="segment"
      :class="{ active: configStore.windUnit === 'ms' }"
      @click="selectWind('ms')"
    >M/S</button>
    <button
      type="button"
      class="segment"
      :class="{ active: configStore.windUnit === 'mph' }"
      @click="selectWind('mph')"
    >MPH</button>
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
