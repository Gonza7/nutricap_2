<template>
  <div class="min-h-screen p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
    <Card class="md:col-start-1 md:row-start-1">
      <template #title>Datos del animal</template>
      <template #content>
        <div class="flex flex-col gap-6 overflow-y-auto">

          <Fieldset legend="Datos básicos">
            <div class="grid grid-cols-1 2xl:grid-cols-3 gap-4 pt-2">

              <div class="flex flex-col gap-2 min-w-0">
                <FloatLabel variant="on">
                  <InputNumber id="pVivo" v-model="form.pVivo" class="w-full" :minFractionDigits="0"
                    :maxFractionDigits="2" />
                  <label for="pVivo">Peso vivo (kg)</label>
                </FloatLabel>
                <span v-if="v$.pVivo.$invalid && submitted">
                  <small class="text-red-500 block mb-1" v-for="error of v$.pVivo.$errors" :key="error.$uid">
                    {{ error.$message }}
                  </small>
                </span>
              </div>

              <div class="flex flex-col gap-2 min-w-0">
                <FloatLabel variant="on">
                  <InputNumber id="gButirosa" v-model="form.gButirosa" class="w-full" :minFractionDigits="0"
                    :maxFractionDigits="2" />
                  <label for="gButirosa">Grasa butirosa (%)</label>
                </FloatLabel>
                <span v-if="v$.gButirosa.$invalid && submitted">
                  <small class="text-red-500 block mb-1" v-for="error of v$.gButirosa.$errors" :key="error.$uid">
                    {{ error.$message }}
                  </small>
                </span>
              </div>

              <div class="flex flex-col gap-2 min-w-0">
                <FloatLabel variant="on">
                  <InputNumber id="ltDiarios" v-model="form.ltDiarios" class="w-full" :minFractionDigits="0"
                    :maxFractionDigits="2" />
                  <label for="ltDiarios">Litros de leche (diarios)</label>
                </FloatLabel>
                <span v-if="v$.ltDiarios.$invalid && submitted">
                  <small class="text-red-500 block mb-1" v-for="error of v$.ltDiarios.$errors" :key="error.$uid">
                    {{ error.$message }}
                  </small>
                </span>
              </div>
            </div>
          </Fieldset>

          <Fieldset legend="Datos de actividad y reproducción">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">

              <div class="flex flex-col gap-2">
                <FloatLabel variant="on">
                  <InputNumber id="actVoluntaria" v-model="form.actVoluntaria" class="w-full" :minFractionDigits="0"
                    :maxFractionDigits="2" />
                  <label for="actVoluntaria">Actividad voluntaria</label>
                </FloatLabel>
                <span v-if="v$.actVoluntaria.$invalid && submitted">
                  <small class="text-red-500 block mb-1" v-for="error of v$.actVoluntaria.$errors" :key="error.$uid">
                    {{ error.$message }}
                  </small>
                </span>
              </div>

              <div class="flex flex-col gap-2">
                <FloatLabel variant="on">
                  <InputNumber id="actReproductiva" v-model="form.actReproductiva" class="w-full" :minFractionDigits="0"
                    :maxFractionDigits="2" />
                  <label for="actReproductiva">Actividad reproductiva</label>
                </FloatLabel>
                <span v-if="v$.actReproductiva.$invalid && submitted">
                  <small class="text-red-500 block mb-1" v-for="error of v$.actReproductiva.$errors" :key="error.$uid">
                    {{ error.$message }}
                  </small>
                </span>
              </div>
            </div>
          </Fieldset>

          <Fieldset legend="Datos de movilización">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">

              <div class="flex flex-col gap-2">
                <FloatLabel variant="on">
                  <InputNumber id="gdpv" v-model="form.gdpv" class="w-full" :minFractionDigits="0"
                    :maxFractionDigits="2" />
                  <label for="gdpv">Ganancia diaria peso vivo (GDPV)</label>
                </FloatLabel>
                <span v-if="v$.gdpv.$invalid && submitted">
                  <small class="text-red-500 block mb-1" v-for="error of v$.gdpv.$errors" :key="error.$uid">
                    {{ error.$message }}
                  </small>
                </span>
              </div>

              <div class="flex flex-col gap-2">
                <FloatLabel variant="on">
                  <InputNumber id="pdpv" v-model="form.pdpv" class="w-full" :minFractionDigits="0"
                    :maxFractionDigits="2" />
                  <label for="pdpv">Pérdida diaria peso vivo (PDPV)</label>
                </FloatLabel>
                <span v-if="v$.pdpv.$invalid && submitted">
                  <small class="text-red-500 block mb-1" v-for="error of v$.pdpv.$errors" :key="error.$uid">
                    {{ error.$message }}
                  </small>
                </span>
              </div>
            </div>
          </Fieldset>

          <Fieldset legend="Datos de gestación">
            <div class="grid grid-cols-1 2xl:grid-cols-3 gap-4">

              <div class="flex flex-col gap-2">
                <FloatLabel variant="on">
                  <InputNumber id="penc" v-model="form.penc" class="w-full" :minFractionDigits="0"
                    :maxFractionDigits="2" />
                  <label for="penc">Peso nacimiento cría (Kg)</label>
                </FloatLabel>
                <span v-if="v$.penc.$invalid && submitted">
                  <small class="text-red-500 block mb-1" v-for="error of v$.penc.$errors" :key="error.$uid">
                    {{ error.$message }}
                  </small>
                </span>
              </div>

              <div class="flex flex-col gap-2">
                <FloatLabel variant="on">
                  <InputNumber id="nc" v-model="form.nc" class="w-full" :minFractionDigits="0" :maxFractionDigits="2" />
                  <label for="nc">Número de crías</label>
                </FloatLabel>
                <span v-if="v$.nc.$invalid && submitted">
                  <small class="text-red-500 block mb-1" v-for="error of v$.nc.$errors" :key="error.$uid">
                    {{ error.$message }}
                  </small>
                </span>
              </div>

              <div class="flex flex-col gap-2">
                <FloatLabel variant="on">
                  <InputNumber id="dGestacion" v-model="form.dGestacion" class="w-full" :minFractionDigits="0"
                    :maxFractionDigits="2" />
                  <label for="dGestacion">Días de gestación</label>
                </FloatLabel>
                <span v-if="v$.dGestacion.$invalid && submitted">
                  <small class="text-red-500 block mb-1" v-for="error of v$.dGestacion.$errors" :key="error.$uid">
                    {{ error.$message }}
                  </small>
                </span>
              </div>
            </div>
          </Fieldset>

        </div>
      </template>
    </Card>
    <Card class="md:col-start-1 md:row-start-2">
      <template #title>Datos de la alimentación</template>
      <template #content>
        <div class="flex flex-col gap-6 overflow-y-auto">

          <Fieldset legend=" Añadir Alimento">
            <div class="flex flex-wrap flex-col md:flex-row gap-4 md:items-end">

              <div class="flex-1 flex flex-col gap-2 min-w-48">
                <FloatLabel variant="on">
                  <AutoComplete v-model="alimentoSeleccionado" :suggestions="alimentosSugeridos"
                    @complete="buscarAlimento" field="nombre" dropdown id="alimento" class="w-full"
                    placeholder="Escriba para buscar..." forceSelection optionLabel="nombre">
                    <template #option="slotProps">
                      <div class="flex flex-col">
                        <span class="font-bold">{{ slotProps.option.nombre }}</span>

                        <div class="flex flex-row flex-wrap gap-x-3 text-sm text-gray-600">
                          <span>
                            {{ slotProps.option.grupo }}
                          </span>
                          <span v-if="slotProps.option.momento">
                            - {{ slotProps.option.momento }}
                          </span>
                          <span v-if="slotProps.option.formaFisica">
                            - {{ slotProps.option.formaFisica }}
                          </span>
                        </div>
                      </div>
                    </template>
                  </AutoComplete>
                  <label for="alimento">Alimento</label>
                </FloatLabel>
              </div>

              <div class="shrink-0 flex flex-col gap-2">
                <FloatLabel variant="on">
                  <InputNumber v-model="mtcSeleccionado" id="mtc" :minFractionDigits="0" :maxFractionDigits="2" />
                  <label for="mtc">MTC (kg)</label>
                </FloatLabel>
              </div>

              <Button @click="agregarAlimento" icon="pi pi-plus" label="Añadir" class="md:w-auto w-full" />
            </div>
          </Fieldset>

          <DataTable :value="form.alimentos" editMode="row" v-model:editing-rows="editingRows"
            @row-edit-save="onRowEditSave" responsiveLayout="scroll" size="small" dataKey="alimento.id">

            <template #header>
              Ración de Alimentos
            </template>

            <Column field="alimento.nombre" header="Alimento" :sortable="true" style="min-width: 150px;"></Column>

            <Column field="mtc" header="MTC (kg)" :sortable="true" style="width: 10rem">
              <template #editor="{ data, field }">
                <InputNumber v-model="data[field]" mode="decimal" :minFractionDigits="2" autofocus class="w-full" />
              </template>
            </Column>

            <Column field="alimento.ms" header="MS %" style="width: 8rem"></Column>
            <Column field="alimento.pb" header="PB %" style="width: 8rem"></Column>
            <Column field="alimento.em" header="EM" style="width: 8rem"></Column>
            <Column field="alimento.calcio" header="Ca %" style="width: 8rem"></Column>
            <Column field="alimento.fosforo" header="P %" style="width: 8rem"></Column>
            <Column field="alimento.fdn" header="FDN %" style="width: 8rem"></Column>
            <Column field="alimento.precio" header="Precio" style="width: 8rem"></Column>


            <Column :rowEditor="true" header="Editar" style="width: 7rem" bodyStyle="text-align:center"></Column>
            <Column header="Eliminar" style="width: 7rem" bodyStyle="text-align:center">
              <template #body="slotProps">
                <Button icon="pi pi-trash" severity="danger" text rounded @click="confirmarEliminar(slotProps.data)" />
              </template>
            </Column>

            <ColumnGroup type="footer">
              <Row>
                <Column footer="TOTALES" :colspan="1" />
                <Column :footer="resultados.sumaMtc ? round2(resultados.sumaMtc) : '0.00'" />
                <Column :footer="resultados.sumaMs ? round2(resultados.sumaMs) : '0.00'" footerHeader="MS Total (kg)" />
                <Column :footer="resultados.sumaPb ? round2(resultados.sumaPb) : '0.00'" footerHeader="PB Total (g)" />
                <Column :footer="resultados.sumaEm ? round2(resultados.sumaEm) : '0.00'" footerHeader="EM Total" />
                <Column :footer="resultados.sumaCa ? round2(resultados.sumaCa) : '0.00'" footerHeader="Ca Total (g)" />
                <Column :footer="resultados.sumaP ? round2(resultados.sumaP) : '0.00'" footerHeader="P Total (g)" />
                <Column :footer="resultados.sumaFdn ? round2(resultados.sumaFdn) : '0.00'" footerHeader="FDN Total %" />
                <Column :footer="resultados.sumaCosto ? round2(resultados.sumaCosto) : '0.00'"
                  footerHeader="Costo Total" />
                <Column :colspan="2" />
              </Row>
            </ColumnGroup>

            <template #empty>
              Aún no se han añadido alimentos a la ración.
            </template>

          </DataTable>

        </div>
      </template>
    </Card>
    <div class="flex flex-col gap-4 md:col-start-2 md:row-start-1 md:row-span-2 min-h-0">
      <Card class="h-fit shrink-0">
        <template #title>Calcular Resultados</template>
        <template #content>
          <div class="flex flex-col gap-6">

            <div class="border-t pt-4">
              <Button @click="calcular" label="Calcular" icon="pi pi-calculator" class="w-full p-button-lg" />
            </div>

          </div>
        </template>
      </Card>
      <Card class="flex-1 min-h-0">
        <template #title>Resultados del Cálculo</template>
        <template #content>
          <div class="flex flex-col gap-6 h-full overflow-y-auto">

            <Fieldset legend="Balances" :toggleable="false">
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">

                <FloatLabel variant="on">
                  <InputText id="res-bal-pb" :modelValue="mostrarValor(resultados.balancePb)"
                    :style="getBalanceStyle(resultados.balancePb)" class="w-full font-bold" readonly />
                  <label for="res-bal-pb">Balance PB (g)</label>
                </FloatLabel>

                <FloatLabel variant="on">
                  <InputText id="res-bal-em" :modelValue="mostrarValor(resultados.balanceEm)"
                    :style="getBalanceStyle(resultados.balanceEm)" class="w-full font-bold" readonly />
                  <label for="res-bal-em">Balance EM (Mcal)</label>
                </FloatLabel>

                <FloatLabel variant="on">
                  <InputText id="res-bal-ca" :modelValue="mostrarValor(resultados.balanceCa)"
                    :style="getBalanceStyle(resultados.balanceCa)" class="w-full font-bold" readonly />
                  <label for="res-bal-ca">Balance Calcio (g)</label>
                </FloatLabel>

                <FloatLabel variant="on">
                  <InputText id="res-bal-p" :modelValue="mostrarValor(resultados.balanceP)"
                    :style="getBalanceStyle(resultados.balanceP)" class="w-full font-bold" readonly />
                  <label for="res-bal-p">Balance Fósforo (g)</label>
                </FloatLabel>

                <FloatLabel variant="on">
                  <InputText id="res-bal-fdn" :modelValue="mostrarValor(resultados.balanceFdn)"
                    :style="getBalanceStyle(resultados.balanceFdn)" class="w-full font-bold" readonly />
                  <label for="res-bal-fdn">Balance FDN (% MS)</label>
                </FloatLabel>

              </div>
            </Fieldset>

            <Fieldset legend="Aportes de la Ración">
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                <FloatLabel variant="on">
                  <InputText id="res-ap-mtc" :modelValue="mostrarValor(resultados.sumaMtc)" class="w-full" readonly />
                  <label for="res-ap-mtc">MTC Total (kg)</label>
                </FloatLabel>
                <FloatLabel variant="on">
                  <InputText id="res-ap-ms" :modelValue="mostrarValor(resultados.sumaMs)" class="w-full" readonly />
                  <label for="res-ap-ms">MS Total (kg)</label>
                </FloatLabel>
                <FloatLabel variant="on">
                  <InputText id="res-ap-pb" :modelValue="mostrarValor(resultados.sumaPb)" class="w-full" readonly />
                  <label for="res-ap-pb">PB Total (g)</label>
                </FloatLabel>
                <FloatLabel variant="on">
                  <InputText id="res-ap-em" :modelValue="mostrarValor(resultados.sumaEm)" class="w-full" readonly />
                  <label for="res-ap-em">EM Total (Mcal)</label>
                </FloatLabel>
                <FloatLabel variant="on">
                  <InputText id="res-ap-ca" :modelValue="mostrarValor(resultados.sumaCa)" class="w-full" readonly />
                  <label for="res-ap-ca">Ca Total (g)</label>
                </FloatLabel>
                <FloatLabel variant="on">
                  <InputText id="res-ap-p" :modelValue="mostrarValor(resultados.sumaP)" class="w-full" readonly />
                  <label for="res-ap-p">P Total (g)</label>
                </FloatLabel>
                <FloatLabel variant="on">
                  <InputText id="res-ap-fdn" :modelValue="mostrarValor(resultados.sumaFdn)" class="w-full" readonly />
                  <label for="res-ap-fdn">FDN Total (% MS)</label>
                </FloatLabel>
                <FloatLabel variant="on">
                  <InputText id="res-ap-cap" :modelValue="mostrarValor(resultados.caP)" class="w-full" readonly />
                  <label for="res-ap-cap">Relación Ca:P</label>
                </FloatLabel>
                <FloatLabel variant="on">
                  <InputText id="res-ap-costo" :modelValue="mostrarValor(resultados.sumaCosto)" class="w-full"
                    readonly />
                  <label for="res-ap-costo">Costo Total ($)</label>
                </FloatLabel>
              </div>
            </Fieldset>

            <Fieldset legend="Requerimientos Lactancia">
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                <FloatLabel variant="on">
                  <InputText id="res-req-pb" :modelValue="mostrarValor(resultados.totalPB)" class="w-full" readonly />
                  <label for="res-req-pb">PB Total (g)</label>
                </FloatLabel>
                <FloatLabel variant="on">
                  <InputText id="res-req-em" :modelValue="mostrarValor(resultados.emTotal)" class="w-full" readonly />
                  <label for="res-req-em">EM Total (Mcal)</label>
                </FloatLabel>
                <FloatLabel variant="on">
                  <InputText id="res-req-em-aj" :modelValue="mostrarValor(resultados.emAjustado)" class="w-full"
                    readonly />
                  <label for="res-req-em-aj">EM Ajustado (Mcal)</label>
                </FloatLabel>
                <FloatLabel variant="on">
                  <InputText id="res-req-em-mov" :modelValue="mostrarValor(resultados.emMov)" class="w-full" readonly />
                  <label for="res-req-em-mov">EM Movilización</label>
                </FloatLabel>
                <FloatLabel variant="on">
                  <InputText id="res-req-em-rec" :modelValue="mostrarValor(resultados.emRec)" class="w-full" readonly />
                  <label for="res-req-em-rec">EM Recuperación</label>
                </FloatLabel>
                <FloatLabel variant="on">
                  <InputText id="res-req-ca" :modelValue="mostrarValor(resultados.ca)" class="w-full" readonly />
                  <label for="res-req-ca">Calcio (g/d)</label>
                </FloatLabel>
                <FloatLabel variant="on">
                  <InputText id="res-req-p" :modelValue="mostrarValor(resultados.p)" class="w-full" readonly />
                  <label for="res-req-p">Fósforo (g/d)</label>
                </FloatLabel>
                <FloatLabel variant="on">
                  <InputText id="res-req-fdn" :modelValue="mostrarValor(resultados.fdnTotal)" class="w-full" readonly />
                  <label for="res-req-fdn">FDN total (% MS)</label>
                </FloatLabel>
                <FloatLabel variant="on">
                  <InputText id="res-req-ctms" :modelValue="mostrarValor(resultados.ctmsPv)" class="w-full" readonly />
                  <label for="res-req-ctms">CTMS / PV (%)</label>
                </FloatLabel>
                <FloatLabel variant="on">
                  <InputText id="res-req-ctms-i" :modelValue="mostrarValor(resultados.ctmsPvInicio)" class="w-full"
                    readonly />
                  <label for="res-req-ctms-i">CTMS / PV (Inicio)</label>
                </FloatLabel>
                <FloatLabel variant="on">
                  <InputText id="res-req-ctms-m" :modelValue="mostrarValor(resultados.ctmsPvMitad)" class="w-full"
                    readonly />
                  <label for="res-req-ctms-m">CTMS / PV (Mitad)</label>
                </FloatLabel>
              </div>
            </Fieldset>

            <Fieldset legend="Requerimientos Último Tercio Gestación">
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                <FloatLabel variant="on">
                  <InputText id="res-utg-pb" :modelValue="mostrarValor(resultados.utgPB)" class="w-full" readonly />
                  <label for="res-utg-pb">UTG PB (g)</label>
                </FloatLabel>
                <FloatLabel variant="on">
                  <InputText id="res-utg-em" :modelValue="mostrarValor(resultados.utgEM)" class="w-full" readonly />
                  <label for="res-utg-em">UTG EM (Mcal)</label>
                </FloatLabel>
                <FloatLabel variant="on">
                  <InputText id="res-utg-ctms" :modelValue="mostrarValor(resultados.ctmsPvUTG)" class="w-full"
                    readonly />
                  <label for="res-utg-ctms">UTG CTMS / PV (%)</label>
                </FloatLabel>
              </div>
            </Fieldset>

          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { db } from '@/db';
