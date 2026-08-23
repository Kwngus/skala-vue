<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConfigStore } from '../stores/configStore.js'
import { cityCatalog } from '../data/cityCatalog.js'
import { fetchCurrentWeather, fetchAirPollution, fetchSunTimes, fetchForecast, mapToCityItem, getAqiLabel } from '../api/weatherApi.js'
import { weatherList as mockWeatherList } from '../mock/weatherData.js'
import { useWeatherStore } from '../stores/weatherStore.js'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()
const weatherStore = useWeatherStore()

const cityDetail = ref(null)
const airQuality = ref(null) // 요구사항 2
const sunTimes = ref(null)   // 요구사항 3
const forecastDays = ref([]) // 요구사항 4
const isLoading = ref(true)
const loadError = ref(false)

const loadDetail = async () => {
  isLoading.value = true
  loadError.value = false
  try {
    const cityId = route.params.cityId
    const cityMeta = cityCatalog.find((c) => c.id === cityId)
    if (!cityMeta) {
      cityDetail.value = null
      return
    }

    // 1순위: 홈 화면에서 이미 받아온 데이터가 캐시에 있으면 재사용 (API 재호출 생략)
    const cached = weatherStore.findCityById(cityId)
    if (cached) {
      cityDetail.value = cached
    } else {
      // 캐시 없음 (예: 상세 페이지 URL로 바로 들어온 경우) → 새로 조회
      const apiData = await fetchCurrentWeather(cityMeta.english)
      cityDetail.value = mapToCityItem(cityMeta.id, cityMeta.korean, apiData)
    }

    // lat/lon이 있으면 대기질/일출일몰 조회 (각각 실패해도 서로에게 영향 없게 분리)
    if (cityDetail.value?.lat && cityDetail.value?.lon) {
      try {
        const airData = await fetchAirPollution(cityDetail.value.lat, cityDetail.value.lon)
        airQuality.value = airData.list[0]
      } catch (e) {
        console.warn('대기질 정보 조회 실패:', e)
      }
      try {
        sunTimes.value = await fetchSunTimes(cityDetail.value.lat, cityDetail.value.lon)
      } catch (e) {
        console.warn('일출/일몰 정보 조회 실패:', e)
      }
    }

    // 요구사항 4: 5일 예보 (실패해도 다른 정보엔 영향 없게 분리)
    try {
      forecastDays.value = await fetchForecast(cityMeta.english)
    } catch (e) {
      console.warn('5일 예보 조회 실패:', e)
    }
  } catch (error) {
    console.error('상세 정보 통신 실패:', error)
    loadError.value = true

    // 최종 폴백: mock에서 찾기 (여기도 lat/lon이 있으니 대기질/일출일몰 시도 가능)
    const cityId = route.params.cityId
    const mockCity = mockWeatherList.find((city) => city.id === cityId) || null
    cityDetail.value = mockCity

    // 수정
    if (mockCity?.lat && mockCity?.lon) {
      try {
        const airData = await fetchAirPollution(mockCity.lat, mockCity.lon)
        airQuality.value = airData.list[0]
      } catch (e) {
        console.warn('(폴백) 대기질 정보 조회 실패:', e)
      }
      try {
        sunTimes.value = await fetchSunTimes(mockCity.lat, mockCity.lon)
      } catch (e) {
        console.warn('(폴백) 일출/일몰 정보 조회 실패:', e)
      }
    }

    const mockCityMeta = cityCatalog.find((c) => c.id === cityId)
    if (mockCityMeta) {
      try {
        forecastDays.value = await fetchForecast(mockCityMeta.english)
      } catch (e) {
        console.warn('(폴백) 5일 예보 조회 실패:', e)
      }
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(loadDetail)

const displayTemp = computed(() => {
  if (!cityDetail.value) return null
  const rawTemp = cityDetail.value.temp
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return rawTemp
})

const displayWind = computed(() => {
  if (!cityDetail.value) return null
  const rawWind = cityDetail.value.wind
  if (configStore.windUnit === 'mph') {
    return (rawWind * 2.23694).toFixed(1)
  }
  return rawWind
})

const formattedSunrise = computed(() => {
  if (!sunTimes.value) return '-'
  return new Date(sunTimes.value.sunrise).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Seoul',
  })
})
const formattedSunset = computed(() => {
  if (!sunTimes.value) return '-'
  return new Date(sunTimes.value.sunset).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Seoul',
  })
})

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div v-if="isLoading" class="detail-section loading-box">🌍 상세 정보를 불러오는 중...</div>

  <div v-else-if="cityDetail" class="detail-section">
    <h2>📍 지역별 상세 기상 관측 정보</h2>
    <p>지역: 대한민국 {{ cityDetail.name }}</p>
    <p>실시간 기온: {{ displayTemp }}{{ configStore.unitSymbol }}</p>
    <p>기상 현황: {{ cityDetail.status }}</p>
    <p>대기 습도: {{ cityDetail.humidity }}%</p>
    <p>현재 풍속: {{ displayWind }}{{ configStore.windUnitSymbol }}</p>

    <!-- 요구사항 2: Air Pollution -->
    <div v-if="airQuality" class="extra-info">
      <p>😷 대기질 지수(AQI): {{ getAqiLabel(airQuality.main.aqi) }}</p>
      <p class="sub-text">미세먼지(PM2.5): {{ airQuality.components.pm2_5 }}μg/m³</p>
    </div>

    <!-- 요구사항 3: Sunrise-Sunset -->
    <div v-if="sunTimes" class="extra-info">
      <p>🌅 일출: {{ formattedSunrise }} · 🌇 일몰: {{ formattedSunset }}</p>
    </div>

    <!-- 요구사항 4: 5일 예보 -->
    <div v-if="forecastDays.length" class="extra-info forecast-info">
      <p class="forecast-title">📅 5일 예보</p>
      <div class="forecast-row">
        <div v-for="day in forecastDays" :key="day.date" class="forecast-day">
          <span class="forecast-day-label">{{ day.dayLabel }}</span>
          <span class="forecast-day-temp">{{ day.temp }}°</span>
          <span class="forecast-day-status">{{ day.status }}</span>
        </div>
      </div>
    </div>

    <el-button type="primary" class="home-btn" @click="goHome">← 메인 대시보드로 돌아가기</el-button>
  </div>

  <div v-else class="detail-section">
    <p>{{ loadError ? '데이터 통신에 실패했습니다.' : '해당 도시 정보를 찾을 수 없습니다.' }}</p>
    <el-button type="primary" class="home-btn" @click="goHome">← 메인 대시보드로 돌아가기</el-button>
  </div>
