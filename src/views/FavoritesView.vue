<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFavoriteStore } from '../stores/favoriteStore.js'
import { useWeatherStore } from '../stores/weatherStore.js'
import WeatherCard from '../components/exercise/WeatherCard.vue'

const router = useRouter()
const favoriteStore = useFavoriteStore()
const weatherStore = useWeatherStore()

onMounted(() => {
  weatherStore.fetchAllCities()
})

const favoritedCities = computed(() =>
  weatherStore.cityList.filter((city) => favoriteStore.favoriteIds.includes(city.id)),
)

const goToDetail = (city) => {
  router.push('/weather/' + city.id)
}
</script>

<template>
  <div class="favorites-section">
    <h2>⭐ 내가 심은 나무들</h2>

    <template v-if="favoritedCities.length === 0">
      <p class="empty-text">아직 즐겨찾기한 도시가 없습니다. 숲에서 도시를 즐겨찾기 해보세요.</p>
      <RouterLink to="/forest" class="forest-link-btn">숲으로 가기</RouterLink>
    </template>

    <div v-else class="favorite-list">
      <WeatherCard
        v-for="city in favoritedCities"
        :key="city.id"
        :city="city"
        @select-card="goToDetail"
        @click-detail="goToDetail"
      />
    </div>
  </div>
</template>

<style scoped>
.favorites-section {
  max-width: 480px;
  margin: 40px auto;
  padding: 40px 20px;
  text-align: center;
  background: var(--bg-panel);
  border: 1px solid var(--forest-mist);
  border-radius: 16px;
}
.empty-text {
  color: var(--text-body);
  opacity: 0.7;
  font-size: 14px;
  margin: 0 0 24px;
  line-height: 1.6;
}
.forest-link-btn {
  display: inline-block;
  padding: 10px 28px;
  border-radius: 999px;
  background: var(--accent-block);
  color: var(--accent-block-text);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
}
.forest-link-btn:hover {
  background: #14211a;
}
.favorites-section h2 {
  color: var(--text-body);
  margin: 0 0 16px;
  font-size: 20px;
}
.favorite-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: left;
}
</style>