import { useToast } from 'primevue/usetoast'
import { useVuelidate } from '@vuelidate/core'
import { required, numeric, minValue, helpers } from '@vuelidate/validators'
import { useConfirm } from 'primevue/useconfirm'

const { withMessage } = helpers

const submitted = ref(false)
const toast = useToast()
const confirm = useConfirm()

const alimentosDB = ref([]);
const form = reactive({
  pVivo: 0,
  gButirosa: 0,
  ltDiarios: 0,
  actVoluntaria: 0,
  actReproductiva: 0,
  pdpv: 0,
  gdpv: 0,
  penc: 0,
  nc: 0,
  dGestacion: 0,
  alimentos: []
});
const rules = reactive({
  pVivo: { required: helpers.withMessage('El peso vivo es obligatorio', required), numeric: helpers.withMessage('El peso vivo debe ser un numero', numeric), minValue: withMessage('El peso vivo debe ser mayor o igual a 0', minValue(0)) },
  gButirosa: { required: helpers.withMessage('La grasa butirosa es obligatoria', required), numeric: helpers.withMessage('La grasa butirosa debe ser un numero', numeric), minValue: withMessage('La grasa butirosa debe ser mayor o igual a 0', minValue(0)) },
  ltDiarios: { required: helpers.withMessage('Los litros diarios son obligatorios', required), numeric: helpers.withMessage('Los litros diarios deben ser un numero', numeric), minValue: withMessage('Los litros diarios deben ser mayor o igual a 0', minValue(0)) },
  actVoluntaria: { required: helpers.withMessage('La actividad voluntaria es obligatoria', required), numeric: helpers.withMessage('La actividad voluntaria debe ser un numero', numeric), minValue: withMessage('La actividad voluntaria debe ser mayor o igual a 0', minValue(0)) },
  actReproductiva: { required: helpers.withMessage('La actividad reproductiva es obligatoria', required), numeric: helpers.withMessage('La actividad reproductiva debe ser un numero', numeric), minValue: withMessage('La actividad reproductiva debe ser mayor o igual a 0', minValue(0)) },
  pdpv: { required: helpers.withMessage('La pérdida diaria de peso vivo es obligatoria', required), numeric: helpers.withMessage('La pérdida diaria de peso vivo debe ser un numero', numeric), minValue: withMessage('La pérdida diaria de peso vivo debe ser mayor o igual a 0', minValue(0)) },
  gdpv: { required: helpers.withMessage('La ganancia diaria de peso vivo es obligatoria', required), numeric: helpers.withMessage('La ganancia diaria de peso vivo debe ser un numero', numeric), minValue: withMessage('La ganancia diaria de peso vivo debe ser mayor o igual a 0', minValue(0)) },
  penc: { required: helpers.withMessage('El peso de nacimiento de la cría es obligatorio', required), numeric: helpers.withMessage('El peso de nacimiento de la cría debe ser un numero', numeric), minValue: withMessage('El peso de nacimiento de la cría debe ser mayor o igual a 0', minValue(0)) },
  nc: { required: helpers.withMessage('El número de crías es obligatorio', required), numeric: helpers.withMessage('El número de crías debe ser un numero', numeric), minValue: withMessage('El número de crías debe ser mayor o igual a 0', minValue(0)) },
  dGestacion: { required: helpers.withMessage('Los días de gestación son obligatorios', required), numeric: helpers.withMessage('Los días de gestación deben ser un numero', numeric), minValue: withMessage('Los días de gestación deben ser mayor o igual a 0', minValue(0)) },
});
const v$ = useVuelidate(rules, form)

