import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useFavoriteStore = defineStore('favorite', () => {
  const favoriteIds = ref(JSON.parse(localStorage.getItem('favoriteIds') || '[]'))

  const favoriteCount = computed(() => favoriteIds.value.length)

  const toggleFavorite = (id) => {
    if (favoriteIds.value.includes(id)) {
      favoriteIds.value = favoriteIds.value.filter((favId) => favId !== id)
    } else {
      favoriteIds.value.push(id)
    }
    localStorage.setItem('favoriteIds', JSON.stringify(favoriteIds.value))
  }

  const isFavorite = (id) => favoriteIds.value.includes(id)

  return { favoriteIds, favoriteCount, toggleFavorite, isFavorite }
})
