// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { hideNavbar: true } // Esta es pública, no requiere auth
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true } // <--- AGREGAR ESTO A LAS RUTAS PRIVADAS
    },
    {
      path: '/alimentos',
      name: 'alimentos',
      component: () => import('../views/AlimentosView.vue'),
      meta: { requiresAuth: true } // <--- AGREGAR
    },
    {
      path: '/tambo',
      name: 'tambo',
      component: () => import('../views/TamboView.vue'),
      meta: { requiresAuth: true } // <--- AGREGAR
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      // Puedes dejar About pública si quieres, o agregar requiresAuth: true
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('../views/TestView.vue'),
      meta: { requiresAuth: true } // <--- AGREGAR
    }
  ],
})

// --- GUARDIA DE NAVEGACIÓN ---
router.beforeEach((to, from, next) => {
  // Verificamos si la ruta a la que vamos tiene la meta propiedad "requiresAuth"
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  
  // Verificamos si el usuario tiene la sesión guardada
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'

  if (requiresAuth && !isAuthenticated) {
    // Si requiere auth y NO está logueado, mandar al login
    next({ name: 'login' })
  } else if (to.name === 'login' && isAuthenticated) {
    // (Opcional) Si ya está logueado e intenta ir al login, mandar al home
    next({ name: 'home' })
  } else {
    // En cualquier otro caso, dejar pasar
    next()
  }
})

export default router