// --- ESTADOS de SALIDA (CORREGIDO) ---

// PASO 1: Define el estado inicial como un objeto constante
const initialStateResultados = {
  totalPB: null,
  emTotal: null,
  emAjustado: null,
  emMov: null,
  emRec: null,
  ca: null,
  p: null,
  lipidos: 6,
  fdnTotal: 40,
  fdnEfectiva: 25,
  utgPB: null,
  utgEM: null,
  ctmsPv: null,
  sumaMtc: null,
  sumaMs: null,
  sumaPb: null,
  sumaEm: null,
  sumaCa: null,
  sumaP: null,
  sumaFdn: null,
  sumaEe: null,
  sumaCosto: null,
  balancePb: null,
  balanceEm: null,
  balanceCa: null,
  balanceP: null,
  caP: null,
  ctmsPvInicio: null,
  ctmsPvMitad: null,
  ctmsPvUTG: null,
  balanceFdn: null,
};

// PASO 2: Crea tu 'resultados' reactivo usando una copia de ese estado inicial
const resultados = reactive({ ...initialStateResultados });

// --- (Refs para el formulario de alimentos) ---
const alimentoSeleccionado = ref(null);
const mtcSeleccionado = ref(null);
const alimentosSugeridos = ref([]);
const editingRows = ref([]);

