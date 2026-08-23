<script setup>
import { useRouter } from 'vue-router'
import WeatherMockup from '../components/practices/vue-syntax/WeatherMockup.vue'
import WeatherComposition from '../components/practices/vue-syntax/WeatherComposition.vue'
import SlotDefaultParent from '../components/practices/component/SlotDefaultParent.vue'
import SlotNamedParent from '../components/practices/component/SlotNamedParent.vue'
import LifecycleChild from '../components/practices/component/LifecycleChild.vue'

const router = useRouter()
const goHome = () => router.push('/')
</script>

<template>
  <div class="showcase-wrapper">
    <header class="showcase-header">
      <h1>실습 기록</h1>
      <p class="subtitle">
        각 단원의 요구사항과 그 위에 직접 추가한 기능들을 모았습니다.
      </p>
    </header>

    <section class="screens-section">
      <p class="section-label">실습 당시 화면 다시 보기</p>
      <p class="section-desc">
        실습 중 직접 만든 컴포넌트를 지금 그대로 불러온 것입니다.
        원본 스타일을 그대로 유지했습니다.
      </p>

      <div class="screen-frame">
        <div class="screen-frame-bar">
          <span class="dot"></span><span class="dot"></span><span class="dot"></span>
          <span class="frame-label">Vue Syntax — Weather Mockup</span>
        </div>
        <div class="screen-frame-body">
          <WeatherMockup />
        </div>
      </div>

      <div class="screen-frame">
        <div class="screen-frame-bar">
          <span class="dot"></span><span class="dot"></span><span class="dot"></span>
          <span class="frame-label">Composition API — Weather Composition</span>
        </div>
        <div class="screen-frame-body">
          <WeatherComposition />
        </div>
      </div>

      <div class="mini-screens-row">
        <div class="screen-frame mini">
          <div class="screen-frame-bar">
            <span class="dot"></span><span class="dot"></span><span class="dot"></span>
            <span class="frame-label">Slot — Default</span>
          </div>
          <div class="screen-frame-body">
            <SlotDefaultParent />
          </div>
        </div>
        <div class="screen-frame mini">
          <div class="screen-frame-bar">
            <span class="dot"></span><span class="dot"></span><span class="dot"></span>
            <span class="frame-label">Slot — Named</span>
          </div>
          <div class="screen-frame-body">
            <SlotNamedParent />
          </div>
        </div>
        <div class="screen-frame mini">
          <div class="screen-frame-bar">
            <span class="dot"></span><span class="dot"></span><span class="dot"></span>
            <span class="frame-label">Lifecycle Hook</span>
          </div>
          <div class="screen-frame-body">
            <LifecycleChild />
          </div>
        </div>
      </div>
    </section>

    <section class="lab-card">
      <h2>Vue Router</h2>
      <ul class="req-list">
        <li>지연 로딩</li>
        <li>Catch-all Route</li>
        <li>동적 라우트(:cityId)</li>
      </ul>
      <ul class="my-list">
        <li>ForestView(도시 목록+지도+검색), FavoritesView(즐겨찾기 전용), ExploreView(전세계 지도) — View 3개 신설</li>
      </ul>
      <RouterLink to="/forest" class="lab-btn">도시 목록</RouterLink>
      <RouterLink to="/favorites" class="lab-btn">즐겨찾기</RouterLink>
      <RouterLink to="/explore" class="lab-btn">탐험</RouterLink>
    </section>

    <section class="lab-card">
      <h2>Pinia</h2>
      <ul class="req-list">
        <li>configStore(state unit, getter unitSymbol, action toggleUnit)</li>
      </ul>
      <ul class="my-list">
        <li>weatherStore(캐싱), favoriteStore(즐겨찾기+localStorage), compareStore(비교함), exploreStore(전세계 데이터), 풍속 단위 토글, 다크모드</li>
      </ul>
      <p class="hint">우측 상단 메뉴에서 직접 토글해보세요</p>
    </section>

    <section class="lab-card">
      <h2>Axios</h2>
      <ul class="req-list">
        <li>OpenWeatherMap Current Weather API</li>
      </ul>
      <ul class="my-list">
        <li>Air Pollution API, 5 Day Forecast API, Sunrise-Sunset API(외부 서비스), 위치 기반 조회</li>
      </ul>
      <RouterLink to="/weather/city_01" class="lab-btn">상세 정보 보기</RouterLink>
    </section>

    <section class="lab-card">
      <h2>UI Library</h2>
      <ul class="req-list">
        <li>Element Plus 적용</li>
      </ul>
      <ul class="my-list">
        <li>el-tag(뱃지), el-dialog(비교 모달), el-button(버튼)</li>
      </ul>
      <RouterLink to="/explore" class="lab-btn">비교함 체험하기</RouterLink>
    </section>

    <section class="feature-grid">
      <div class="feature-card">
        <p class="feature-icon">🗺️</p>
        <h3>전세계 지도</h3>
        <p>9개 도시를 흑백 테마 지도에서 한눈에</p>
      </div>
      <div class="feature-card">
        <p class="feature-icon">⚖️</p>
        <h3>도시 비교함</h3>
        <p>최대 3개 도시를 담아 나란히 비교</p>
      </div>
      <div class="feature-card">
        <p class="feature-icon">🌙</p>
        <h3>다크모드</h3>
        <p>전역 테마 전환, 새로고침해도 유지</p>
      </div>
      <div class="feature-card">
        <p class="feature-icon">📍</p>
        <h3>위치 자동감지</h3>
        <p>브라우저 위치 기반으로 내 지역 날씨 표시</p>
      </div>
      <div class="feature-card">
        <p class="feature-icon">✨</p>
        <h3>대기질 인터랙션</h3>
        <p>실시간 대기질에 따라 마우스 이펙트 변화</p>
      </div>
      <div class="feature-card">
        <p class="feature-icon">🕐</p>
        <h3>검색 히스토리</h3>
        <p>최근 검색한 도시 기록, localStorage 저장</p>
      </div>
    </section>

    <button class="home-btn" @click="goHome">메인으로 돌아가기</button>
  </div>
