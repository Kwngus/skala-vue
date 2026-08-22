import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCompareStore = defineStore('compare', () => {
  const comparedCities = ref([])

  const compareCount = computed(() => comparedCities.value.length)

  const addToCompare = (city) => {
    if (comparedCities.value.some((c) => c.id === city.id)) return
    if (comparedCities.value.length >= 3) {
      window.alert('최대 3개까지만 담을 수 있어요')
      return
    }
    comparedCities.value.push(city)
  }

  const removeFromCompare = (id) => {
    comparedCities.value = comparedCities.value.filter((c) => c.id !== id)
  }

  const isCompared = (id) => comparedCities.value.some((c) => c.id === id)

  const clearCompare = () => {
    comparedCities.value = []
  }

  return { comparedCities, compareCount, addToCompare, removeFromCompare, isCompared, clearCompare }
})