// --- FUNCIONES ---

const buscarAlimento = (event) => {
  if (!event.query.trim().length) {
    alimentosSugeridos.value = [...alimentosDB.value];
  } else {
    alimentosSugeridos.value = alimentosDB.value.filter((alimento) => {
      return alimento.nombre.toLowerCase().includes(event.query.toLowerCase());
    });
  }
}

const agregarAlimento = () => {
  // ... (tus validaciones están bien) ...
  if (!alimentoSeleccionado.value || typeof alimentoSeleccionado.value !== 'object') {
    toast.add({ severity: 'warn', summary: 'Error', detail: 'Debe seleccionar un alimento válido de la lista', life: 3000 });
    return;
  }
  if (!mtcSeleccionado.value || mtcSeleccionado.value <= 0) {
    toast.add({ severity: 'warn', summary: 'Error', detail: 'Debe ingresar una cantidad (MTC) positiva', life: 3000 });
    return;
  }
  const existe = form.alimentos.find(item => item.alimento.id === alimentoSeleccionado.value.id);
  if (existe) {
    toast.add({ severity: 'error', summary: 'Duplicado', detail: 'Ese alimento ya está en la ración. Puede editar la cantidad MTC directamente en la tabla.', life: 4000 });
    return;
  }

  form.alimentos.push({
    alimento: alimentoSeleccionado.value,
    mtc: mtcSeleccionado.value
  });

  alimentoSeleccionado.value = null;
  mtcSeleccionado.value = null;

  // CORRECCIÓN 2: Llamar a resetResultados() aquí también
  resetResultados();
}

