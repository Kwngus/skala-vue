<script setup>
import { ref, computed, watch, watchEffect, onMounted, onUnmounted } from 'vue'

const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음', humidity: 55, wind: 3.2 },
  { id: 'city_02', name: '수원', temp: 24, status: '비', humidity: 80, wind: 5.1 },
  { id: 'city_03', name: '부산', temp: 26, status: '구름', humidity: 60, wind: 4.0 },
  { id: 'city_04', name: '제주', temp: 19, status: '흐림', humidity: 70, wind: 6.5 },
])

const searchQuery = ref('')
const selectedCityInfo = ref(null)

// 3. 즐겨찾기만 보기 토글
const showFavoritesOnly = ref(false)

// 즐겨찾기 상태
const favoriteCities = ref([])
const toggleFavorite = (cityId) => {
  if (favoriteCities.value.includes(cityId)) {
    favoriteCities.value = favoriteCities.value.filter((id) => id !== cityId)
  } else {
    favoriteCities.value.push(cityId)
  }
}
const favoriteCount = computed(() => favoriteCities.value.length)

// computed - 검색어 + 즐겨찾기 필터를 체인으로 연결
const filteredWeatherList = computed(() => {
  let result = weatherList.value
  if (searchQuery.value) {
    result = result.filter((city) => city.name.includes(searchQuery.value))
  }
  if (showFavoritesOnly.value) {
    result = result.filter((city) => favoriteCities.value.includes(city.id))
  }
  return result
})

const emptyStateMessage = computed(() => {
    if (showFavoritesOnly.value && searchQuery.value) {
        return `⭐ 즐겨찾기 중 "${searchQuery.value}"와 일치하는 도시가 없습니다.`
    }
    if (showFavoritesOnly.value) {
        return '⭐ 즐겨찾기한 도시가 없습니다. 카드의 별(☆)을 눌러 추가해보세요.'
    }
    if (searchQuery.value) {
        return `😥 "${searchQuery.value}"와 일치하는 도시가 없습니다.`
    }
    return '표시할 날씨 데이터가 없습니다.'

})

// 2. 온도 통계 computed
const avgTemp = computed(() => {
  if (weatherList.value.length === 0) return 0
  const sum = weatherList.value.reduce((acc, city) => acc + city.temp, 0)
  return (sum / weatherList.value.length).toFixed(1)
})
const hottestCity = computed(() =>
  weatherList.value.reduce((max, city) => (city.temp > max.temp ? city : max), weatherList.value[0]),
)
const coldestCity = computed(() =>
  weatherList.value.reduce((min, city) => (city.temp < min.temp ? city : min), weatherList.value[0]),
)

// 상태바 문구
const statusMessage = computed(() => {
  if (!selectedCityInfo.value) return '카드를 클릭하거나 검색해 보세요.'
  return `${selectedCityInfo.value.name}이 선택되었습니다.`
})

// watch - selectedCityInfo 감시
watch(selectedCityInfo, (newVal) => {
  if (newVal) {
    console.log(`[watch 감지] 상태 바 문구가 업데이트되었습니다. -> "${newVal.name}이 선택되었습니다."`)
  }
})

// watchEffect - searchQuery 감시
watchEffect(() => {
  console.log(`[watchEffect 자동 호출] 현재 검색어 '${searchQuery.value}'에 매칭되는 도시를 필터링 중...`)
})

// 4. 검색 히스토리 (watch 응용)
const searchHistory = ref([])

const recordSearchHistory = () => {
  const term = searchQuery.value.trim()
  if (term && !searchHistory.value.includes(term)) {
    searchHistory.value.unshift(term)
    if (searchHistory.value.length > 5) searchHistory.value.pop()
  }
}
const applyHistorySearch = (term) => {
  searchQuery.value = term
}

// 5. 다중 조건 감시 (Multi-Source Watch)
watch([searchQuery, selectedCityInfo], ([newQuery, newCity], [oldQuery, oldCity]) => {
  console.log(
    `[다중 감시] 검색어: '${oldQuery}' → '${newQuery}' / 선택 도시: ${oldCity?.name ?? '없음'} → ${newCity?.name ?? '없음'}`,
  )
})

// 즐겨찾기 개수 watch (기존 5번 요구사항 대응분)
watch(favoriteCount, (newCount, oldCount) => {
  console.log(`[watch 감지] 즐겨찾기 개수 변경: ${oldCount}개 -> ${newCount}개`)
})

