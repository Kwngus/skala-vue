<script setup>
import { ref, computed }from 'vue'

//1.배열 렌더링 날씨카드
const weatherList = ref([
{ id: 'city_01', name: '서울', temp: 28, status: '맑음', humidity: 55, wind: 3.2},
{ id: 'city_02', name: '수원', temp: 24, status: '비', humidity: 80, wind: 5.1 },
{ id: 'city_03', name: '부산', temp: 26, status: '구름', humidity: 60, wind: 4.0 },
{ id: 'city_04', name: '제주', temp: 19, status: '흐림', humidity: 70, wind: 6.5 }
])

//검색어 (수동 양방향 바인딩용) 
const searchQuery = ref('')

//검색어로 필터링된 리스트
const filteredList = computed(() => {
  let result = weatherList.value
  if (searchQuery.value) {
    result = result.filter((city) => city.name.includes(searchQuery.value))
  }

  if (tempFilter.value !== 'all') {
    result = result.filter((city) => getTempCategory(city.temp) === tempFilter.value)
  }

  if (sortOrder.value === 'desc') {
    result = [...result].sort((a, b) => b.temp - a.temp)
  } else if (sortOrder.value === 'asc') {
    result = [...result].sort((a, b) => a.temp - b.temp)
  }

  return result
})

//상태바 문구
const statusMessage = ref('카드를 클릭하거나 검색해 보세요.')

const selectCity = (cityName) => {
    statusMessage.value = `${cityName}이 선택되었습니다.`
}

const showDetail = (cityName, status) => {
    window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}

//정렬
const sortOrder = ref(null)

const toggleSort = () => {
    if (sortOrder.value === null) sortOrder.value ='desc'
    else if(sortOrder.value === 'desc') sortOrder.value ='asc'
    else sortOrder.value = null
}

const sortLabel = computed(() => {
    if (sortOrder.value === 'desc') return '🔽 높은 온도순'
    if (sortOrder.value === 'asc') return '🔼 낮은 온도순'
    return '↕️ 정렬 없음'
})

const getTempCategory = (temp) => {
    if (temp >=28) return 'hot'
    if (temp >=20) return 'mild'
    return 'cold'
}

const tempFilter = ref('all')

const tempFilterOptions = [
    {value: 'all', label: '전체'},
    { value: 'hot', label: '🔥 더움' },
    { value: 'mild', label: '🌤️ 선선함' },
    { value: 'cold', label: '❄️ 추움' },
]

const newCity = ref({
  name: '',
  temp: null,
  status: '맑음',
  humidity: null,
  wind: null,
})

const statusOptions = ['맑음', '흐림','비','구름','눈']

const addCity = () => {
    if(!newCity.value.name || newCity.value.temp === null ) {
        window.alert('도시 이름과 온도는 필수입니다.')
        return
    }

    weatherList.value.push({
    id: `city_${Date.now()}`, // 유니크 id: 현재 시각 밀리초를 활용
    name: newCity.value.name,
    temp: newCity.value.temp,
    status: newCity.value.status,
    humidity: newCity.value.humidity ?? 0,
    wind: newCity.value.wind ?? 0,
    })

    // 폼 초기화
    newCity.value = { name: '', temp: null, status: '맑음', humidity: null, wind: null }
}
</script>




