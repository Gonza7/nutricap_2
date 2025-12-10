<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { db } from '@/db'
import Card from 'primevue/card'
import Button from 'primevue/button'

const router = useRouter()
const totalAlimentos = ref(0)
const loading = ref(true)

// Eliminamos las propiedades de color y bg específicas
const modulos = [
  { 
    titulo: 'Gestión de Tambo', 
    icono: 'pi pi-calculator', 
    ruta: 'tambo', 
    descripcion: 'Calculadoras nutricionales y gestión del rodeo.'
  },
  { 
    titulo: 'Base de Alimentos', 
    icono: 'pi pi-database', 
    ruta: 'alimentos', 
    descripcion: 'Administra y consulta la composición de los alimentos.'
  },
  { 
    titulo: 'Configuración', 
    icono: 'pi pi-cog', 
    ruta: 'about', 
    descripcion: 'Información de la aplicación y ajustes generales.'
  }
]

onMounted(async () => {
  try {
    if (db && db.alimentos) {
      totalAlimentos.value = await db.alimentos.count()
    }
  } catch (error) {
    console.error("Error cargando datos del dashboard:", error)
  } finally {
    loading.value = false
  }
})

function navegar(nombreRuta) {
  router.push({ name: nombreRuta })
}
</script>

<template>
  <div class="max-w-6xl mx-auto p-6">
    
    <div class="mb-10 text-center md:text-left">
      <h1 class="text-4xl font-bold mb-2">
        Bienvenido a Nutricap
      </h1>
      <p class="text-lg">
        Selecciona un módulo para comenzar.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      
      <Card 
        v-for="modulo in modulos" 
        :key="modulo.ruta" 
        class="shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border"
        @click="navegar(modulo.ruta)"
      >
        <template #header>
          <div class="h-32 flex items-center justify-center rounded-t-lg">
            <i :class="[modulo.icono, 'text-6xl']"></i>
          </div>
        </template>
        
        <template #title>
          <div class="text-xl font-bold mt-2">
            {{ modulo.titulo }}
          </div>
        </template>
        
        <template #content>
          <p class="min-h-[3rem]">
            {{ modulo.descripcion }}
          </p>
          
          <div v-if="modulo.ruta === 'alimentos' && !loading" class="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold">
            <i class="pi pi-check mr-2 text-xs"></i>
            {{ totalAlimentos }} Registros
          </div>
        </template>

        <template #footer>
          <div class="flex justify-end">
            <Button label="Ingresar" icon="pi pi-arrow-right" text severity="secondary" size="small" />
          </div>
        </template>
      </Card>
      
    </div>
  </div>
</template>

<style scoped>
:deep(.p-card-body) {
  height: 100%;
  display: flex;
  flex-direction: column;
}
:deep(.p-card-content) {
  flex-grow: 1;
}
</style>