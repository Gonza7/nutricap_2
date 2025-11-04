<template>
<h1>Tambo</h1>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue';
import { db } from '@/db';
import { useToast } from 'primevue/usetoast'
import { useVuelidate } from '@vuelidate/core'
import { required, numeric, minValue, helpers } from '@vuelidate/validators'
import { useConfirm } from 'primevue/useconfirm'

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
const errores = reactive({});

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
  const pbMant = 15.667 + (1.1315 * this.form.pVivo)
  const pbMantAjust = ((pbMant * this.form.actReproductiva) / 100) + pbMant
  const pbProd = this.form.ltDiarios * (36.905 + (8.9048 * this.form.gButirosa))

  const emMant = 0.4 + (0.0289 * this.form.pVivo)
  const emMantAjust = emMant + ((emMant * this.form.actVoluntaria) / 100) + ((emMant * this.form.actReproductiva) / 100)
  const emProd = (1.1192 + (0.0317 * this.form.gButirosa)) * this.form.ltDiarios
  this.resultados.sumaMtc = 0
  this.resultados.sumaMs = 0
  this.resultados.sumaPb = 0
  this.resultados.sumaEm = 0
  this.resultados.sumaCa = 0
  this.resultados.sumaP = 0
  this.resultados.sumaFdn = 0
  this.resultados.sumaCosto = 0


  this.form.alimentos.forEach(item => {
    if (item.alimento && item.mtc) {
      const ali = item.alimento
      const mtc = parseFloat(item.mtc)
      const ms = mtc * parseFloat((ali.ms + "").replace(",", "."))
      console.log("MTC:", mtc, "MS(%):", ali.ms, "MS calculado:", mtc * (ali.ms / 100))
      console.log("ali.ms (crudo):", ali.ms, "typeof:", typeof ali.ms)

      this.resultados.sumaMtc = (this.resultados.sumaMtc || 0) + mtc
      this.resultados.sumaMs = (this.resultados.sumaMs || 0) + ms
      this.resultados.sumaPb = (this.resultados.sumaPb || 0) + ((ms * parseFloat(ali.pb)) * 10)
      this.resultados.sumaEm = (this.resultados.sumaEm || 0) + (ms * parseFloat(ali.em))
      this.resultados.sumaCa = (this.resultados.sumaCa || 0) + (ms * parseFloat(ali.calcio))
      this.resultados.sumaP = (this.resultados.sumaP || 0) + (ms * parseFloat(ali.fosforo))
      this.resultados.sumaFdn = (this.resultados.sumaFdn || 0) + ((ms * parseFloat(ali.fdn)) / 100)
      this.resultados.sumaCosto = (this.resultados.sumaCosto || 0) + (ms * parseFloat(ali.precio))
    }
  })

  // Resultados redondeados
  this.resultados.totalPB = this.round2(pbMantAjust + pbProd)
  this.resultados.emTotal = this.round2(emMantAjust + emProd)
  this.resultados.emMov = this.round2(9.98 * this.form.pdpv)
  this.resultados.emRec = this.round2(10.51 * this.form.gdpv)
  this.resultados.emAjustado = this.round2(this.resultados.emTotal - this.resultados.emMov + this.resultados.emRec)
  this.resultados.ca = this.round2(((0.623 * this.resultados.sumaMs) + 0.228) / 0.45 + (1.4 * this.form.ltDiarios) / 0.45)
  this.resultados.p = this.round2(((0.881 + (0.88 * this.resultados.sumaMs)) / 0.65) + (1 * this.form.ltDiarios) / 0.65)
  this.resultados.utgPB = this.round2(
    (((-155.62 - (8.6668 * this.form.penc) + (2.6495 * this.form.dGestacion) + (0.0041667 * this.form.nc) -
      (0.011049 * this.form.dGestacion * this.form.dGestacion)) +
      (0.097691 * this.form.penc * this.form.dGestacion) -
      (12.136 * this.form.penc * this.form.nc) +
      (0.14631 * this.form.penc * this.form.dGestacion * this.form.nc)) / 0.65) + pbMant
  )
  this.resultados.utgEM = this.round2(
    ((-15.467 - (1.1439 * this.form.penc) + (0.26316 * this.form.dGestacion) -
      (0.0021667 * this.form.nc) - (0.0010963 * this.form.dGestacion * this.form.dGestacion) +
      (0.011772 * this.form.penc * this.form.dGestacion) -
      (0.98352 * this.form.penc * this.form.nc) +
      (0.011735 * this.form.penc * this.form.dGestacion * this.form.nc)) * 0.239) + emMantAjust
  )
  this.resultados.ctmsPv = this.round2((this.resultados.sumaMs / this.form.pVivo) * 100)
  this.resultados.sumaMtc = this.round2(this.resultados.sumaMtc)
  this.resultados.sumaMs = this.round2(this.resultados.sumaMs)
  this.resultados.sumaPb = this.round2(this.resultados.sumaPb)
  this.resultados.sumaEm = this.round2(this.resultados.sumaEm)
  this.resultados.sumaCa = this.round2(this.resultados.sumaCa)
  this.resultados.sumaP = this.round2(this.resultados.sumaP)
  this.resultados.sumaCosto = this.round2(this.resultados.sumaCosto)
  this.resultados.sumaFdn = this.round2(this.resultados.sumaFdn / this.resultados.sumaMs * 100)
  this.resultados.balancePb = this.round2(this.resultados.sumaPb - this.resultados.totalPB)
  this.resultados.balanceEm = this.round2(this.resultados.sumaEm - this.resultados.emAjustado)
  this.resultados.balanceCa = this.round2(this.resultados.sumaCa - this.resultados.ca)
  this.resultados.balanceP = this.round2(this.resultados.sumaP - this.resultados.p)
  this.resultados.balanceFdn = this.round2(this.resultados.sumaFdn - this.resultados.fdnTotal)
  this.resultados.ctmsPvInicio = this.round2((((165 + (368.6 * this.form.ltDiarios) + (34.8 * this.form.pVivo ** 0.75)) / 1000) / this.form.pVivo) * 100)
  this.resultados.ctmsPvMitad = this.round2((((533 + (305.2 * this.form.ltDiarios) + (13.3 * this.form.pVivo)) / 1000) / this.form.pVivo) * 100)
  this.resultados.ctmsPvUTG = this.round2(2 + (0.25 * this.form.nc - 1))
  this.resultados.caP = this.round2(this.resultados.sumaCa / this.resultados.sumaP)
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