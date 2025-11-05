<template>
  <div class="min-h-screen p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
    <Card class="">
      <template #title>Datos del animal</template>
      <template #content>
        <div class="flex flex-col gap-6">

          <Fieldset legend="Datos básicos">
            <div class="grid grid-cols-1 2xl:grid-cols-3 gap-4 pt-2">

              <div class="flex flex-col gap-2">
                <FloatLabel variant="on">
                  <InputNumber id="pVivo" v-model="form.pVivo" class="w-full" />
                  <label for="pVivo">Peso vivo (kg)</label>
                </FloatLabel>
                <span v-if="v$.pVivo.$invalid && submitted">
                  <small class="text-red-500 block mb-1" v-for="error of v$.pVivo.$errors" :key="error.$uid">
                    {{ error.$message }}
                  </small>
                </span>
              </div>

              <div class="flex flex-col gap-2">
                <FloatLabel variant="on">
                  <InputNumber id="gButirosa" v-model="form.gButirosa" class="w-full" />
                  <label for="gButirosa">Grasa butirosa (%)</label>
                </FloatLabel>
                <span v-if="v$.gButirosa.$invalid && submitted">
                  <small class="text-red-500 block mb-1" v-for="error of v$.gButirosa.$errors" :key="error.$uid">
                    {{ error.$message }}
                  </small>
                </span>
              </div>

              <div class="flex flex-col gap-2">
                <FloatLabel variant="on">
                  <InputNumber id="ltDiarios" v-model="form.ltDiarios" class="w-full" />
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
                <label for="act-voluntaria">Actividad voluntaria</label>
                <InputNumber id="act-voluntaria" mode="decimal" placeholder="Ingresar valor" class="w-full" />
              </div>

              <div class="flex flex-col gap-2">
                <label for="act-reproductiva">Actividad reproductiva</label>
                <InputNumber id="act-reproductiva" mode="decimal" placeholder="Ingresar valor" class="w-full" />
              </div>
            </div>
          </Fieldset>

          <Fieldset legend="Datos de movilización">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">

              <div class="flex flex-col gap-2">
                <label for="ganancia-peso">Ganancia diaria (kg)</label>
                <InputNumber id="ganancia-peso" mode="decimal" :minFractionDigits="2" placeholder="Ej: 0.80"
                  class="w-full" />
              </div>

              <div class="flex flex-col gap-2">
                <label for="perdida-peso">Pérdida diaria (kg)</label>
                <InputNumber id="perdida-peso" mode="decimal" :minFractionDigits="2" placeholder="Ej: 0.10"
                  class="w-full" />
              </div>
            </div>
          </Fieldset>

          <Fieldset legend="Datos de gestación">
            <div class="grid grid-cols-1 2xl:grid-cols-3 gap-4">

              <div class="flex flex-col gap-2">
                <label for="peso-cria">Peso nacimiento cría (kg)</label>
                <InputNumber id="peso-cria" mode="decimal" :minFractionDigits="2" placeholder="Ej: 40.50"
                  class="w-full" />
              </div>

              <div class="flex flex-col gap-2">
                <label for="num-crias">Número de crías</label>
                <InputNumber id="num-crias" placeholder="Ej: 1" class="w-full" />
              </div>

              <div class="flex flex-col gap-2">
                <label for="dias-gestacion">Días de gestación</label>
                <InputNumber id="dias-gestacion" placeholder="Ej: 280" class="w-full" />
              </div>
            </div>
          </Fieldset>

        </div>
      </template>
    </Card>

    <Card class="md:col-start-2 md:row-start-1 md:row-span-2">
      <template #title>Datos de la alimentacion</template>
      <template #content>
        <p class="m-0">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam
          deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate
          neque
          quas!
        </p>
      </template>
    </Card>

    <Card class="">
      <template #title>Resultados</template>
      <template #content>
        <p class="m-0">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam
          deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate
          neque
          quas!
        </p>
      </template>
    </Card>

  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue';
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
});
const v$ = useVuelidate(rules, form)
// --- ESTADOS de SALIDA ---
const resultados = reactive({
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
});

// --- Carga inicial ---
onMounted(async () => {
  alimentosDB.value = await db.alimentos.toArray();
});

function round2(value) {
  return Math.round(value * 100) / 100;
}

function calcular() {
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
      console.log("MTC:", mtc, "MS(%):", ali.ms, "MS calculado:", mtc * (ali.ms / 100))
      console.log("ali.ms (crudo):", ali.ms, "typeof:", typeof ali.ms)

      resultados.sumaMtc = (resultados.sumaMtc || 0) + mtc
      resultados.sumaMs = (resultados.sumaMs || 0) + ms
      resultados.sumaPb = (resultados.sumaPb || 0) + ((ms * parseFloat(ali.pb)) * 10)
      resultados.sumaEm = (resultados.sumaEm || 0) + (ms * parseFloat(ali.em))
      resultados.sumaCa = (resultados.sumaCa || 0) + (ms * parseFloat(ali.calcio))
      resultados.sumaP = (resultados.sumaP || 0) + (ms * parseFloat(ali.fosforo))
      resultados.sumaFdn = (resultados.sumaFdn || 0) + ((ms * parseFloat(ali.fdn)) / 100)
      resultados.sumaCosto = (resultados.sumaCosto || 0) + (ms * parseFloat(ali.precio))
    }
  })

  // Resultados redondeados
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
}
</script>

<style scoped>
/* Pequeño ajuste para que los <Fieldset> de resultados 
  no se vean tan pegados cuando están colapsados.
*/
:deep(.p-fieldset-toggleable .p-fieldset-legend) {
  cursor: pointer;
}
</style>