<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import SearchBar from '../components/exercise/SearchBar.vue'
import WeatherCard from '../components/exercise/WeatherCard.vue'
import CityMap from '../components/exercise/CityMap.vue'
import CompareTray from '../components/exercise/CompareTray.vue'
import { useWeatherStore } from '../stores/weatherStore.js'
import { useCompareStore } from '../stores/compareStore.js'
import { useScrollReveal } from '../composables/useScrollReveal.js'

const route = useRoute()
const router = useRouter()
const weatherStore = useWeatherStore()
const compareStore = useCompareStore()
const { target: listSection, isVisible: listVisible } = useScrollReveal()

const searchQuery = ref('') // searchQuery = 사용자가 검색창에 입력한 값.(처음에는 빈 문자열)
const selectedCityInfo = ref(null) // 어떤카드를 클릭했는지 기억하는 변수(처음에는 아무것도 선택안되어서 null)

// 4. 검색 히스토리
const searchHistory = ref(JSON.parse(localStorage.getItem('searchHistory') || '[]'))

const recordSearchHistory = () => {
  const term = searchQuery.value.trim()
  if (term && !searchHistory.value.includes(term)) {
    searchHistory.value.unshift(term)
    if (searchHistory.value.length > 5) searchHistory.value.pop()
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
  }
}
const applyHistorySearch = (term) => {
  searchQuery.value = term
}

onMounted(() => {
  if (!weatherStore.cityList.length) {
    weatherStore.fetchAllCities()
  }
  if (typeof route.query.q === 'string') {
    searchQuery.value = route.query.q
  }
})

const filteredWeatherList = computed(() => { //computed니까 searchQuery바뀔때마다 자동으로 다시 계산.
    if(!searchQuery.value) return weatherStore.cityList
    return weatherStore.cityList.filter((city) => city.name.includes(searchQuery.value))
})

// 2. 온도 통계 (검색 필터링 전 원본 리스트 기준)
const avgTemp = computed(() => {
  if (weatherStore.cityList.length === 0) return 0
  const sum = weatherStore.cityList.reduce((acc, city) => acc + city.temp, 0)
  return (sum / weatherStore.cityList.length).toFixed(1)
})
const hottestCity = computed(() =>
  weatherStore.cityList.reduce((max, city) => (city.temp > max.temp ? city : max), weatherStore.cityList[0]),
)
const coldestCity = computed(() =>
  weatherStore.cityList.reduce((min, city) => (city.temp < min.temp ? city : min), weatherStore.cityList[0]),
)

const statusMessage = computed(()=> { //selectedcityInfo가 null이면 안내문구, 선택되어있으면 도시 이름이 들어간 문구 자동으로 만들어줌
    if (!selectedCityInfo.value) return '카드를 클릭하거나 검색해 보세요.'
    return `${selectedCityInfo.value.name}이 선택되었습니다.`
})

// searchBar가 던진 update-query 이벤트를 받아서 실행되는 함수
const handleQueryUpdate = (newQuery) => {
    searchQuery.value = newQuery
}
// 진짜 값을 바꾸는 곳(부모)
const selectCity = (city) => {
    selectedCityInfo.value = city
    compareStore.addToCompare(city)
}
const showDetail = (city) => {
    router.push('/weather/' + city.id)
}
</script>

<template>
  <div class="practice-section">
    <div v-if="weatherStore.isLoading" class="loading-box">🌍 실시간 날씨를 불러오는 중...</div>
    <p v-if="weatherStore.loadError" class="error-text">⚠️ 실시간 통신에 실패해 기본 데이터로 표시 중입니다.</p>

    <div ref="listSection" class="fade-section" :class="{ visible: listVisible }">
      <p class="section-eyebrow">오늘의 도시</p>

      <div v-if="weatherStore.cityList.length" class="stats-section">
        <h3 class="stats-title">오늘의 날씨 통계</h3>
        <div class="stats-row">
          <div class="stat-item">
            <span class="stat-label">평균 기온</span>
            <strong class="stat-value">{{ avgTemp }}°C</strong>
          </div>
          <div class="stat-item">
            <span class="stat-label">🔥 최고</span>
            <strong class="stat-value">{{ hottestCity?.name }} ({{ hottestCity?.temp }}°C)</strong>
          </div>
          <div class="stat-item">
            <span class="stat-label">❄️ 최저</span>
            <strong class="stat-value">{{ coldestCity?.name }} ({{ coldestCity?.temp }}°C)</strong>
          </div>
        </div>
      </div>

      <div class="map-section">
        <CityMap :cities="filteredWeatherList" :allow-compare="false" />
      </div>

      <BaseDashboardCard>
        <template #search>
          <SearchBar
            :query="searchQuery"
            @update-query="handleQueryUpdate"
            @search-submit="recordSearchHistory"
          />
          <div v-if="searchHistory.length" class="history-row">
            <span class="history-label">최근 검색:</span>
            <button
              v-for="term in searchHistory"
              :key="term"
              class="history-chip"
              @click="applyHistorySearch(term)"
            >
              {{ term }}
            </button>
          </div>
        </template>

        <template #list>
          <div class="weather-list">
            <WeatherCard
              v-for="city in filteredWeatherList"
              :key="city.id"
              :city="city"
              @select-card="selectCity"
              @click-detail="showDetail"
            />
          </div>
        </template>
      </BaseDashboardCard>

      <div class="status-bar">{{ statusMessage }}</div>
    </div>

    <CompareTray />
  </div>
</template>

<style scoped>
.practice-section {
  max-width: 560px;
  margin: 0 auto;
  padding: 0 20px;
  font-family: sans-serif;
}
.practice-section h2 {
  text-align: center;
  margin-bottom: 20px;
}
.weather-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.status-bar {
  margin-top: 16px;
  text-align: center;
  padding: 10px 12px;
  background: #eef7ee;
  border-radius: 8px;
  color: #2f6b2f;
}
.loading-box { text-align: center; padding: 30px 0; color: var(--text-muted); }
.error-text { text-align: center; color: #e03131; font-size: 12px; margin: 8px 0; }

.fade-section {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-section.visible {
  opacity: 1;
  transform: translateY(0);
}
.section-eyebrow {
  font-size: 13px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #7c9473;
  margin: 48px 0 16px;
  text-align: center;
}
.map-section {
  background: var(--bg-panel);
  border: none;
  box-shadow: 0 1px 2px rgba(27, 43, 34, 0.06);
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
}
.stats-section {
  background: var(--bg-panel);
  border: none;
  box-shadow: 0 1px 2px rgba(27, 43, 34, 0.06);
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
}
.stats-title {
  margin: 0 0 12px;
  font-size: 14px;
  color: var(--text-body);
}
.stats-row {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}
.stat-item {
  flex: 1;
  text-align: center;
  background: var(--bg-muted);
  border-radius: 8px;
  padding: 10px;
}
.stat-label {
  display: block;
  font-size: 11px;
  color: var(--text-muted);
  margin-bottom: 4px;
}
.stat-value {
  font-size: 13px;
  color: var(--text-body);
}
.history-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  flex-wrap: wrap;
}
.history-label {
  font-size: 12px;
  color: var(--text-muted);
}
.history-chip {
  font-size: 12px;
  padding: 4px 10px;
  border: 1px solid var(--forest-mist, #b8c9b3);
  border-radius: 999px;
  background: var(--bg-panel);
  color: var(--text-body);
  cursor: pointer;
}
.history-chip:hover {
  background: var(--bg-muted);
}
</style>
