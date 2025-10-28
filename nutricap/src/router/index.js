import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/alimentos',
      name: 'alimentos',
      // Lazy-loading: Carga la vista solo cuando se visita
      component: () => import('../views/AlimentosView.vue'),
    },
    {
      path: '/tambo',
      name: 'tambo',
      // Creamos la ruta para la calculadora
      component: () => import('../views/TamboView.vue'),
    },
  ],
})

export default router
