import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/WeatherHomeView.vue'), // 지연 로딩
  },
  {
    path: '/forest',
    name: 'forest',
    component: () => import('../views/ForestView.vue'),
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: () => import('../views/FavoritesView.vue'),
  },
  {
    path: '/weather/:cityId', // 동적 라우트 매칭
    name: 'weather-detail',
    component: () => import('../views/WeatherDetailView.vue'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/WeatherAboutView.vue'),
  },
  {
    path: '/explore',
    name: 'explore',
    component: () => import('../views/ExploreView.vue'),
  },
  {
    path: '/:pathMatch(.*)*', // Catch-all, 반드시 맨 마지막
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router