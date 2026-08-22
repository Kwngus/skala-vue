<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const goHome = () => router.push('/')
</script>

<template>
  <div class="notfound-section">
    <div class="icon-row">
      <span class="icon-sun">☀️</span>
      <span class="icon-question">❓</span>
    </div>
    <h2>페이지를 찾을 수 없습니다.</h2>
    <p>요청하신 주소가 존재하지 않거나,<br />아직 개발되지 않았습니다.</p>
    <button @click="goHome">날씨 메인으로 이동</button>
  </div>
</template>

<style scoped>
.notfound-section {
  max-width: 380px;
  margin: 60px auto;
  padding: 48px 32px;
  text-align: center;
  background: var(--bg-panel);
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  font-family: sans-serif;
}
.icon-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}
.icon-sun {
  font-size: 44px;
}
.icon-question {
  font-size: 32px;
}
.notfound-section h2 {
  margin: 0 0 12px;
  font-size: 19px;
  font-weight: 700;
  color: var(--text-body);
}
.notfound-section p {
  font-size: 14px;
  color: var(--text-muted);
  line-height: 1.6;
  margin: 0 0 28px;
}
.notfound-section button {
  padding: 10px 28px;
  border: none;
  border-radius: 999px;
  background: #1971c2;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
}
.notfound-section button:hover {
  background: #1864ab;
}
</style>