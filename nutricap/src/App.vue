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

<script setup>
import { ref, onMounted } from 'vue'
import { RouterView, RouterLink, useRoute, useRouter } from 'vue-router' // Importamos useRoute
import { db } from './db'
import Papa from 'papaparse'
import { supabase } from '@/supabase'
// Obtenemos la ruta actual para poder leer los meta datos
const route = useRoute()
const router = useRouter()

// ... (El resto de tu código de App.vue se mantiene igual: isDarkMode, menuItems, carga de CSV, etc.) ...
// COPIA PEGA EL RESTO DE TU SCRIPT ORIGINAL AQUÍ ABAJO
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

function capitalizar(texto) {
  if (!texto) {
    return ''; 
  }
  const textoLimpio = String(texto).trim();
  if (textoLimpio === '****') {
    return ''; 
  }
  return textoLimpio.charAt(0).toUpperCase() + textoLimpio.slice(1).toLowerCase();
}

function parsearNumero(valor) {
  if (!valor) {
    return 0; 
  }
  const valorLimpio = String(valor).replace(',', '.');
  const numero = parseFloat(valorLimpio);
  return isNaN(numero) ? 0 : numero;
}

onMounted(() => {
  aplicarTemaGuardado()
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'PASSWORD_RECOVERY') {
      // Si el evento es recuperación, mandarlo a cambiar pass
      router.push({ name: 'update-password' })
    }
  })
  db.alimentos
    .count()
    .then((count) => {
      if (count > 0) {
        console.log('Base de datos ya tiene datos.')
        return
      }
      console.log('Base de datos vacía, cargando alimentos desde CSV...')
      fetch('/alimentos_mod.csv') 
        .then((response) => response.text())
        .then((csvText) => {
          Papa.parse(csvText, {
            header: true,
            delimiter: ';',
            skipEmptyLines: true,
            complete: (results) => {
              const alimentosLimpios = results.data
                .map((item) => {
                  return {
                    grupo: capitalizar(item.grupo),
                    nombre: capitalizar(item.nombre),
                    forma: capitalizar(item.forma),
                    momento: capitalizar(item.momento),
                    ms: parsearNumero(item.ms),
                    em: parsearNumero(item.em),
                    pb: parsearNumero(item.pb),
                    fdn: parsearNumero(item.fdn),
                    calcio: parsearNumero(item.calcio),
                    fosforo: parsearNumero(item.fosforo),
                    precio: parsearNumero(item.precio),
                  }
                })
                .filter((item) => item.nombre); 

              db.alimentos.bulkAdd(alimentosLimpios).then(() => {
                console.log(`${alimentosLimpios.length} alimentos limpios cargados.`);
                window.location.reload();
              })
            },
            error: (err) => {
              console.error("Error de PapaParse:", err);
            }
          })
        })
    })
    .catch((error) => {
      console.error('Error al poblar la base de datos:', error)
    })
})
</script>