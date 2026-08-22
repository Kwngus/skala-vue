<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import UnitToggler from './components/exercise/UnitToggler.vue';
import WindUnitToggler from './components/exercise/WindUnitToggler.vue';
import ThemeToggler from './components/exercise/ThemeToggler.vue';

const route = useRoute()
const isHomePage = computed(() => route.path === '/' || route.path === '/explore')
</script>

<template>
  <nav class="navbar" :class="{ 'on-hero': isHomePage }">
    <div class="nav-links">
    <RouterLink to ="/">날씨 대시보드</RouterLink>
    <RouterLink to ="/forest">숲</RouterLink>
    <RouterLink to ="/favorites">즐겨찾기</RouterLink>
    <RouterLink to ="/explore">탐험</RouterLink>
    <RouterLink to ="/about">서비스 소개</RouterLink>
    </div>
    <UnitToggler />
    <WindUnitToggler />
    <ThemeToggler />
  </nav>
  <main>
    <RouterView />
  </main>
</template>

<style scoped>
.navbar {
  --nav-muted: #b3b3b0;
  --nav-active: #1a1a1a;

  position: fixed;
  top: 32px;
  right: 32px;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 14px;
  padding: 8px;
}
.navbar.on-hero {
  --nav-muted: rgba(245, 241, 232, 0.55);
  --nav-active: #f5f1e8;
}
.nav-links {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}
.nav-links a {
  color: var(--nav-muted);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  text-decoration: none;
  text-align: right;
  transition: color 0.2s ease;
}
.nav-links a:hover {
  color: var(--nav-active);
}
.nav-links a.router-link-active {
  color: var(--nav-active);
  font-weight: 700;
}
main {
  padding: 0 20px 20px;
}

</style>
