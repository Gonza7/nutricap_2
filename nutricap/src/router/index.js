// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { supabase } from '@/supabase' // Importar cliente

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { 
      path: '/login', 
      name: 'login', 
      component: () => import('../views/LoginView.vue'), 
      meta: { hideNavbar: true } 
    },
    { 
      path: '/', 
      name: 'home', 
      component: HomeView, 
      meta: { requiresAuth: true } 
    },
    { 
      path: '/alimentos', 
      name: 'alimentos', 
      component: () => import('../views/AlimentosView.vue'), 
      meta: { requiresAuth: true } 
    },
    { 
      path: '/tambo', 
      name: 'tambo', 
      component: () => import('../views/TamboView.vue'), 
      meta: { requiresAuth: true } 
    },
    { 
      path: '/about', 
      name: 'about', 
      component: () => import('../views/AboutView.vue') 
    },
    { 
      path: '/test', 
      name: 'test', 
      component: () => import('../views/TestView.vue'), 
      meta: { requiresAuth: true } 
    }
  ]
})

// --- GUARDIA DE NAVEGACIÓN CON SUPABASE ---
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  
  // Obtenemos la sesión actual de Supabase
  const { data: { session } } = await supabase.auth.getSession()

  if (requiresAuth && !session) {
    // Si requiere auth y NO hay sesión, al login
    next({ name: 'login' })
  } else if (to.name === 'login' && session) {
    // Si ya tiene sesión e intenta ir al login, al home
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router