</template>

<style scoped>
.showcase-wrapper {
  max-width: 960px;
  margin: 0 auto;
  padding: 60px 24px;
  font-family: sans-serif;
}

.showcase-header {
  text-align: center;
  margin-bottom: 48px;
}
.eyebrow {
  font-size: 13px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin: 0 0 16px;
}
.showcase-header h1 {
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 800;
  color: var(--text-body);
  margin: 0 0 16px;
  line-height: 1.3;
}
.subtitle {
  font-size: 15px;
  font-weight: 300;
  color: var(--text-body);
  opacity: 0.75;
  margin: 0;
  line-height: 1.6;
}

.screens-section { margin-bottom: 48px; }
.section-label {
  font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--text-muted); margin: 0 0 8px;
}
.section-desc {
  font-size: 14px; color: var(--text-muted); margin: 0 0 24px;
  line-height: 1.6;
}
.screen-frame {
  background: var(--bg-panel);
  border: 1px solid var(--border-glass);
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 20px;
  box-shadow: var(--glow-cyan);
}
.screen-frame-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--border-glass);
}
.dot {
  width: 9px; height: 9px; border-radius: 50%;
  background: var(--border-glass);
}
.frame-label {
  margin-left: 8px;
  font-size: 12px;
  color: var(--text-muted);
}
.screen-frame-body {
  max-height: 520px;
  overflow: auto;
  padding: 16px;
  background: #ffffff;
}
.mini-screens-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}
.screen-frame.mini .screen-frame-body {
  max-height: 280px;
}

.lab-card {
  background: var(--bg-panel);
  border: 1px solid var(--border-glass);
  border-radius: 20px;
  padding: 28px;
  margin-bottom: 24px;
  box-shadow: var(--glow-cyan);
}
.lab-card h2 {
  color: var(--text-body);
  font-size: 20px;
  margin: 0 0 16px;
}

.req-list,
.my-list {
  list-style: none;
  padding: 0;
  margin: 0 0 12px;
}
.req-list li {
  color: var(--text-muted);
  font-size: 14px;
  margin-bottom: 6px;
}
.my-list li {
  color: var(--text-body);
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 6px;
}

.hint {
  font-size: 13px;
  color: var(--text-muted);
  margin: 4px 0 0;
}

.lab-btn {
  background: var(--accent-block);
  color: var(--accent-block-text);
  border-radius: 999px;
  padding: 8px 18px;
  border: none;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  margin: 4px 6px 0 0;
  font-size: 14px;
  font-weight: 500;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}
.feature-card {
  background: var(--bg-panel);
  border: 1px solid var(--border-glass);
  border-radius: 20px;
  padding: 20px;
  box-shadow: var(--glow-cyan);
}
.feature-icon {
  font-size: 22px;
  margin: 0 0 8px;
}
.feature-card h3 {
  font-size: 15px;
  color: var(--text-body);
  margin: 0 0 6px;
}
.feature-card p {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.5;
}

.home-btn {
  display: block;
  margin: 40px auto 0;
  padding: 12px 32px;
  border: none;
  border-radius: 999px;
  background: var(--accent-block);
  color: var(--accent-block-text);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}
</style>