</template>

<style scoped>
.detail-section {
  max-width: 480px;
  margin: 40px auto;
  padding: 20px;
  background: var(--bg-panel);
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  font-family: sans-serif;
}
.detail-section h2 {
  margin: 0 0 16px;
  font-size: 18px;
  color: var(--text-body);
}
.detail-section p {
  margin: 6px 0;
  font-size: 14px;
  color: var(--text-body);
}
.home-btn {
  margin-top: 16px;
  --el-button-bg-color: var(--accent-block);
  --el-button-border-color: var(--accent-block);
  --el-button-text-color: var(--accent-block-text);
  --el-button-hover-bg-color: var(--accent-block);
  --el-button-hover-border-color: var(--accent-block);
  --el-button-hover-text-color: var(--accent-block-text);
  --el-button-active-bg-color: var(--accent-block);
  --el-button-active-border-color: var(--accent-block);
}
.home-btn:hover {
  box-shadow: var(--glow-cyan);
}
.extra-info { margin-top: 8px; padding: 10px; background: var(--bg-muted); border-radius: 8px; }
.sub-text { font-size: 12px; color: var(--text-muted); margin: 4px 0 0; }
.loading-box { text-align: center; color: var(--text-muted); padding: 40px 0; }

.forecast-title {
  font-weight: 600;
  margin: 0 0 8px;
  color: var(--text-body);
}
.forecast-row {
  display: flex;
  justify-content: space-between;
  gap: 6px;
}
.forecast-day {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 4px;
  background: var(--accent-block);
  border: 1px solid var(--border-glass);
  border-radius: 8px;
  text-align: center;
}
.forecast-day-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--accent-block-text);
}
.forecast-day-temp {
  font-size: 15px;
  font-weight: 700;
  color: var(--accent-block-text);
}
.forecast-day-status {
  font-size: 11px;
  color: var(--text-muted);
}
</style>