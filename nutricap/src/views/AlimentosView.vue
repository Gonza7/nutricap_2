<template>
  <Card>
    <template #title>
      <div class="flex justify-content-between align-items-center mb-3">
        <span class="text-xl font-semibold">Gestión de Alimentos</span>
        <Button label="Nuevo Alimento" icon="pi pi-plus" @click="abrirDialogNuevo" />
      </div>
    </template>

    <template #content>
      <DataTable :value="alimentos" :loading="loading" paginator :rows="15" :rowsPerPageOptions="[10, 15, 30, 50]"
        removableSort stripedRows size="small" tableStyle="min-width: 50rem" dataKey="id">
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

        <Column header="Acciones" :exportable="false" style="min-width: 8rem" frozen alignFrozen="right">
          <template #body="slotProps">
            <Button icon="pi pi-pencil" variant="text" severity="contrast" class="p-button p-button mr-2"
              @click="editarItem(slotProps.data)" />
            <Button icon="pi pi-trash" variant="text" severity="danger" class="p-button p-button"
              @click="confirmarEliminar(slotProps.data)" />
          </template>
        </Column>
        <template #empty> No se encontraron alimentos. </template>
      </DataTable>
    </template>
  </Card>

  <!-- Diálogo de creación/edición -->
  <Dialog v-model:visible="dialogVisible" :header="editando ? 'Editar Alimento' : 'Nuevo Alimento'" modal
    class="w-full md:w-8 lg:w-6">
    <!-- Contenedor del formulario -->
    <div class="formgrid grid gap-3 p-fluid">
      <!-- Fila 1: Grupo / Nombre -->
      <div class="col-12 md:col-6">
        <label for="grupo" class="block mb-2">Grupo</label>
        <InputText id="grupo" v-model="form.grupo" class="w-full" />
      </div>
      <div class="col-12 md:col-6">
        <label for="nombre" class="block mb-2">Nombre</label>
        <InputText id="nombre" v-model="form.nombre" class="w-full" />
      </div>

      <!-- Fila 2: Forma física / Momento -->
      <div class="col-12 md:col-6">
        <label for="forma" class="block mb-2">Forma física</label>
        <InputText id="forma" v-model="form.forma" class="w-full" />
      </div>
      <div class="col-12 md:col-6">
        <label for="momento" class="block mb-2">Momento</label>
        <InputText id="momento" v-model="form.momento" class="w-full" />
      </div>

      <!-- Fila 3: % MS / EM (Mcal) / % PB -->
      <div class="col-12 md:col-4">
        <label for="ms" class="block mb-2">% MS</label>
        <InputText id="ms" v-model="form.ms" class="w-full" />
      </div>
      <div class="col-12 md:col-4">
        <label for="em" class="block mb-2">EM (Mcal)</label>
        <InputText id="em" v-model="form.em" class="w-full" />
      </div>
      <div class="col-12 md:col-4">
        <label for="pb" class="block mb-2">% PB</label>
        <InputText id="pb" v-model="form.pb" class="w-full" />
      </div>

      <!-- Fila 4: % FDN / Calcio / Fósforo -->
      <div class="col-12 md:col-4">
        <label for="fdn" class="block mb-2">% FDN</label>
        <InputText id="fdn" v-model="form.fdn" class="w-full" />
      </div>
      <div class="col-12 md:col-4">
        <label for="calcio" class="block mb-2">Calcio</label>
        <InputText id="calcio" v-model="form.calcio" class="w-full" />
      </div>
      <div class="col-12 md:col-4">
        <label for="fosforo" class="block mb-2">Fósforo</label>
        <InputText id="fosforo" v-model="form.fosforo" class="w-full" />
      </div>

      <!-- Fila 5: Precio -->
      <div class="col-12">
        <label for="precio" class="block mb-2">Precio</label>
        <InputText id="precio" v-model="form.precio" class="w-full" />
      </div>
    </div>

    <!-- Botones -->
    <template #footer>
      <div class="flex justify-content-end gap-2 mt-3">
        <Button label="Cancelar" severity="secondary" @click="cerrarDialog" />
        <Button label="Guardar" icon="pi pi-check" @click="guardarAlimento" />
      </div>
    </template>
  </Dialog>




</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { db } from '@/db'
import { useToast } from 'primevue/usetoast'

// --- Estado general ---
const alimentosRaw = ref([])
const loading = ref(true)
const filtroGrupo = ref('')
const filtroNombre = ref('')
const toast = useToast()

// --- Estados de los diálogos ---
const dialogVisible = ref(false)
const deleteDialogVisible = ref(false)
const modoEdicion = ref(false)
const alimentoAEliminar = ref(null)

// --- Formulario ---
const form = ref({
  id: null,
  grupo: '',
  nombre: '',
  forma: '',
  momento: '',
  ms: null,
  em: null,
  pb: null,
  fdn: null,
  calcio: null,
  fosforo: null,
  precio: null,
})

// --- Cargar alimentos ---
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

// --- Filtros ---
const alimentos = computed(() => {
  return alimentosRaw.value.filter((a) => {
    const g = String(a.grupo || '').toLowerCase()
    const n = String(a.nombre || '').toLowerCase()
    const fGrupo = filtroGrupo.value.toLowerCase()
    const fNombre = filtroNombre.value.toLowerCase()
    return g.includes(fGrupo) && n.includes(fNombre)
  })
})

// --- CRUD ---
function abrirDialogNuevo() {
  modoEdicion.value = false
  Object.assign(form.value, {
    id: null,
    grupo: '',
    nombre: '',
    forma: '',
    momento: '',
    ms: null,
    em: null,
    pb: null,
    fdn: null,
    calcio: null,
    fosforo: null,
    precio: null,
  })
  dialogVisible.value = true
}

function editarItem(item) {
  modoEdicion.value = true
  Object.assign(form.value, item)
  dialogVisible.value = true
}

function cerrarDialog() {
  dialogVisible.value = false
}

async function guardarAlimento() {
  if (!form.value.nombre || !form.value.grupo) {
    toast.add({
      severity: 'warn',
      summary: 'Campos requeridos',
      detail: 'Los campos Nombre y Grupo son obligatorios.',
      life: 3000,
    })
    return
  }

  try {
    if (modoEdicion.value) {
      await db.alimentos.put(form.value)
      toast.add({
        severity: 'success',
        summary: 'Alimento actualizado',
        detail: `${form.value.nombre} fue modificado.`,
        life: 2000,
      })
    } else {
      await db.alimentos.add(form.value)
      toast.add({
        severity: 'success',
        summary: 'Alimento creado',
        detail: `${form.value.nombre} fue agregado.`,
        life: 2000,
      })
    }
    dialogVisible.value = false
    cargarAlimentos()
  } catch (error) {
    console.error('Error guardando alimento:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo guardar el alimento.',
      life: 3000,
    })
  }
}

function confirmarEliminar(item) {
  alimentoAEliminar.value = item
  deleteDialogVisible.value = true
}

async function eliminarAlimento() {
  try {
    await db.alimentos.delete(alimentoAEliminar.value.id)
    deleteDialogVisible.value = false
    toast.add({
      severity: 'success',
      summary: 'Eliminado',
      detail: `${alimentoAEliminar.value.nombre} fue eliminado.`,
      life: 2000,
    })
    cargarAlimentos()
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo eliminar el alimento.',
      life: 3000,
    })
  }
}
</script>

<style scoped>
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