<template>
  <div class="practice-section">
    <h2>🌤️ 과제 1: 날씨 (Mockup)</h2>

    <!-- 검색 섹션 -->
    <section class="panel">
      <label class="panel-label">🔍 도시 검색</label>
      <input
        type="text"
        class="search-input"
        :value="searchQuery"
        @input="searchQuery = $event.target.value"
        placeholder="검색할 도시 이름 입력"
      />
      <p class="hint-text">검색 중인 도시: {{ searchQuery || '전체' }}</p>
      <div class="filter-row">
        <button
            v-for="option in tempFilterOptions"
            :key="option.value"
            class="filter-btn"
            :class="{ active: tempFilter === option.value}"
            @click="tempFilter = option.value">
        
            {{ option.label }}
        </button>
      </div>
    </section>


    <section class="panel">
        <h3 class="panel-title">➕ 도시 추가</h3>
        <div class="add-form">
            <input
            type="text"
            v-model.trim="newCity.name"
            placeholder="도시 이름"
            class="form-input"
            />
            <input
            type="number"
            v-model.number="newCity.temp"
            placeholder="온도 (°C)"
            class="form-input form-input-small"
            />
            <select v-model="newCity.status" class="form-input form-input-small">
            <option v-for="opt in statusOptions" :key="opt" :value="opt">{{ opt }}</option>
            </select>
            <input
            type="number"
            v-model.number="newCity.humidity"
            placeholder="습도 (%)"
            class="form-input form-input-small"
            />
            <input
            type="number"
            v-model.number="newCity.wind"
            placeholder="풍속 (m/s)"
            class="form-input form-input-small"
            />
            <button class="add-btn" @click="addCity">추가하기</button>
        </div>
    </section>

    <!-- 날씨 현황 섹션 -->
    <section class="panel">
      <h3 class="panel-title">📍 지역별 날씨 현황 ({{ filteredList.length }}곳)</h3>
      <button class="sort-btn" @click="toggleSort">{{ sortLabel }}</button>

      <div class="weather-list">
        <div
          v-for="city in filteredList"
          :key="city.id"
          class="weather-card"
          @click="selectCity(city.name)"
        >
        <div class="card-info">
            <h4>{{ city.name }} ({{ city.status }})</h4>
            <p class="temp-text">현재 기온: {{ city.temp }}°C</p>
            <p class="sub-text">💧 습도 {{ city.humidity }}% · 🌬️ 풍속 {{ city.wind }}m/s</p>
        </div>
            <span class="badge" :class="'badge-' + getTempCategory(city.temp)">
                <template v-if="getTempCategory(city.temp) === 'hot'">🔥 더움 (28도 이상)</template>
                <template v-else-if="getTempCategory(city.temp) === 'mild'">🌤️ 선선함 (20~27도)</template>
                <template v-else>❄️ 추움 (20도 미만)</template>
            </span>

          <button class="detail-btn" @click.stop="showDetail(city.name, city.status)">
            상세보기
          </button>
        </div>

        <p v-if ="filteredList.length === 0" class="empty-text">
            😥"{{ searchQuery }}"와 일치하는 도시가 없습니다.
        </p>
      </div>
    </section>

    <div class="status-bar">{{ statusMessage }}</div>
  </div>
</template>

<style scoped>
.practice-section {
  max-width: 480px;
  margin: 0 auto;
  font-family: sans-serif;
}
.practice-section h2 {
  text-align: center;
  margin-bottom: 20px;
}
/* 공통 패널(박스) 스타일 */
.panel {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}
.panel-title {
  margin: 0 0 12px;
  font-size: 15px;
  color: #374151;
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

.weather-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.weather-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 14px;
  cursor: pointer;
  transition: box-shadow 0.15s;
}
.weather-card:hover {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}
.card-info h4 {
  margin: 0 0 4px;
}
.temp-text {
  margin: 0 0 4px;
  font-size: 14px;
}
.sub-text {
  margin: 0 0 8px;
  font-size: 12px;
  color: #6b7280;
}

/* 온도별 뱃지(알약 모양) */
.badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
}
.badge-hot {
  background: #ffe3e3;
  color: #e03131;
}
.badge-mild {
  background: #fef5d4;
  color: #da9028;

}
.badge-cold {
  background: #e6f0ff;
  color: #3b5bdb;
}

.detail-btn {
  flex-shrink: 0;
  margin-left: 12px;
  padding: 6px 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
}
.detail-btn:hover {
  background: #f9fafb;
}
.status-bar {
    margin-top: 16px;
    text-align: center;
    padding: 10px 12px;
    background: #eef7ee;
    border-radius: 8px;
    color: #2f6b2f;
}

.status-bar {
    margin-top: 16px;
    padding: 8px 12px;
    background: #eef7ee;
    border-radius: 6px;
}

.panel-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.sort-btn {
  font-size: 12px;
  padding: 4px 10px;
  border: 1px solid #d1d5db;
  border-radius: 999px;
  background: #fff;
  cursor: pointer;
  margin-bottom: 12px;
}
.empty-text {
  text-align: center;
  color: #9ca3af;
  padding: 20px 0;
}
.filter-row {
  display: flex;
  gap: 6px;
  margin-top: 10px;
  flex-wrap: wrap;
}
.filter-btn {
  font-size: 12px;
  padding: 5px 12px;
  border: 1px solid #d1d5db;
  border-radius: 999px;
  background: #fff;
  cursor: pointer;
}
.filter-btn.active {
  background: #1971c2;
  color: #fff;
  border-color: #1971c2;
}
.add-form {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.form-input {
  flex: 1 1 140px;
  padding: 8px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  box-sizing: border-box;
}
.form-input-small {
  flex: 1 1 90px;
}
.add-btn {
  flex: 1 1 100%;
  padding: 8px 10px;
  background: #1971c2;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.add-btn:hover {
  background: #1864ab;
}
</style>