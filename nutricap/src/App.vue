<template>
  <header>
    <Menubar :model="menuItems">
      <template #start>
        <span class="font-bold text-lg mr-4">Nutricap</span>
      </template>
      <template #item="{ item, props }">
        <RouterLink :to="item.route" v-bind="props.action" class="flex align-items-center">
          <span :class="item.icon" />
          <span class="ml-2">{{ item.label }}</span>
        </RouterLink>
      </template>
      <template #end>
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

  <main class="p-4">
    <Toast />
    <RouterView />
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterView, RouterLink } from 'vue-router'
import { db } from './db' // Importamos Dexie
import Papa from 'papaparse' // Importamos Papa Parse

// --- 1. Lógica del Modo Oscuro ---
const isDarkMode = ref(false) // Estado reactivo

// Función que cambia el tema
function toggleDarkMode() {
  isDarkMode.value = !isDarkMode.value // Invierte el estado

  // Añade o quita la clase ".p-dark" del <html>
  document.documentElement.classList.toggle('p-dark', isDarkMode.value)

  // Guarda la preferencia en el localStorage del navegador
  localStorage.setItem('darkMode', isDarkMode.value)
}

// Función para revisar la preferencia guardada cuando la app carga
function aplicarTemaGuardado() {
  const savedMode = localStorage.getItem('darkMode') === 'true'
  if (savedMode) {
    isDarkMode.value = true
    document.documentElement.classList.add('p-dark')
  }
}

// 1. Definimos los items del menú
const menuItems = ref([
  {
    label: 'Inicio',
    icon: 'pi pi-home',
    route: '/',
  },
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
])

// 2. LÓGICA DE CARGA DE DATOS (DEXIE)
onMounted(() => {
  aplicarTemaGuardado()
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
        // ... (el resto de tu lógica de carga de dexie)
        .then((csvText) => {
          Papa.parse(csvText, {
            header: true,
            delimiter: ';',
            skipEmptyLines: true,
            dynamicTyping: true,
            complete: (results) => {
              const alimentosLimpios = results.data
                .map((item) => {
                  Object.keys(item).forEach((key) => {
                    const valor = item[key]
                    if (valor === '****') item[key] = null
                    else if (typeof valor === 'string') item[key] = valor.trim()
                  })
                  item.ms = parseFloat(String(item.ms).replace(',', '.')) || null
                  item.em = parseFloat(String(item.em).replace(',', '.')) || null
                  item.pb = parseFloat(String(item.pb).replace(',', '.')) || null
                  item.fdn = parseFloat(String(item.fdn).replace(',', '.')) || null
                  item.calcio = parseFloat(String(item.calcio).replace(',', '.')) || null
                  item.fosforo = parseFloat(String(item.fosforo).replace(',', '.')) || null
                  return item
                })
                .filter((item) => item.nombre)

              db.alimentos.bulkAdd(alimentosLimpios).then(() => {
                console.log(`${alimentosLimpios.length} alimentos cargados.`)
              })
            },
          })
        })
    })
    .catch((error) => {
      console.error('Error al poblar la base de datos:', error)
    })
})
</script>

<style scoped>
/* Estilos para el Menubar y RouterLink */
.p-menubar {
  border-radius: 0;
}

/* Clases de PrimeFlex */
.mr-4 {
  margin-right: 1rem;
}
.ml-2 {
  margin-left: 0.5rem;
}
.p-4 {
  padding: 1rem;
}
.font-bold {
  font-weight: 700;
}
.text-lg {
  font-size: 1.125rem;
}
.flex {
  display: flex;
}
.align-items-center {
  align-items: center;
}

/* Estilo para los links del menú */
a.p-menuitem-link {
  text-decoration: none;
  color: inherit;
}

/* Solo afecta al toast en pantallas pequeñas */
@media (max-width: 768px) {
  .custom-toast.p-toast {
    left: 50% !important;
    transform: translateX(-50%) !important;
    right: auto !important;
  }
}
</style>
