<script setup>
import { computed } from 'vue'

const props = defineProps({
  cityName: { type: String, default: '서울' },
  temp: { type: Number, default: 24 },
  status: { type: String, default: '맑음' },
  isGeoLocated: { type: Boolean, default: false },
})

const poeticLine = computed(() => {
  switch (props.status) {
    case '맑음':
      return '오늘, 하늘이 맑습니다'
    case '비':
      return '빗소리가 도시를 두드립니다'
    case '눈':
      return '거리가 고요히 덮였습니다'
    case '구름':
      return '옅은 구름이 흐릅니다'
    default:
      return `${props.cityName}의 오늘`
  }
})
</script>

<template>
  <section class="hero-forest">
    <div class="hero-forest__overlay"></div>

    <div class="hero-forest__content">
      <span class="hero-forest__label">
        {{ cityName }} · {{ status }}
        <span v-if="isGeoLocated" class="hero-forest__geo">📍 현재 위치</span>
      </span>
      <p class="hero-forest__poetic">{{ poeticLine }}</p>
      <div class="hero-forest__temp">{{ temp }}°</div>
    </div>

    <div class="hero-forest__scroll">scroll</div>
  </section>
</template>

<style scoped>
.hero-forest {
  position: relative;
  width: 100vw;
  margin-left: calc(50% - 50vw);
  height: 100vh;
  min-height: 640px;
  background:
    radial-gradient(circle at 25% 20%, var(--border-glass), transparent 45%),
    radial-gradient(circle at 75% 80%, var(--border-glass), transparent 50%),
    var(--bg-page);
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  opacity: 0;
  transform: translateY(24px);
  animation: hero-forest-in 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  box-sizing: border-box;
}

.hero-forest__overlay {
  position: absolute;
  inset: 0;
  background: none;
}
:global([data-theme='dark']) .hero-forest__overlay {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.15) 55%, transparent 100%);
}

.hero-forest__content {
  position: relative;
  z-index: 1;
  padding: 0 0 64px 48px;
  color: var(--text-body);
}

.hero-forest__label {
  display: block;
  font-weight: 300;
  font-size: 14px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 16px;
}

.hero-forest__geo {
  opacity: 0.65;
  font-size: 12px;
}

.hero-forest__poetic {
  margin: 0 0 12px;
  font-weight: 800;
  font-size: clamp(24px, 4vw, 40px);
  line-height: 1.3;
  max-width: 560px;
}

.hero-forest__temp {
  font-weight: 700;
  font-size: clamp(64px, 12vw, 160px);
  line-height: 1;
}

.hero-forest__scroll {
  position: absolute;
  right: 24px;
  bottom: 48px;
  z-index: 1;
  writing-mode: vertical-rl;
  font-size: 12px;
  font-weight: 300;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-muted);
  animation: hero-forest-scroll-blink 2.4s ease-in-out infinite;
}

@keyframes hero-forest-in {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes hero-forest-scroll-blink {
  0%,
  100% {
    opacity: 0.35;
    transform: translateY(0);
  }
  50% {
    opacity: 1;
    transform: translateY(-6px);
  }
}
</style>
