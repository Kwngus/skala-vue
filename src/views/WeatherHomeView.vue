
<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import HeroSection from '../components/exercise/HeroSection.vue'
import AirEffectLayer from '../components/exercise/AirEffectLayer.vue'
import FloatingSearch from '../components/exercise/FloatingSearch.vue'
import { useScrollReveal } from '../composables/useScrollReveal.js'
import { useConfigStore } from '../stores/configStore.js'
import { useWeatherStore } from '../stores/weatherStore.js'
import { fetchAirPollution, fetchWeatherByCoords, mapToCityItem } from '../api/weatherApi.js'

const configStore = useConfigStore()
const weatherStore = useWeatherStore()
const { target: manifestoSection, isVisible: manifestoVisible } = useScrollReveal()

const geoCity = ref(null)
const geoStatus = ref('idle')

onMounted(() => {
  if (!weatherStore.cityList.length) {
    weatherStore.fetchAllCities()
  }

  if (!navigator.geolocation) {
    geoStatus.value = 'unsupported'
    return
  }

  geoStatus.value = 'loading'
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const { latitude, longitude } = position.coords
        const apiData = await fetchWeatherByCoords(latitude, longitude)
        geoCity.value = mapToCityItem('geo_current', apiData.name, apiData)
        geoStatus.value = 'granted'
      } catch (error) {
        console.error('현재 위치 날씨 조회 실패:', error)
        geoStatus.value = 'denied'
      }
    },
    () => {
      geoStatus.value = 'denied'
    },
    { timeout: 5000 },
  )
})

const activeCity = computed(() => geoCity.value ?? weatherStore.cityList[0] ?? null)

const heroAqi = ref(null)
const lastFetchedCityId = ref(null)

watch(
  activeCity,
  async (city) => {
    if (!city || city.id === lastFetchedCityId.value) return
    lastFetchedCityId.value = city.id
    try {
      const airData = await fetchAirPollution(city.lat, city.lon)
      heroAqi.value = airData.list[0].main.aqi
      console.log('현재 위치 AQI:', airData.list[0].main.aqi)
    } catch (error) {
      console.error('히어로 대기질 조회 실패:', error)
    }
  },
  { immediate: true },
)

const heroTemp = computed(() => {
    if (!activeCity.value) return 0
    const rawTemp = activeCity.value.temp
    if (configStore.unit === 'fahrenheit') {
        return Math.round((rawTemp * 9) / 5 + 32)
    }
    return rawTemp
})
</script>

<template>
  <div class="practice-section">
    <AirEffectLayer :aqi="heroAqi ?? 1" />
    <FloatingSearch />

    <HeroSection
      v-if="activeCity"
      :city-name="activeCity.name"
      :temp="heroTemp"
      :status="activeCity.status"
      :is-geo-located="!!geoCity"
    />

    <section ref="manifestoSection" class="manifesto fade-section" :class="{ visible: manifestoVisible }">
      <p class="manifesto-text">우리는 매일 같은 하늘 아래 있지만, 각자 다른 날씨를 살아갑니다.</p>
      <RouterLink to="/forest" class="forest-cta">전체 도시 보러가기</RouterLink>
    </section>
  </div>
</template>

<style scoped>
.practice-section {
  max-width: 560px;
  margin: 0 auto;
  padding: 0 20px;
  font-family: sans-serif;
}

.fade-section {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-section.visible {
  opacity: 1;
  transform: translateY(0);
}

.manifesto {
  text-align: center;
  max-width: 480px;
  margin: 80px auto;
  margin-top: 30vh;
}
.manifesto-text {
  font-weight: 300;
  font-size: 20px;
  line-height: 1.6;
  color: var(--forest-dark);
  margin: 0 0 32px;
}
.forest-cta {
  display: inline-block;
  padding: 12px 32px;
  border-radius: 999px;
  background: var(--forest-dark);
  color: var(--forest-cream);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
}
.forest-cta:hover {
  background: #14211a;
}
</style>
