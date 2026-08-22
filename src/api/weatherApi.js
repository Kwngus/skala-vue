import axios from 'axios'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

// 요구사항 1: 현재 날씨 조회
export const fetchCurrentWeather = async (cityNameEn, countryCode = 'KR') => {
  const response = await axios.get(`${BASE_URL}/weather`, {
    params: {
      q: `${cityNameEn},${countryCode}`,
      appid: API_KEY,
      units: 'metric', // 섭씨로 바로 받기
      lang: 'kr',       // 날씨 설명을 한글로 받기
    },
  })
  return response.data
}

// 위경도 좌표로 현재 날씨 조회 (도시명 대신 좌표 기반)
export const fetchWeatherByCoords = async (lat, lon) => {
  const response = await axios.get(`${BASE_URL}/weather`, {
    params: {
      lat,
      lon,
      appid: API_KEY,
      units: 'metric',
      lang: 'kr',
    },
  })
  return response.data
}

// 요구사항 2: 대기질(미세먼지) 조회 — 같은 OpenWeatherMap의 다른 API
export const fetchAirPollution = async (lat, lon) => {
  const response = await axios.get(`${BASE_URL}/air_pollution`, {
    params: { lat, lon, appid: API_KEY },
  })
  return response.data
}

// 요구사항 3: 일출/일몰 — API 키가 필요 없는 완전히 다른 외부 서비스
export const fetchSunTimes = async (lat, lon) => {
  const response = await axios.get('https://api.sunrise-sunset.org/json', {
    params: { lat, lng: lon, formatted: 0 },
  })
  return response.data.results
}

// 대기질 지수(AQI) 라벨
export const AQI_LABELS = ['', '좋음', '보통', '민감군 주의', '나쁨', '매우 나쁨']
export const getAqiLabel = (aqi) => AQI_LABELS[aqi] || '정보없음'

const FORECAST_DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

// 3시간 간격 40개 항목 중 날짜별 12:00:00에 가장 가까운 항목만 골라 최대 5일치로 압축
export const mapToForecastDays = (rawList) => {
  const byDate = {}
  rawList.forEach((item) => {
    const [date, time] = item.dt_txt.split(' ')
    if (!byDate[date]) byDate[date] = []
    byDate[date].push({ item, time })
  })

  return Object.keys(byDate)
    .slice(0, 5)
    .map((date) => {
      const closest = byDate[date].reduce((best, cur) => {
        const curDiff = Math.abs(Number(cur.time.split(':')[0]) - 12)
        const bestDiff = Math.abs(Number(best.time.split(':')[0]) - 12)
        return curDiff < bestDiff ? cur : best
      })

      return {
        date,
        dayLabel: FORECAST_DAY_LABELS[new Date(date).getDay()],
        temp: Math.round(closest.item.main.temp),
        status: closest.item.weather[0].description,
      }
    })
}

// 요구사항 4: 5일 예보
export const fetchForecast = async (cityNameEn) => {
  const response = await axios.get(`${BASE_URL}/forecast`, {
    params: {
      q: `${cityNameEn},KR`,
      appid: API_KEY,
      units: 'metric',
      lang: 'kr',
    },
  })
  return mapToForecastDays(response.data.list)
}

// API 응답을 우리 앱이 쓰는 형태(mock 데이터와 같은 모양)로 변환
export const mapToCityItem = (id, koreanName, apiData, aqi) => ({
  id,
  name: koreanName,
  temp: Math.round(apiData.main.temp),
  status: apiData.weather[0].description,
  humidity: apiData.main.humidity,
  wind: apiData.wind.speed,
  lat: apiData.coord.lat,
  lon: apiData.coord.lon,
  aqi,
})