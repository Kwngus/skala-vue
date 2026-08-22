<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { getAqiLabel } from '../../api/weatherApi.js'
import { useCompareStore } from '../../stores/compareStore.js'

const props = defineProps({
  cities: { type: Array, default: () => [] },
  mapHeight: { type: String, default: '420px' },
  centerLat: { type: Number, default: 36.5 },
  centerLon: { type: Number, default: 127.8 },
  zoom: { type: Number, default: 7 },
  darkMode: { type: Boolean, default: false },
  allowCompare: { type: Boolean, default: true },
})

const router = useRouter()
const compareStore = useCompareStore()
const mapEl = ref(null)
let mapInstance = null
let markerLayers = []

const getTempCategory = (temp) => {
  if (temp >= 28) return 'hot'
  if (temp >= 20) return 'mild'
  return 'cold'
}

const renderMarkers = () => {
  markerLayers.forEach((marker) => marker.remove())
  markerLayers = []

  props.cities.forEach((city) => {
    const category = getTempCategory(city.temp)
    const icon = L.divIcon({
      className: 'leaf-marker-icon',
      html: `<div class="marker-shell marker-${category}">
               <span class="marker-content">🍃 ${city.temp}°</span>
             </div>`,
      iconSize: [34, 34],
      iconAnchor: [17, 34],
    })

    const marker = L.marker([city.lat, city.lon], { icon }).addTo(mapInstance)

    marker.bindTooltip(
      `<h4>${city.name}</h4><p>${city.status} · ${city.temp}°</p><p>대기질: ${getAqiLabel(city.aqi)}</p>`,
      {
        direction: 'top',
        offset: [0, -30],
        className: 'city-tooltip',
        sticky: true,
      },
    )

    marker.bindPopup(
      `<div class="city-popup">
         <h4>${city.name}</h4>
         <p>${city.status} · ${city.temp}°</p>
         <div class="city-popup-actions">
           <button type="button" class="popup-btn" data-action="detail">상세보기</button>
           ${props.allowCompare ? '<button type="button" class="popup-btn popup-btn-compare" data-action="compare">비교함에 담기</button>' : ''}
         </div>
       </div>`,
      { className: 'city-popup-wrap' },
    )

    marker.on('popupopen', (e) => {
      const popupEl = e.popup.getElement()
      if (!popupEl) return

      const detailBtn = popupEl.querySelector('[data-action="detail"]')
      if (detailBtn && !detailBtn.dataset.wired) {
        detailBtn.dataset.wired = 'true'
        detailBtn.addEventListener('click', () => {
          router.push('/weather/' + city.id)
        })
      }

      const compareBtn = popupEl.querySelector('[data-action="compare"]')
      if (compareBtn && !compareBtn.dataset.wired) {
        compareBtn.dataset.wired = 'true'
        compareBtn.addEventListener('click', () => {
          compareStore.addToCompare(city)
        })
      }
    })

    markerLayers.push(marker)
  })
}

onMounted(() => {
  mapInstance = L.map(mapEl.value).setView([props.centerLat, props.centerLon], props.zoom)

  const tileUrl = props.darkMode
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  const tileAttribution = props.darkMode
    ? '&copy; <a href="https://carto.com/attributions">CARTO</a> &copy; OpenStreetMap contributors'
    : '&copy; OpenStreetMap contributors'

  L.tileLayer(tileUrl, {
    attribution: tileAttribution,
  }).addTo(mapInstance)

  renderMarkers()
})

watch(
  () => props.cities,
  () => {
    if (mapInstance) renderMarkers()
  },
  { deep: true },
)

onUnmounted(() => {
  if (mapInstance) {
    mapInstance.remove()
  }
})
</script>

<template>
  <div class="city-map-wrap">
    <div ref="mapEl" class="city-map" :class="{ 'dark-forest': darkMode }" :style="{ height: mapHeight }"></div>
    <div v-if="darkMode" class="map-vignette"></div>
    <div v-if="!cities.length" class="empty-overlay">검색 결과가 없습니다</div>
  </div>
</template>

<style scoped>
.city-map-wrap {
  position: relative;
  isolation: isolate;
}
.city-map {
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
}
.city-map.dark-forest :deep(.leaflet-tile-pane) {
  filter: sepia(0.35) hue-rotate(90deg) saturate(2) brightness(0.72);
}
.map-vignette {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1000;
  background: radial-gradient(ellipse at center,
    rgba(59, 91, 66, 0.05) 0%,
    rgba(11, 20, 14, 0.55) 100%);
}
.empty-overlay {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 500;
  background: var(--bg-panel);
  color: var(--text-body);
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  box-shadow: 0 1px 4px rgba(27, 43, 34, 0.15);
  pointer-events: none;
}
</style>

<style>
.marker-shell {
  width: 34px;
  height: 34px;
  border-radius: 0 50% 50% 50%;
  transform: rotate(45deg);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(245, 241, 232, 0.85);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
  cursor: pointer;
}
.marker-content {
  display: block;
  transform: rotate(-45deg);
  font-size: 11px;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
}
.marker-hot {
  background: #b5473f;
}
.marker-mild {
  background: #4a5a72;
}
.marker-cold {
  background: #6b6f70;
}
.city-tooltip {
  background: var(--bg-panel);
  padding: 10px 14px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(27, 43, 34, 0.12);
  font-size: 13px;
}
.city-tooltip h4 {
  margin: 0 0 4px;
  font-size: 13px;
}
.city-tooltip p {
  margin: 0;
  font-size: 12px;
  color: var(--text-muted);
}
.city-popup-wrap .leaflet-popup-content-wrapper {
  background: var(--bg-panel);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(27, 43, 34, 0.15);
}
.city-popup-wrap .leaflet-popup-tip {
  background: var(--bg-panel);
}
.city-popup h4 {
  margin: 0 0 4px;
  font-size: 13px;
  color: var(--text-body);
}
.city-popup p {
  margin: 0 0 10px;
  font-size: 12px;
  color: var(--text-muted);
}
.city-popup-actions {
  display: flex;
  gap: 6px;
}
.popup-btn {
  flex: 1;
  padding: 6px 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #fff;
  color: #1b2b22;
  font-size: 11px;
  cursor: pointer;
  white-space: nowrap;
}
.popup-btn:hover {
  background: #f3f2ec;
}
.popup-btn-compare {
  background: var(--accent-block);
  color: var(--accent-block-text);
  border-color: var(--accent-block);
}
.popup-btn-compare:hover {
  background: #14211a;
}
</style>
