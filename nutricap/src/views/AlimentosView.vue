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
import { required, numeric, minValue, helpers } from '@vuelidate/validators'
import { useConfirm } from 'primevue/useconfirm'

// Extrae 'withMessage' de 'helpers' para usarlo fácilmente
const { withMessage } = helpers

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
  grupo: { required: withMessage('El grupo es obligatorio', required) },
  nombre: { required: withMessage('El nombre es obligatorio', required) },
  ms: {
    required: withMessage('El MS es obligatorio', required),
    numeric: withMessage('El MS debe ser un número', numeric),
    minValue: withMessage('El MS debe ser mayor o igual a 0', minValue(0)),
  },
  em: {
    required: withMessage('El EM es obligatorio', required),
    numeric: withMessage('El EM debe ser un número', numeric),
    minValue: withMessage('El EM debe ser mayor o igual a 0', minValue(0)),
  },
  pb: {
    required: withMessage('El PB es obligatorio', required),
    numeric: withMessage('El PB debe ser un número', numeric),
    minValue: withMessage('El PB debe ser mayor o igual a 0', minValue(0)),
  },
  fdn: {
    required: withMessage('El FDN es obligatorio', required),
    numeric: withMessage('El FDN debe ser un número', numeric),
    minValue: withMessage('El FDN debe ser mayor o igual a 0', minValue(0)),
  },
  calcio: {
    required: withMessage('El calcio es obligatorio', required),
    numeric: withMessage('El calcio debe ser un número', numeric),
    minValue: withMessage('El calcio debe ser mayor o igual a 0', minValue(0)),
  },
  fosforo: {
    required: withMessage('El fósforo es obligatorio', required),
    numeric: withMessage('El fósforo debe ser un número', numeric),
    minValue: withMessage('El fósforo debe ser mayor o igual a 0', minValue(0)),
  },
  precio: {
    required: withMessage('El precio es obligatorio', required),
    numeric: withMessage('El precio debe ser un número', numeric),
    minValue: withMessage('El precio debe ser mayor o igual a 0', minValue(0)),
  },
}
// Inicializa Vuelidate
const v$ = useVuelidate(rules, alimento)
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

// Función para abrir el diálogo de nuevo alimento
function abrirDialogNuevo() {
  console.log('Botón "Nuevo Alimento" presionado.')
  //Resetear el objeto alimento
  alimento.id = null
  alimento.grupo = ''
  alimento.nombre = ''
  alimento.forma = ''
  alimento.momento = ''
  alimento.ms = 0
  alimento.em = 0
  alimento.pb = 0
  alimento.fdn = 0
  alimento.calcio = 0
  alimento.fosforo = 0
  alimento.precio = 0
  //Resetear el estado de envio
  submitted.value = false
  //Abrir el dialogo
  dialog.value = true
}
// Función para abrir el diálogo para editar un item
function editarItem(item) {
  console.log('Botón "Editar" presionado para:', item.nombre)
  //Copiar los datos del item al objeto alimento
  Object.assign(alimento, item)
  //Resetear el estado de envio
  submitted.value = false
  //Abrir el dialogo
  dialog.value = true
}
// Función para confirmar eliminación
function confirmarEliminar(item) {
  console.log('Botón "Eliminar" presionado para:', item.nombre)
  // Mostrar confirmación antes de eliminar
  confirm.require({
    message: `¿Estás seguro de que deseas eliminar el alimento "${item.nombre}"?`,
    header: 'Confirmar Eliminación',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    // Acción al aceptar
    accept: () => {
      // Lógica para eliminar el alimento
      alimentosRaw.value = alimentosRaw.value.filter((a) => a.id !== item.id)
      // Mostrar notificación de éxito
      toast.add({
        severity: 'success',
        summary: 'Eliminado',
        detail: `El alimento "${item.nombre}" ha sido eliminado.`,
        life: 3000,
      })
    },
    // Acción al rechazar
    reject: () => {
      console.log('Eliminación cancelada.')
    },
  })
}
// Función para cerrar el diálogo
function cerrarDialog() {
  //Cerrar el diálogo
  dialog.value = false
  //Resetear el estado de envio
  submitted.value = false
}
//Función para guardar el alimento (nuevo o editado)
async function guardarAlimento() {
  //Marcar que se ha intentado enviar el formulario
  submitted.value = true
  //Validar el formulario
  const isValid = await v$.value.$validate()
  //Si no es válido, mostrar mensaje de error y salir
  if (!isValid) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Por favor, corrige los errores en el formulario.',
      life: 3000,
    })
    return
  }
  //Si es válido, proceder a guardar
  console.log('Guardando alimento:', alimento)
  if (alimento.id) {
    // Lógica para actualizar un alimento existente
    // Buscar el índice del alimento en el array
    const index = alimentosRaw.value.findIndex((a) => a.id === alimento.id)
    // Actualizar el alimento en el array
    if (index !== -1) {
      // Reemplazar el alimento en el array
      alimentosRaw.value[index] = { ...alimento }
      // Mostrar notificación de éxito
      toast.add({
        severity: 'success',
        summary: 'Actualizado',
        detail: `El alimento "${alimento.nombre}" ha sido actualizado.`,
        life: 3000,
      })
    }
  } else {
    // Lógica para agregar un nuevo alimento
    // Asignar un nuevo ID (simple incremento)
    const nuevoId = alimentosRaw.value.length
      ? Math.max(...alimentosRaw.value.map((a) => a.id)) + 1
      : 1
    // Agregar el nuevo alimento al array
    alimentosRaw.value.push({ ...alimento, id: nuevoId })
    // Mostrar notificación de éxito
    toast.add({
      severity: 'success',
      summary: 'Agregado',
      detail: `El alimento "${alimento.nombre}" ha sido agregado.`,
      life: 3000,
    })
  }
  //Cerrar el diálogo
  dialog.value = false
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
