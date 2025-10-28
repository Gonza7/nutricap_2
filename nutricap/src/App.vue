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
    </Menubar>
  </header>

  <main class="p-4">
    <RouterView />
    <InputText placeholder="Hola" />
    <Button label="Hola" />
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterView, RouterLink } from 'vue-router'
import { db } from './db' // Importamos Dexie
import Papa from 'papaparse' // Importamos Papa Parse

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
onMounted(async () => {
  try {
    const count = await db.alimentos.count()
    if (count > 0) {
      console.log('Base de datos ya tiene datos.')
      return
    }

    console.log('Base de datos vacía, cargando alimentos desde CSV...')

    const response = await fetch('/alimentos_mod.csv')
    const csvText = await response.text()

    Papa.parse(csvText, {
      header: true,
      delimiter: ';',
      skipEmptyLines: true,
      dynamicTyping: true,

      complete: async (results) => {
        const alimentosLimpios = results.data
          .map((item) => {
            Object.keys(item).forEach((key) => {
              // Limpia los '****' y cualquier espacio extra
              const valor = item[key]
              if (valor === '****') {
                item[key] = null
              } else if (typeof valor === 'string') {
                item[key] = valor.trim()
              }
            })
            // Asegúrate de que los campos numéricos sean números
            item.ms = parseFloat(String(item.ms).replace(',', '.')) || null
            item.em = parseFloat(String(item.em).replace(',', '.')) || null
            item.pb = parseFloat(String(item.pb).replace(',', '.')) || null
            item.fdn = parseFloat(String(item.fdn).replace(',', '.')) || null
            item.calcio = parseFloat(String(item.calcio).replace(',', '.')) || null
            item.fosforo = parseFloat(String(item.fosforo).replace(',', '.')) || null

            return item
          })
          .filter((item) => item.nombre) // Filtra filas vacías

        await db.alimentos.bulkAdd(alimentosLimpios)
        console.log(`${alimentosLimpios.length} alimentos cargados desde CSV.`)
      },
      error: (err) => {
        console.error('Error con Papa Parse:', err)
      },
    })
  } catch (error) {
    console.error('Error al poblar la base de datos:', error)
  }
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
</style>
