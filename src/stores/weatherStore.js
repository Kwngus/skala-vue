import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchCurrentWeather, fetchAirPollution, mapToCityItem } from '../api/weatherApi.js'
import { weatherList as mockWeatherList } from '../mock/weatherData.js'
import { cityCatalog } from '../data/cityCatalog.js'

export const useWeatherStore = defineStore('weather', () => {
  // state: 홈 화면에서 가져온 최신 날씨 목록을 캐싱해두는 창고
  const cityList = ref([])
  const isLoading = ref(true)
  const loadError = ref(false)
  const hasFetched = ref(false)

  // action: 홈 화면이 데이터를 다 받아왔을 때 창고에 저장
  const setCityList = (list) => {
    cityList.value = list
  }

  // action: 상세 페이지가 cityId로 창고를 뒤져보는 함수
  const findCityById = (id) => {
    return cityList.value.find((city) => city.id === id) || null
  }

  // action: 사용자가 직접 입력한 커스텀 도시를 창고에 추가
  const addCustomCity = (cityData) => {
    cityList.value.push({
      id: `custom_${Date.now()}`,
      name: cityData.name,
      temp: cityData.temp,
      status: cityData.status,
      humidity: cityData.humidity ?? 50,
      wind: cityData.wind ?? 0,
      aqi: 1,
      lat: null,
      lon: null,
    })
  }

  // action: cityCatalog 기준으로 실시간 날씨를 병렬 요청해서 창고에 저장 (실패 시 mock으로 폴백)
  const fetchAllCities = async () => {
    if (hasFetched.value) return
    hasFetched.value = true

    isLoading.value = true
    loadError.value = false
    try {
      const requests = cityCatalog.map(async (city) => {
        const apiData = await fetchCurrentWeather(city.english)
        const airData = await fetchAirPollution(apiData.coord.lat, apiData.coord.lon)
        return mapToCityItem(city.id, city.korean, apiData, airData.list[0].main.aqi)
      })
      cityList.value = await Promise.all(requests)
    } catch (error) {
      console.error('실시간 날씨 통신 실패:', error)
      loadError.value = true
      cityList.value = mockWeatherList.map((city) => ({ ...city, aqi: 1 }))
    } finally {
      isLoading.value = false
    }
  }

  return { cityList, isLoading, loadError, setCityList, findCityById, fetchAllCities, addCustomCity }
})
