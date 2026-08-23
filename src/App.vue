<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import UnitToggler from './components/exercise/UnitToggler.vue';
import WindUnitToggler from './components/exercise/WindUnitToggler.vue';
import ThemeToggler from './components/exercise/ThemeToggler.vue';

const route = useRoute()
const isHomePage = computed(() => route.path === '/' || route.path === '/explore')
const isNavOpen = ref(false)
</script>

<template>
  <nav class="navbar" :class="{ 'on-hero': isHomePage }">
    <button class="nav-toggle" @click="isNavOpen = !isNavOpen">
      {{ isNavOpen ? '✕' : '☰' }}
    </button>
    <div class="nav-body" :class="{ open: isNavOpen }">
      <div class="nav-links">
      <RouterLink to ="/">날씨 대시보드</RouterLink>
      <RouterLink to ="/forest">국내 도시</RouterLink>
      <RouterLink to ="/favorites">즐겨찾기</RouterLink>
      <RouterLink to ="/explore">전세계</RouterLink>
      <RouterLink to ="/about">서비스 소개</RouterLink>
      <RouterLink to ="/showcase">실습기록</RouterLink>
      </div>
      <UnitToggler />
      <WindUnitToggler />
      <ThemeToggler />
    </div>
  </nav>
  <main>
    <RouterView />
  </main>
</template>

<style scoped>
.navbar {
  --nav-muted: var(--text-muted);
  --nav-active: var(--text-body);

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
  --nav-muted: var(--text-muted);
  --nav-active: var(--text-body);
}
.nav-toggle {
  background: var(--bg-panel);
  border: 1px solid var(--border-glass);
  color: var(--text-body);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 8px;
  align-self: flex-end;
}
.nav-body {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 14px;
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: max-height 0.3s ease, opacity 0.3s ease;
}
.nav-body.open {
  max-height: 400px;
  opacity: 1;
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
