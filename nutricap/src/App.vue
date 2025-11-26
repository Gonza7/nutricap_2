<template>
  <header>
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

  <main class="grow w-full mx-auto p-4">
    <Toast />
    <ConfirmDialog />
    <RouterView />
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterView, RouterLink } from 'vue-router'
import { db } from './db' // Importamos Dexie
import Papa from 'papaparse' // Importamos Papa Parse

// --- 1. Lógica del Modo Oscuro (Sin cambios) ---
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

// --- 2. Items del menú (Sin cambios) ---
const menuItems = ref([
  /* {
    label: 'Inicio',
    icon: 'pi pi-home',
    route: '/',
  }, */
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
  {
    label: 'Test',
    icon: 'pi pi-cog',
    route: '/test',
  },
])

// --- 3. NUEVAS FUNCIONES DE LIMPIEZA ---
// Las añadimos aquí mismo para usarlas en onMounted

/**
 * Convierte un texto a tipo Título (primera letra mayúscula).
 * Limpia '****' y espacios.
 */
function capitalizar(texto) {
  if (!texto) {
    return ''; // Devuelve vacío si es null, undefined o ""
  }
  const textoLimpio = String(texto).trim();
  if (textoLimpio === '****') {
    return ''; // Maneja el caso específico de '****'
  }
  return textoLimpio.charAt(0).toUpperCase() + textoLimpio.slice(1).toLowerCase();
}

/**
 * Convierte un valor (probablemente texto) a un número.
 * - Reemplaza la coma (',') por un punto ('.').
 * - Si el valor es vacío, nulo o no es un número, devuelve 0.
 */
function parsearNumero(valor) {
  if (!valor) {
    return 0; // Devuelve 0 para valores vacíos, null o undefined
  }
  const valorLimpio = String(valor).replace(',', '.');
  const numero = parseFloat(valorLimpio);

  // Si parseFloat falla (ej. por "texto") o es vacío, devuelve 0
  return isNaN(numero) ? 0 : numero;
}

// --- 4. LÓGICA DE CARGA DE DATOS (MODIFICADA) ---
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
      fetch('/alimentos_mod.csv') // Asumimos que está en la carpeta /public
        .then((response) => response.text())
        .then((csvText) => {
          Papa.parse(csvText, {
            header: true,
            delimiter: ';',
            skipEmptyLines: true,
            // dynamicTyping: false, <-- Quitamos esto. Es más seguro parsear manualmente.

            complete: (results) => {

              // --- ¡AQUÍ APLICAMOS LA NUEVA LIMPIEZA! ---
              const alimentosLimpios = results.data
                .map((item) => {
                  // Aplicamos nuestras funciones a cada campo
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
                .filter((item) => item.nombre); // Filtramos los que no tienen nombre

              // Guardamos en la BBDD
              db.alimentos.bulkAdd(alimentosLimpios).then(() => {
                console.log(`${alimentosLimpios.length} alimentos limpios cargados.`);
                // Recargamos la página para que la tabla vea los nuevos datos
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

<style scoped></style>
