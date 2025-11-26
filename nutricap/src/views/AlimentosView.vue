<template>
  <Card>
    <template #title>
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-2">
        <span class="text-xl font-semibold mb-2 sm:mb-auto">Tabla de Alimentos</span>
        <Button label="Nuevo Alimento" icon="pi pi-plus" @click="abrirDialogNuevo" class="w-full sm:w-auto sm:mr-2 self-center sm:self-auto"/>
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
          <div class="flex flex-wrap gap-2 mb-2 justify-center sm:justify-end">
            <InputText v-model="filtroGrupo" placeholder="Filtrar por Grupo" class="w-full sm:w-auto" />
            <InputText v-model="filtroNombre" placeholder="Filtrar por Nombre" class="w-full sm:w-auto" />
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
        <Column field="precio" header="Precio" sortable
          ><template #body="slotProps">
            {{ formatPrice(slotProps.data.precio) }}
          </template></Column
        >

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
      <Dialog
        v-model:visible="dialog"
        :style="{ width: '90vw', maxWidth: '600px' }"
        header="Detalles del alimento"
        :modal="true"
      >
        <!-- Grupo -->
        <div class="flex flex-wrap gap-4 items-end mt-1">
          <div class="w-full">
            <FloatLabel variant="on" class="w-full mb-1">
              <InputText
                id="grupo"
                v-model.trim="alimento.grupo"
                :required="true"
                :invalid="v$.grupo.$invalid && submitted"
                class="w-full"
              />
              <label for="grupo">Grupo</label>
            </FloatLabel>
            <span v-if="v$.grupo.$invalid && submitted">
              <small
                class="text-red-500 block mb-1"
                v-for="error of v$.grupo.$errors"
                :key="error.$uid"
              >
                {{ error.$message }}
              </small>
            </span>
          </div>
          <!-- Nombre -->
          <div class="w-full">
            <FloatLabel variant="on" class="w-full mb-1">
              <InputText
                id="nombre"
                v-model.trim="alimento.nombre"
                :required="true"
                :invalid="v$.nombre.$invalid && submitted"
                class="w-full"
              />
              <label for="nombre">Nombre</label>
            </FloatLabel>
            <span v-if="v$.nombre.$invalid && submitted">
              <small
                class="text-red-500 block mb-1"
                v-for="error of v$.nombre.$errors"
                :key="error.$uid"
              >
                {{ error.$message }}
              </small>
            </span>
          </div>
          <!-- Forma fisica -->
          <div class="w-full">
            <FloatLabel variant="on" class="w-full mb-1">
              <InputText id="forma" v-model.trim="alimento.forma" class="w-full" />
              <label for="forma">Forma física</label>
            </FloatLabel>
          </div>
          <!-- Momento -->
          <div class="w-full">
            <FloatLabel variant="on" class="w-full mb-1">
              <InputText id="momento" v-model.trim="alimento.momento" class="w-full" />
              <label for="momento">Momento</label>
            </FloatLabel>
          </div>
          <!-- MS y EM en fila -->
          <div class="flex flex-col sm:flex-row gap-4 w-full">
            <div class="flex-1 min-w-0">
              <FloatLabel variant="on" class="w-full mb-1">
                <InputNumber
                  id="ms"
                  v-model="alimento.ms"
                  :required="true"
                  :invalid="v$.ms.$invalid && submitted"
                  class="w-full"
                />
                <label for="ms">% MS</label>
              </FloatLabel>
              <span v-if="v$.ms.$invalid && submitted">
                <small
                  class="text-red-500 block mb-1"
                  v-for="error of v$.ms.$errors"
                  :key="error.$uid"
                >
                  {{ error.$message }}
                </small>
              </span>
            </div>
            <div class="flex-1 min-w-0">
              <FloatLabel variant="on" class="w-full mb-1">
                <InputNumber
                  id="em"
                  v-model="alimento.em"
                  :required="true"
                  :invalid="v$.em.$invalid && submitted"
                  class="w-full"
                />
                <label for="em">EM (Mcal)</label>
              </FloatLabel>
              <span v-if="v$.em.$invalid && submitted">
                <small
                  class="text-red-500 block mb-1"
                  v-for="error of v$.em.$errors"
                  :key="error.$uid"
                >
                  {{ error.$message }}
                </small>
              </span>
            </div>
          </div>
          <!-- PB y FDN en fila -->
          <div class="flex flex-col sm:flex-row gap-4 w-full">
            <div class="flex-1 min-w-0">
              <FloatLabel variant="on" class="w-full mb-1">
                <InputNumber
                  id="pb"
                  v-model="alimento.pb"
                  :required="true"
                  :invalid="v$.pb.$invalid && submitted"
                  class="w-full"
                />
                <label for="pb">% PB</label>
              </FloatLabel>
              <span v-if="v$.pb.$invalid && submitted">
                <small
                  class="text-red-500 block mb-1"
                  v-for="error of v$.pb.$errors"
                  :key="error.$uid"
                >
                  {{ error.$message }}
                </small>
              </span>
            </div>
            <div class="flex-1 min-w-0">
              <FloatLabel variant="on" class="w-full mb-1">
                <InputNumber
                  id="fdn"
                  v-model="alimento.fdn"
                  :required="true"
                  :invalid="v$.fdn.$invalid && submitted"
                  class="w-full"
                />
                <label for="fdn">% FDN</label>
              </FloatLabel>
              <span v-if="v$.fdn.$invalid && submitted">
                <small
                  class="text-red-500 block mb-1"
                  v-for="error of v$.fdn.$errors"
                  :key="error.$uid"
                >
                  {{ error.$message }}
                </small>
              </span>
            </div>
          </div>
          <!-- Calcio y Fosforo en fila -->
          <div class="flex flex-col sm:flex-row gap-4 w-full">
            <div class="flex-1 min-w-0">
              <FloatLabel variant="on" class="w-full mb-1">
                <InputNumber
                  id="calcio"
                  v-model="alimento.calcio"
                  :required="true"
                  :invalid="v$.calcio.$invalid && submitted"
                  class="w-full"
                />
                <label for="calcio">Calcio</label>
              </FloatLabel>
              <span v-if="v$.calcio.$invalid && submitted">
                <small
                  class="text-red-500 block mb-1"
                  v-for="error of v$.calcio.$errors"
                  :key="error.$uid"
                >
                  {{ error.$message }}
                </small>
              </span>
            </div>
            <div class="flex-1 min-w-0">
              <FloatLabel variant="on" class="w-full mb-1">
                <InputNumber
                  id="fosforo"
                  v-model="alimento.fosforo"
                  :required="true"
                  :invalid="v$.fosforo.$invalid && submitted"
                  class="w-full"
                />
                <label for="fosforo">Fósforo</label>
              </FloatLabel>
              <span v-if="v$.fosforo.$invalid && submitted">
                <small
                  class="text-red-500 block mb-1"
                  v-for="error of v$.fosforo.$errors"
                  :key="error.$uid"
                >
                  {{ error.$message }}
                </small>
              </span>
            </div>
          </div>
          <!-- Precio -->
          <div class="w-full">
            <FloatLabel variant="on" class="w-full mb-1">
              <InputNumber
                id="precio"
                v-model="alimento.precio"
                :required="true"
                :invalid="v$.precio.$invalid && submitted"
                class="w-full"
                mode="currency"
                currency="ARS"
                locale="es-AR"
              />
              <label for="precio">Precio</label>
            </FloatLabel>
            <span v-if="v$.precio.$invalid && submitted">
              <small
                class="text-red-500 block mb-1"
                v-for="error of v$.precio.$errors"
                :key="error.$uid"
              >
                {{ error.$message }}
              </small>
            </span>
          </div>
        </div>
        <!-- <FloatLabel variant="in" class="mb-1">
            <InputText id="grupo" v-model.trim="alimento.grupo" :required="true"
              :invalid="v$.grupo.$invalid && submitted" fluid />
            <label for="grupo">Grupo</label>
          </FloatLabel>
          <span v-if="v$.grupo.$invalid && submitted">
            <small class="text-red-500 block mb-1" v-for="error of v$.grupo.$errors" :key="error.$uid">
              {{ error.$message }}
            </small>
          </span>

          <FloatLabel variant="in" class="mb-1">
            <InputText id="nombre" v-model.trim="alimento.nombre" :required="true"
              :invalid="v$.nombre.$invalid && submitted" fluid />
            <label for="nombre">Nombre</label>
          </FloatLabel>
          <span v-if="v$.nombre.$invalid && submitted">
            <small class="text-red-500 block mb-1" v-for="error of v$.nombre.$errors" :key="error.$uid">
              {{ error.$message }}
            </small>
          </span>

          <FloatLabel variant="in" class="mb-1">
            <InputText id="forma" v-model.trim="alimento.forma" fluid />
            <label for="forma">Forma</label>
          </FloatLabel>

          <FloatLabel variant="in" class="mb-1">
            <InputText id="momento" v-model.trim="alimento.momento" fluid />
            <label for="momento">Momento</label>
          </FloatLabel>

          <FloatLabel variant="in" class="mb-1">
            <InputNumber id="ms" v-model="alimento.ms" :required="true" :invalid="v$.ms.$invalid && submitted" />
            <label for="ms">% MS</label>
          </FloatLabel>
          <span v-if="v$.ms.$invalid && submitted">
            <small class="text-red-500 block mb-1" v-for="error of v$.ms.$errors" :key="error.$uid">
              {{ error.$message }}
            </small>
          </span>

          <FloatLabel variant="in" class="mb-1">
            <InputNumber id="em" v-model="alimento.em" :required="true" :invalid="v$.em.$invalid && submitted" />
            <label for="em">EM (Mcal)</label>
          </FloatLabel>
          <span v-if="v$.em.$invalid && submitted">
            <small class="text-red-500 block mb-1" v-for="error of v$.em.$errors" :key="error.$uid">
              {{ error.$message }}
            </small>
          </span>

          <FloatLabel variant="in" class="mb-1">
            <InputNumber id="pb" v-model="alimento.pb" :required="true" :invalid="v$.pb.$invalid && submitted" />
            <label for="pb">% PB</label>
          </FloatLabel>
          <span v-if="v$.pb.$invalid && submitted">
            <small class="text-red-500 block mb-1" v-for="error of v$.pb.$errors" :key="error.$uid">
              {{ error.$message }}
            </small>
          </span>

          <FloatLabel variant="in" class="mb-1">
            <InputNumber id="fdn" v-model="alimento.fdn" :required="true" :invalid="v$.fdn.$invalid && submitted" />
            <label for="fdn">% FDN</label>
          </FloatLabel>
          <span v-if="v$.fdn.$invalid && submitted">
            <small class="text-red-500 block mb-1" v-for="error of v$.fdn.$errors" :key="error.$uid">
              {{ error.$message }}
            </small>
          </span>

          <FloatLabel variant="in" class="mb-1">
            <InputNumber id="calcio" v-model="alimento.calcio" :required="true"
              :invalid="v$.calcio.$invalid && submitted" />
            <label for="calcio">Calcio</label>
          </FloatLabel>
          <span v-if="v$.calcio.$invalid && submitted">
            <small class="text-red-500 block mb-1" v-for="error of v$.calcio.$errors" :key="error.$uid">
              {{ error.$message }}
            </small>
          </span>

          <FloatLabel variant="in" class="mb-1">
            <InputNumber id="fosforo" v-model="alimento.fosforo" :required="true"
              :invalid="v$.fosforo.$invalid && submitted" />
            <label for="fosforo">Fósforo</label>
          </FloatLabel>
          <span v-if="v$.fosforo.$invalid && submitted">
            <small class="text-red-500 block mb-1" v-for="error of v$.fosforo.$errors" :key="error.$uid">
              {{ error.$message }}
            </small>
          </span>

          <FloatLabel variant="in" class="mb-1">
            <InputNumber id="precio" v-model="alimento.precio" :required="true"
              :invalid="v$.precio.$invalid && submitted" fluid />
            <label for="precio">Precio</label>
          </FloatLabel>
          <span v-if="v$.precio.$invalid && submitted">
            <small class="text-red-500 block mb-1" v-for="error of v$.precio.$errors" :key="error.$uid">
              {{ error.$message }}
            </small>
          </span> -->

        <template #footer>
          <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="cerrarDialog" />
          <Button
            label="Guardar"
            icon="pi pi-check"
            class="p-button-text"
            @click="guardarAlimento"
          />
        </template>
      </Dialog>
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

