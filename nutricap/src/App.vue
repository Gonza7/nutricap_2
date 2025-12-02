<script setup>
import { ref, onMounted } from 'vue'
import { RouterView, RouterLink, useRoute, useRouter } from 'vue-router'
import { db } from './db'
import Papa from 'papaparse'
import { supabase } from '@/supabase'

const route = useRoute()
const router = useRouter()

// ... (El resto de tus variables: isDarkMode, menuItems, etc. SE MANTIENEN IGUAL) ...
const isDarkMode = ref(false)
function toggleDarkMode() {
  isDarkMode.value = !isDarkMode.value
  document.documentElement.classList.toggle('p-dark', isDarkMode.value)
  localStorage.setItem('darkMode', isDarkMode.value)
}
function aplicarTemaGuardado() {
  const savedMode = localStorage.getItem('darkMode') === 'true'
  if (savedMode) {
    isDarkMode.value = true
    document.documentElement.classList.add('p-dark')
  }
}
const logout = async () => {
  await supabase.auth.signOut()
  router.push({ name: 'login' })
}
const menuItems = ref([
  {
    label: 'Tambo',
    icon: 'pi pi-calculator',
    route: '/tambo',
  },
  {
    label: 'Alimentos',
    icon: 'pi pi-database',
    route: '/alimentos',
  },
  {
    label: 'Acerca de',
    icon: 'pi pi-info-circle',
    route: '/about',
  },
])

// ... (Tus funciones capitalizar, parsearNumero, etc. SE MANTIENEN IGUAL) ...
function capitalizar(texto) { /* ... */ }
function parsearNumero(valor) { /* ... */ }

onMounted(() => {
  aplicarTemaGuardado()

  // 1. Escuchar evento de recuperación de contraseña (Reset Password)
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'PASSWORD_RECOVERY') {
      router.push({ name: 'update-password' })
    }
  })

  // 2. [ESTO ES LO QUE FALTABA] Detectar Invitación manualmente leyendo la URL
  // Supabase añade #access_token=...&type=invite al final de la URL
  const hash = window.location.hash
  
  // Verificamos si existe el hash y si contiene el tipo 'invite'
  if (hash && hash.includes('type=invite')) {
    console.log("Invitación detectada, redirigiendo a configurar contraseña...")
    router.push({ name: 'update-password' })
  }

  // ... (Tu lógica de carga de la base de datos SE MANTIENE IGUAL) ...
  db.alimentos.count().then(/*...*/)
})
</script>

<template>
  <header v-if="!route.meta.hideNavbar">
    <Menubar :model="menuItems">
      <template #start>
        <RouterLink to="/" class="mr-4">
          <img
            src="@/assets/logo.png"
            alt="Nutricap Logo"
            class="h-10 w-auto"
          />
        </RouterLink>
      </template>

      <template #item="{ item, props }">
        <RouterLink :to="item.route" v-bind="props.action" class="flex items-center">
          <span :class="item.icon" />
          <span class="ml-2">{{ item.label }}</span>
        </RouterLink>
      </template>

      <template #end>
        <Button 
          icon="pi pi-sign-out" 
          @click="logout" 
          text 
          rounded 
          aria-label="Cerrar sesión" 
          class="mr-2 text-red-500 hover:bg-red-50"
          v-tooltip.bottom="'Cerrar Sesión'"
        />
        <Button
          :icon="isDarkMode ? 'pi pi-sun' : 'pi pi-moon'"
          @click="toggleDarkMode"
          text
          rounded
          aria-label="Cambiar tema"
          class="mr-2"
        />
      </template>
    </Menubar>
  </header>

  <main class="grow w-full mx-auto" :class="{ 'p-4': !route.meta.hideNavbar }">
    <Toast />
    <ConfirmDialog />
    <RouterView />
  </main>
</template>