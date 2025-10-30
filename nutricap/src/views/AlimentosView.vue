<template>
  <Card>
    <template #title>
      <div class="flex justify-content-between align-items-center mb-3">
        <span class="text-xl font-semibold">Gestión de Alimentos</span>
        <Button label="Nuevo Alimento" icon="pi pi-plus" @click="abrirDialogNuevo" />
      </div>
    </template>

    <template #content>
      <DataTable
        :value="alimentos"
        :loading="loading"
        paginator
        :rows="15"
        :rowsPerPageOptions="[10, 15, 30, 50]"
        removableSort
        stripedRows
        size="small"
        tableStyle="min-width: 50rem"
        dataKey="id"
      >
        <template #header>
          <div class="filtros-tabla">
            <InputText v-model="filtroGrupo" placeholder="Filtrar por Grupo" />
            <InputText v-model="filtroNombre" placeholder="Filtrar por Nombre" />
          </div>
        </template>

        <Column field="grupo" header="Grupo" sortable style="min-width: 10rem"></Column>
        <Column field="nombre" header="Nombre" sortable style="min-width: 12rem"></Column>
        <Column field="forma" header="Forma física" sortable style="min-width: 10rem"></Column>
        <Column field="momento" header="Momento" sortable style="min-width: 10rem"></Column>
        <Column field="ms" header="% MS" sortable></Column>
        <Column field="em" header="EM (Mcal)" sortable></Column>
        <Column field="pb" header="% PB" sortable></Column>
        <Column field="fdn" header="% FDN" sortable></Column>
        <Column field="calcio" header="Calcio" sortable></Column>
        <Column field="fosforo" header="Fósforo" sortable></Column>
        <Column field="precio" header="Precio" sortable></Column>

        <Column
          header="Acciones"
          :exportable="false"
          style="min-width: 8rem"
          frozen
          alignFrozen="right"
        >
          <template #body="slotProps">
            <Button
              icon="pi pi-pencil"
              variant="text"
              severity="contrast"
              class="p-button p-button mr-2"
              @click="editarItem(slotProps.data)"
            />
            <Button
              icon="pi pi-trash"
              variant="text"
              severity="danger"
              class="p-button p-button"
              @click="confirmarEliminar(slotProps.data)"
            />
          </template>
        </Column>
        <template #empty> No se encontraron alimentos. </template>
      </DataTable>
    </template>
  </Card>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { db } from '@/db'
import { useToast } from 'primevue/usetoast'

// --- Estado de la Vista (Filtros y Carga) ---
// (Esto se mantiene para que la tabla funcione)
const alimentosRaw = ref([])
const loading = ref(true)
const filtroGrupo = ref('')
const filtroNombre = ref('')
const toast = useToast()

// --- Carga de Datos (READ) ---
// (Se mantiene para llenar la tabla)
onMounted(() => {
  cargarAlimentos()
})

async function cargarAlimentos() {
  loading.value = true
  try {
    alimentosRaw.value = await db.alimentos.toArray()
  } catch (error) {
    console.error('Error cargando alimentos:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudieron cargar los alimentos',
      life: 3000,
    })
  } finally {
    loading.value = false
  }
}

// --- Lógica de Filtros ---
// (Se mantiene para que los filtros funcionen)
const alimentos = computed(() => {
  return alimentosRaw.value.filter((a) => {
    const g = String(a.grupo || '').toLowerCase()
    const n = String(a.nombre || '').toLowerCase()
    const fGrupo = filtroGrupo.value.toLowerCase()
    const fNombre = filtroNombre.value.toLowerCase()
    return g.includes(fGrupo) && n.includes(fNombre)
  })
})

// --- STUBS DEL CRUD ---
// (Aquí puedes empezar a escribir tu lógica)

function abrirDialogNuevo() {
  console.log('Botón "Nuevo Alimento" presionado.')
  // Aquí puedes, por ejemplo, hacer: dialogVisible.value = true
  toast.add({
    severity: 'info',
    summary: 'Función "Crear"',
    detail: 'Implementa tu lógica aquí.',
    life: 3000,
  })
}

function editarItem(item) {
  console.log('Botón "Editar" presionado para:', item.nombre)
  // Aquí puedes, por ejemplo, hacer: editedItem.value = { ...item }
  toast.add({
    severity: 'info',
    summary: 'Función "Editar"',
    detail: `Implementa tu lógica para: ${item.nombre}`,
    life: 3000,
  })
}

function confirmarEliminar(item) {
  console.log('Botón "Eliminar" presionado para:', item.nombre)
  // Aquí puedes, por ejemplo, hacer: deleteDialogVisible.value = true
  toast.add({
    severity: 'warn',
    summary: 'Función "Eliminar"',
    detail: `Implementa tu lógica para: ${item.nombre}`,
    life: 3000,
  })
}
</script>

<style scoped>
/* Estilos eliminados ya que eran para el formulario */
</style>
