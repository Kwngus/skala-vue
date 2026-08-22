import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchCurrentWeather, fetchAirPollution, mapToCityItem } from '../api/weatherApi.js'
import { globalCityCatalog } from '../data/globalCityCatalog.js'

export const useExploreStore = defineStore('explore', () => {
  const cities = ref([])
  const isLoading = ref(true)
  const loadError = ref(false)
  const hasFetched = ref(false)

  // action: 전세계 도시 카탈로그 기준으로 날씨+대기질을 조회 (도시 단위로 실패해도 나머지는 정상 표시)
  const fetchGlobalCities = async () => {
    if (hasFetched.value) return
    hasFetched.value = true

    isLoading.value = true
    loadError.value = false

    const results = await Promise.allSettled(
      globalCityCatalog.map(async (city) => {
        const apiData = await fetchCurrentWeather(city.english, city.country)
        const airData = await fetchAirPollution(apiData.coord.lat, apiData.coord.lon)
        return mapToCityItem(city.id, city.korean, apiData, airData.list[0].main.aqi)
      }),
    )

    const succeeded = results
      .filter((result) => result.status === 'fulfilled')
      .map((result) => result.value)

    cities.value = succeeded
    loadError.value = succeeded.length < globalCityCatalog.length
    isLoading.value = false
  }

  return { cities, isLoading, loadError, hasFetched, fetchGlobalCities }
})