const onRowEditSave = () => {
  // Esto es correcto
  resetResultados();
}

const confirmarEliminar = (alimentoData) => {
  confirm.require({
    message: `¿Está seguro de que desea eliminar "${alimentoData.alimento.nombre}" de la ración?`,
    header: 'Confirmar eliminación',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Eliminar',
    rejectLabel: 'Cancelar',
    acceptClass: 'p-button-danger',
    accept: () => {
      eliminarAlimento(alimentoData);
    }
  });
}

const eliminarAlimento = (alimentoData) => {
  const index = form.alimentos.findIndex(item => item.alimento.id === alimentoData.alimento.id);
  if (index > -1) {
    form.alimentos.splice(index, 1);

    // CORRECCIÓN 2: Llamar a resetResultados() aquí también
    resetResultados();
    // (Ya no necesitas el toast de "eliminado", resetResultados ya lo notifica)
  }
}

// CORRECCIÓN 1: 'resetResultados' AHORA FUNCIONA
function resetResultados() {
  Object.assign(resultados, initialStateResultados); // <-- Esto ahora funciona
  toast.add({ severity: 'warn', summary: 'Datos modificados', detail: 'Los resultados han sido reseteados. Presione "Calcular" para actualizar.', life: 4000 });
}

onMounted(async () => {
  alimentosDB.value = await db.alimentos.toArray();
});