// Función para cerrar el diálogo
function cerrarDialog() {
  dialog.value = false
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
  confirm.require({
    message: `¿Estás seguro de que deseas eliminar el alimento "${item.nombre}"?`,
    header: 'Confirmar Eliminación',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    rejectProps: { label: 'Cancelar' },
    acceptProps: { label: 'Eliminar' },

    // Acción al aceptar (MODIFICADA)
    accept: async () => {
      // <-- Convertida a 'async'
      try {
        // 1. Eliminar de la base de datos
        await db.alimentos.delete(item.id) // <-- NUEVO

        // 2. Actualizar el array local (tu lógica original)
        alimentosRaw.value = alimentosRaw.value.filter((a) => a.id !== item.id)

        toast.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: `El alimento "${item.nombre}" ha sido eliminado.`,
          life: 3000,
        })
      } catch (error) {
        // <-- NUEVO (Manejo de errores)
        console.error('Error al eliminar:', error)
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el alimento de la base de datos.',
          life: 3000,
        })
      }
    },
    reject: () => {
      console.log('Eliminación cancelada.')
    },
  })
}

//Función para guardar el alimento (MODIFICADA)
async function guardarAlimento() {
  submitted.value = true
  const isValid = await v$.value.$validate()

  if (!isValid) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Por favor, corrige los errores en el formulario.',
      life: 3000,
    })
    return
  }

  // Si es válido, proceder a guardar
  try {
    // <-- NUEVO (Manejo de errores)
    if (alimento.id) {
      // --- Lógica de ACTUALIZAR ---

      // 1. Crear una copia de los datos (sin reactividad)
      const datosActualizados = { ...alimento } // <-- NUEVO

      // 2. Actualizar en la base de datos
      await db.alimentos.update(alimento.id, datosActualizados) // <-- NUEVO

      // 3. Actualizar el array local (tu lógica original)
      const index = alimentosRaw.value.findIndex((a) => a.id === alimento.id)
      if (index !== -1) {
        alimentosRaw.value[index] = datosActualizados // <-- Usamos la copia
      }

      toast.add({
        severity: 'success',
        summary: 'Actualizado',
        detail: `El alimento "${alimento.nombre}" ha sido actualizado.`,
        life: 3000,
      })
    } else {
      // --- Lógica de CREAR ---

      // 1. Preparar el nuevo objeto (sin el id nulo)
      const nuevoAlimento = { ...alimento } // <-- NUEVO
      delete nuevoAlimento.id // <-- NUEVO (Dejamos que Dexie genere el ID)

      // 2. Agregar a la base de datos (Dexie devuelve el nuevo ID)
      const nuevoId = await db.alimentos.add(nuevoAlimento) // <-- NUEVO

      // 3. Agregar al array local (con el ID devuelto por la BBDD)
      alimentosRaw.value.push({ ...nuevoAlimento, id: nuevoId }) // <-- MODIFICADO

      toast.add({
        severity: 'success',
        summary: 'Agregado',
        detail: `El alimento "${alimento.nombre}" ha sido agregado.`,
        life: 3000,
      })
    }

    // Cerrar el diálogo (solo si todo salió bien)
    dialog.value = false
  } catch (error) {
    // <-- NUEVO (Manejo de errores)
    console.error('Error al guardar:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo guardar el alimento en la base de datos.',
      life: 3000,
    })
  }
}

const formatPrice = (value) => {
  if (value == null) return ''
  return value.toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
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
