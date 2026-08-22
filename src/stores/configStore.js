import { defineStore } from "pinia";
import {ref, computed } from 'vue'

export const useConfigStore = defineStore('config', () => {
    //state
    const unit = ref('celsius')

    //getters
    const unitSymbol = computed(() => (unit.value === 'fahrenheit' ? '°F' : '°C'))

    //actions
    const toggleUnit = () => {
        unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
    }
    //state 
    const windUnit = ref('ms')
    // getters
    const windUnitSymbol = computed(() => (windUnit.value === 'mph' ? 'mph' : 'm/s'))
    //actions
    const toggleWindUnit = () => {
        windUnit.value = windUnit.value === 'ms' ? 'mph' : 'ms'
    }

    //state
    const theme = ref(localStorage.getItem('theme') || 'light')
    //getters
    const isDark = computed(() => theme.value === 'dark')
    //actions
    const toggleTheme = () => {
        theme.value = theme.value === 'light' ? 'dark' : 'light'
        localStorage.setItem('theme', theme.value)
        document.body.setAttribute('data-theme', theme.value)
    }
    // 새로고침 시 저장된 테마를 즉시 반영
    document.body.setAttribute('data-theme', theme.value)

    return {
        unit, unitSymbol, toggleUnit,
        windUnit, windUnitSymbol, toggleWindUnit,
        theme, isDark, toggleTheme,
    }
})