function round2(value) {
  return Math.round(value * 100) / 100;
}

// ... (tu función 'calcular' está bien) ...
function calcular() {
  // ... (cálculos) ...
  const pbMant = 15.667 + (1.1315 * form.pVivo)
  const pbMantAjust = ((pbMant * form.actReproductiva) / 100) + pbMant
  const pbProd = form.ltDiarios * (36.905 + (8.9048 * form.gButirosa))
  const emMant = 0.4 + (0.0289 * form.pVivo)
  const emMantAjust = emMant + ((emMant * form.actVoluntaria) / 100) + ((emMant * form.actReproductiva) / 100)
  const emProd = (1.1192 + (0.0317 * form.gButirosa)) * form.ltDiarios
  resultados.sumaMtc = 0
  resultados.sumaMs = 0
  resultados.sumaPb = 0
  resultados.sumaEm = 0
  resultados.sumaCa = 0
  resultados.sumaP = 0
  resultados.sumaFdn = 0
  resultados.sumaCosto = 0
  form.alimentos.forEach(item => {
    if (item.alimento && item.mtc) {
      const ali = item.alimento
      const mtc = parseFloat(item.mtc)
      const ms = mtc * parseFloat((ali.ms + "").replace(",", "."))
      resultados.sumaMtc = (resultados.sumaMtc || 0) + mtc
      resultados.sumaMs = (resultados.sumaMs || 0) + ms
      resultados.sumaPb = (resultados.sumaPb || 0) + ((ms * parseFloat(ali.pb)) * 10)
      resultados.sumaEm = (resultados.sumaEm || 0) + (ms * parseFloat(ali.em))
      resultados.sumaCa = (resultados.sumaCa || 0) + ((ms * parseFloat(ali.calcio)) * 10)
      resultados.sumaP = (resultados.sumaP || 0) + ((ms * parseFloat(ali.fosforo)) * 10)
      resultados.sumaFdn = (resultados.sumaFdn || 0) + ((ms * parseFloat(ali.fdn)) / 100)
      resultados.sumaCosto = (resultados.sumaCosto || 0) + (ms * parseFloat(ali.precio))
    }
  })
  resultados.totalPB = round2(pbMantAjust + pbProd)
  resultados.emTotal = round2(emMantAjust + emProd)
  resultados.emMov = round2(9.98 * form.pdpv)
  resultados.emRec = round2(10.51 * form.gdpv)
  resultados.emAjustado = round2(resultados.emTotal - resultados.emMov + resultados.emRec)
  resultados.ca = round2(((0.623 * resultados.sumaMs) + 0.228) / 0.45 + (1.4 * form.ltDiarios) / 0.45)
  resultados.p = round2(((0.881 + (0.88 * resultados.sumaMs)) / 0.65) + (1 * form.ltDiarios) / 0.65)
  resultados.utgPB = round2(
    (((-155.62 - (8.6668 * form.penc) + (2.6495 * form.dGestacion) + (0.0041667 * form.nc) -
      (0.011049 * form.dGestacion * form.dGestacion)) +
      (0.097691 * form.penc * form.dGestacion) -
      (12.136 * form.penc * form.nc) +
      (0.14631 * form.penc * form.dGestacion * form.nc)) / 0.65) + pbMant
  )
  resultados.utgEM = round2(
    ((-15.467 - (1.1439 * form.penc) + (0.26316 * form.dGestacion) -
      (0.0021667 * form.nc) - (0.0010963 * form.dGestacion * form.dGestacion) +
      (0.011772 * form.penc * form.dGestacion) -
      (0.98352 * form.penc * form.nc) +
      (0.011735 * form.penc * form.dGestacion * form.nc)) * 0.239) + emMantAjust
  )
  resultados.ctmsPv = round2((resultados.sumaMs / form.pVivo) * 100)
  resultados.sumaMtc = round2(resultados.sumaMtc)
  resultados.sumaMs = round2(resultados.sumaMs)
  resultados.sumaPb = round2(resultados.sumaPb)
  resultados.sumaEm = round2(resultados.sumaEm)
  resultados.sumaCa = round2(resultados.sumaCa)
  resultados.sumaP = round2(resultados.sumaP)
  resultados.sumaCosto = round2(resultados.sumaCosto)
  resultados.sumaFdn = round2(resultados.sumaFdn / resultados.sumaMs * 100)
  resultados.balancePb = round2(resultados.sumaPb - resultados.totalPB)
  resultados.balanceEm = round2(resultados.sumaEm - resultados.emAjustado)
  resultados.balanceCa = round2(resultados.sumaCa - resultados.ca)
  resultados.balanceP = round2(resultados.sumaP - resultados.p)
  resultados.balanceFdn = round2(resultados.sumaFdn - resultados.fdnTotal)
  resultados.ctmsPvInicio = round2((((165 + (368.6 * form.ltDiarios) + (34.8 * form.pVivo ** 0.75)) / 1000) / form.pVivo) * 100)
  resultados.ctmsPvMitad = round2((((533 + (305.2 * form.ltDiarios) + (13.3 * form.pVivo)) / 1000) / form.pVivo) * 100)
  resultados.ctmsPvUTG = round2(2 + (0.25 * form.nc - 1))
  resultados.caP = round2(resultados.sumaCa / resultados.sumaP)
  console.log('Resultados del cálculo:', { ...resultados });
  toast.add({ severity: 'success', summary: 'Cálculo Exitoso', detail: 'Resultados actualizados', life: 3000 });
}

// ... (tus funciones 'mostrarValor' y 'getBalanceStyle' están bien) ...
const mostrarValor = (valor) => {
  if (valor === 0) return '0.00';
  if (valor === null || valor === undefined || !isFinite(valor) || isNaN(valor)) {
    return '-';
  }
  return (Math.round(valor * 100) / 100).toFixed(2);
};
const getBalanceStyle = (balance) => {
  const colorGris = '#6b7280';
  const colorVerde = '#16a34a';
  const colorRojo = '#dc2626';
  if (balance === 0 || balance === null || balance === undefined || !isFinite(balance) || isNaN(balance)) {
    return { color: colorGris };
  }
  if (balance > 0) {
    return { color: colorVerde };
  }
  if (balance < 0) {
    return { color: colorRojo };
  }
  return { color: colorGris };
};
</script>

<style scoped>
/* Pequeño ajuste para que los <Fieldset> de resultados
  no se vean tan pegados cuando están colapsados.
*/
:deep(.p-fieldset-toggleable .p-fieldset-legend) {
  cursor: pointer;
}
</style>