const selectCity = (city) => {
  selectedCityInfo.value = city
}

const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}

const getTempCategory = (temp) => {
  if (temp >= 28) return 'hot'
  if (temp >= 20) return 'mild'
  return 'cold'
}

// 6, 7. Lifecycle - 로딩 시뮬레이션 + 자동 새로고침 타이머
const isLoading = ref(true)
let refreshTimerId = null

onMounted(() => {
  console.log('[onMounted] 컴포넌트가 화면에 부착되었습니다. 데이터 로딩을 시작합니다...')

  // 6. 로딩 시뮬레이션: 0.8초 뒤 로딩 종료 (API 호출 흉내)
  setTimeout(() => {
    isLoading.value = false
    console.log('[onMounted] 데이터 로딩 완료!')
  }, 800)

  // 7. 자동 새로고침 타이머: 5초마다 임의 도시 온도 ±1도 변경
  refreshTimerId = setInterval(() => {
    const randomIndex = Math.floor(Math.random() * weatherList.value.length)
    const delta = Math.floor(Math.random() * 3) - 1 // -1, 0, 1
    weatherList.value[randomIndex].temp += delta
    console.log(
      `[자동 갱신] ${weatherList.value[randomIndex].name} 온도 변경 -> ${weatherList.value[randomIndex].temp}°C`,
    )
  }, 5000)
})

onUnmounted(() => {
  clearInterval(refreshTimerId)
  console.log('[onUnmounted] 자동 새로고침 타이머를 정리했습니다.')
})
</script>

<template>
  <div class="practice-section">
    <h2>🌦️ 과제 2: 날씨 (컴포지션)</h2>

    <!-- 검색 -->
    <section class="panel">
      <label class="panel-label">🔍 도시 검색</label>
      <input
        type="text"
        class="search-input"
        :value="searchQuery"
        @input="searchQuery = $event.target.value"
        @keyup.enter="recordSearchHistory"
        placeholder="검색할 도시 이름 입력 (Enter로 기록)"
      />
      <p class="hint-text">검색 중인 도시: {{ searchQuery || '전체' }}</p>

      <!-- 4. 검색 히스토리 -->
      <div v-if="searchHistory.length > 0" class="history-row">
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
    </section>

    <!-- 2. 온도 통계 -->
    <section class="panel stats-panel">
      <h3 class="panel-title">📊 오늘의 날씨 통계</h3>
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
    </section>

    <!-- 1. 선택된 도시 상세 -->
    <section v-if="selectedCityInfo" class="panel detail-panel">
      <h3 class="panel-title">📌 선택된 도시</h3>
      <p><strong>{{ selectedCityInfo.name }}</strong> · {{ selectedCityInfo.status }} · {{ selectedCityInfo.temp }}°C</p>
      <p class="sub-text">💧 습도 {{ selectedCityInfo.humidity }}% · 🌬️ 풍속 {{ selectedCityInfo.wind }}m/s</p>
    </section>

    <!-- 지역별 날씨 현황 -->
    <section class="panel">
      <h3 class="panel-title">
        📍 지역별 날씨 현황
        <span class="fav-count">⭐ 즐겨찾기 {{ favoriteCount }}개</span>
      </h3>

      <button
        class="filter-btn"
        :class="{ active: showFavoritesOnly }"
        @click="showFavoritesOnly = !showFavoritesOnly"
      >
        {{ showFavoritesOnly ? '⭐ 즐겨찾기만 보는 중' : '전체 보기 중' }}
      </button>

      <!-- 6. 로딩 상태 -->
      <div v-if="isLoading" class="loading-box">⏳ 날씨 데이터를 불러오는 중...</div>

      <div v-else class="weather-list">
        <div
          v-for="city in filteredWeatherList"
          :key="city.id"
          class="weather-card"
          @click="selectCity(city)"
        >
          <div class="card-info">
            <h4>{{ city.name }} ({{ city.status }})</h4>
            <p class="temp-text">현재 기온: {{ city.temp }}°C</p>
            <p class="sub-text">💧 습도 {{ city.humidity }}% · 🌬️ 풍속 {{ city.wind }}m/s</p>
          </div>

          <span class="badge" :class="'badge-' + getTempCategory(city.temp)">
            <template v-if="getTempCategory(city.temp) === 'hot'">🔥 더움</template>
            <template v-else-if="getTempCategory(city.temp) === 'mild'">🌤️ 선선함</template>
            <template v-else>❄️ 추움</template>
          </span>

          <button
            class="fav-btn"
            :class="{ active: favoriteCities.includes(city.id) }"
            @click.stop="toggleFavorite(city.id)"
          >
            {{ favoriteCities.includes(city.id) ? '★' : '☆' }}
          </button>

          <button class="detail-btn" @click.stop="showDetail(city.name, city.status)">
            상세보기
          </button>
        </div>

        <p v-if="filteredWeatherList.length === 0" class="empty-text">
          {{ emptyStateMessage }}
        </p>
      </div>
    </section>

    <div class="status-bar">{{ statusMessage }}</div>
  </div>
