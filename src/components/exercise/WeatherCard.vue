<script setup>
import { computed } from 'vue'
import { useConfigStore } from '../../stores/configStore';
import { useFavoriteStore } from '../../stores/favoriteStore.js'
import { getAqiLabel } from '../../api/weatherApi.js'

const props = defineProps({
    city: { type: Object, required:true }
})
const emit = defineEmits(['select-card', 'click-detail'])

const configStore = useConfigStore()
const favoriteStore = useFavoriteStore()

const displayTemp = computed(() => {
    const rawTemp = props.city.temp
    if (configStore.unit ==='fahrenheit') {
        return Math.round((rawTemp * 9) / 5 + 32)
    }
    return rawTemp
})

const getTempCategory = (temp) => {
    if (temp >=28) return 'hot'
    if (temp >=20) return 'mild'
    return 'cold'
}
const tempTagType = computed(() => {
  const category = getTempCategory(props.city.temp)
  if (category === 'hot') return 'danger'
  if (category === 'mild') return 'primary'
  return 'info'
})

const tempTagLabel = computed(() => {
  const category = getTempCategory(props.city.temp)
  if (category === 'hot') return '🔥 더움'
  if (category === 'mild') return '🌤️ 선선함'
  return '❄️ 추움'
})

const aqiTagType = computed(() => {
  const aqi = props.city.aqi
  if (aqi <= 2) return 'success'
  if (aqi === 3) return 'warning'
  return 'danger'
})
</script>

<template>
  <div class="weather-card" @click="emit('select-card', city)">
    <div class="card-info">
      <h4>{{ city.name }} ({{ city.status }})</h4>
      <p>현재 기온: {{ displayTemp}}{{ configStore.unitSymbol }}</p>
    </div>

    <el-tag :type="tempTagType" effect="light" round>
        {{ tempTagLabel }}
    </el-tag>

    <el-tag :type="aqiTagType" size="small" effect="light" round>
        😷 {{ getAqiLabel(city.aqi) }}
    </el-tag>

    <button
      class="fav-btn"
      :class="{ active: favoriteStore.isFavorite(city.id) }"
      @click.stop="favoriteStore.toggleFavorite(city.id)"
    >
      {{ favoriteStore.isFavorite(city.id) ? '★' : '☆' }}
    </button>

    <button class="detail-btn" @click.stop="emit('click-detail', city)">
      상세보기
    </button>
  </div>
</template>

<style scoped>
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
.fav-btn {
  flex-shrink: 0;
  border: none;
  background: none;
  padding: 0;
  font-size: 18px;
  cursor: pointer;
  color: #b3b3b0;
}
.fav-btn.active {
  color: #f59f00;
}
.detail-btn {
  flex-shrink: 0;
  padding: 6px 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: var(--bg-panel);
  cursor: pointer;
}
.detail-btn:hover {
  background: var(--bg-muted);
}
</style>