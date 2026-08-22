<script setup>
import { useConfigStore } from '../../stores/configStore.js'

const configStore = useConfigStore()
</script>

<template>
    <button class="nav-toggle-btn" @click="configStore.toggleTheme">
        {{ configStore.isDark ? '☀️ 라이트모드' : '🌙 다크모드' }}
    </button>
</template>

<style scoped>
.nav-toggle-btn {
  background: none;
  border: none;
  padding: 0;
  color: var(--nav-muted);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  cursor: pointer;
  transition: color 0.2s ease;
}
.nav-toggle-btn:hover {
  color: var(--nav-active);
}
</style>
