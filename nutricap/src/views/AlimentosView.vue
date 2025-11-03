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
import { ref, onMounted, computed, reactive } from 'vue'
import { db } from '@/db'
import { useToast } from 'primevue/usetoast'
import { useVuelidate } from '@vuelidate/core'
import { required, numeric, minValue } from '@vuelidate/validators'
import { useConfirm } from 'primevue/useconfirm'
// --- Estado general (para la tabla y filtros) ---
const alimentosRaw = ref([])
const loading = ref(true)
const filtroGrupo = ref('')
const filtroNombre = ref('')
const toast = useToast()
const confirm = useConfirm()
const dialog = ref(false)
const submitted = ref(false)
// Modelo para el formulario (un solo producto)
const alimento = reactive({
  id: null,
  grupo: '',
  nombre: '',
  forma: '',
  momento: '',
  ms: 0,
  em: 0,
  pb: 0,
  fdn: 0,
  calcio: 0,
  fosforo: 0,
  precio: 0,
})
// --- Validaciones ---
const rules = {
  grupo: { required },
  nombre: { required },
  ms: { required, numeric, minValue: minValue(0) },
  em: { required, numeric, minValue: minValue(0) },
  pb: { required, numeric, minValue: minValue(0) },
  fdn: { required, numeric, minValue: minValue(0) },
  calcio: { required, numeric, minValue: minValue(0) },
  fosforo: { required, numeric, minValue: minValue(0) },
  precio: { required, numeric, minValue: minValue(0) },
}
// Inicializa Vuelidate
const v$ = useVuelidate(rules, product)
// --- Cargar alimentos (Se mantiene) ---
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

// --- Filtros (Se mantiene) ---
const alimentos = computed(() => {
  return alimentosRaw.value.filter((a) => {
    const g = String(a.grupo || '').toLowerCase()
    const n = String(a.nombre || '').toLowerCase()
    const fGrupo = filtroGrupo.value.toLowerCase()
    const fNombre = filtroNombre.value.toLowerCase()
    return g.includes(fGrupo) && n.includes(fNombre)
  })
})

// --- STUBS DEL CRUD (Placeholders) ---
// (Toda la lógica de 'form', 'dialogVisible', 'guardar', etc., ha sido eliminada)
// (Solo quedan las funciones que los botones llaman)

function abrirDialogNuevo() {
  console.log('Botón "Nuevo Alimento" presionado.')
  // Aquí puedes empezar a implementar tu lógica
  toast.add({
    severity: 'info',
    summary: 'Función "Crear"',
    detail: 'Implementa tu lógica aquí.',
    life: 3000,
  })
}

function editarItem(item) {
  console.log('Botón "Editar" presionado para:', item.nombre)
  // Aquí puedes empezar a implementar tu lógica
  toast.add({
    severity: 'info',
    summary: 'Función "Editar"',
    detail: `Implementa tu lógica para: ${item.nombre}`,
    life: 3000,
  })
}

function confirmarEliminar(item) {
  console.log('Botón "Eliminar" presionado para:', item.nombre)
  // Aquí puedes empezar a implementar tu lógica
  toast.add({
    severity: 'warn',
    summary: 'Función "Eliminar"',
    detail: `Implementa tu lógica para: ${item.nombre}`,
    life: 3000,
  })
}
</script>

<style scoped>
/* Tu CSS personalizado para los filtros se mantiene */
.filtros-tabla {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: flex-end;
  margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
  .filtros-tabla {
    justify-content: center;
  }
}
</style>