</template>

<style scoped>

.practice-section {
    width:100%;
    max-width: 480px;
    margin: 0 auto;
    font-family: sans-serif;
}
.practice-section h2 {
    text-align: center;
    margin-bottom: 20px;
}
.panel {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 16px;
    margin-bottom: 16px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    min-width: 0;
}
.panel-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 0 12px;
    font-size: 15px;
    color: #374151;
}
.fav-count {
    font-size: 12px;
    color: #f59f00;
}
.panel-label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    color: #374151;
}
.search-input {
    width: 100%;
    box-sizing: border-box;
    padding: 8px 10px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
}
.hint-text {
    margin: 8px 0 0;
    font-size: 12px;
    color: #9ca3af;
}

/* 검색 히스토리 */
.history-row {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 10px;
    flex-wrap: wrap;
}
.history-label {
    font-size: 12px;
    color: #9ca3af;
}
.history-chip {
    font-size: 12px;
    padding: 4px 10px;
    border: 1px solid #d1d5db;
    border-radius: 999px;
    background: #f9fafb;
    cursor: pointer;
}
.history-chip:hover {
    background: #eef2ff;
}

/* 온도 통계 */
.stats-row {
    display: flex;
    justify-content: space-between;
    gap: 8px;
}
.stat-item {
  flex: 1;
  text-align: center;
  background: #f9fafb;
  border-radius: 8px;
  padding: 10px;
}
.stat-label {
  display: block;
  font-size: 11px;
  color: #9ca3af;
  margin-bottom: 4px;
}
.stat-value {
  font-size: 14px;
  color: #374151;
}

/* 선택 도시 상세 */
.detail-panel {
  background: #eef7ff;
  border-color: #bcd8ff;
}

/* 로딩 */
.loading-box {
  text-align: center;
  padding: 30px 0;
  color: #9ca3af;
}

/* 즐겨찾기만 보기 버튼 */
.filter-btn {
  font-size: 12px;
  padding: 5px 12px;
  border: 1px solid #d1d5db;
  border-radius: 999px;
  background: #fff;
  cursor: pointer;
  margin-bottom: 12px;
}
.filter-btn.active {
  background: #1971c2;
  color: #fff;
  border-color: #1971c2;
}

.weather-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 80px;
}
.weather-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 14px;
  cursor: pointer;
  transition: box-shadow 0.15s;
}
.weather-card:hover {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}
.card-info {
  flex: 1;
}
.card-info h4 {
  margin: 0 0 4px;
}
.temp-text {
  margin: 0 0 4px;
  font-size: 14px;
}
.sub-text {
  margin: 0;
  font-size: 12px;
  color: #6b7280;
}
.badge {
  flex-shrink: 0;
  white-space: nowrap;
  margin-right: 4px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
}
.badge-hot { background: #ffe3e3; color: #e03131; }
.badge-mild { background: #fef5d4; color: #da9028; }
.badge-cold { background: #e6f0ff; color: #3b5bdb; }
.fav-btn {
  flex-shrink: 0;
  border: none;
  background: none;
  font-size: 18px;
  cursor: pointer;
  color: #d1d5db;
}
.fav-btn.active {
  color: #f59f00;
}
.detail-btn {
  flex-shrink: 0;
  padding: 6px 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
}
.detail-btn:hover {
  background: #f9fafb;
}
.empty-text {
  text-align: center;
  color: #9ca3af;
  padding: 30px 0;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.status-bar {
  margin-top: 16px;
  text-align: center;
  padding: 10px 12px;
  background: #eef7ee;
  border-radius: 8px;
  color: #2f6b2f;
}
</style>