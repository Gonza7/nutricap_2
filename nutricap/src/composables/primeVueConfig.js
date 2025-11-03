//Importaciones:
//PrimeVue
import PrimeVue from 'primevue/config'
//Temas y presets
import { definePreset, palette, updatePrimaryPalette } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'
//Estilos CSS de PrimeVue
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
//Componentes PrimeVue
import Button from 'primevue/button'
import Card from 'primevue/card'
import ToastService from 'primevue/toastservice'
import Toast from 'primevue/toast'
import Menubar from 'primevue/menubar'
import InputText from 'primevue/inputtext'
import Dialog from 'primevue/dialog'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import ColumnGroup from 'primevue/columngroup'
import Row from 'primevue/row'
import ConfirmDialog from 'primevue/confirmdialog'
import ConfirmationService from 'primevue/confirmationservice'
import InputNumber from 'primevue/inputnumber'
const MyPreset = definePreset(Aura, {})
const Noir = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{zinc.50}',
      100: '{zinc.100}',
      200: '{zinc.200}',
      300: '{zinc.300}',
      400: '{zinc.400}',
      500: '{zinc.500}',
      600: '{zinc.600}',
      700: '{zinc.700}',
      800: '{zinc.800}',
      900: '{zinc.900}',
      950: '{zinc.950}',
    },
    colorScheme: {
      light: {
        primary: {
          color: '{zinc.950}',
          inverseColor: '#ffffff',
          hoverColor: '{zinc.900}',
          activeColor: '{zinc.800}',
        },
        highlight: {
          background: '{zinc.950}',
          focusBackground: '{zinc.700}',
          color: '#ffffff',
          focusColor: '#ffffff',
        },
      },
      dark: {
        primary: {
          color: '{zinc.50}',
          inverseColor: '{zinc.950}',
          hoverColor: '{zinc.100}',
          activeColor: '{zinc.200}',
        },
        highlight: {
          background: 'rgba(250, 250, 250, .16)',
          focusBackground: 'rgba(250, 250, 250, .24)',
          color: 'rgba(255,255,255,.87)',
          focusColor: 'rgba(255,255,255,.87)',
        },
      },
    },
  },
})
export const primeVueConfig = (app) => {
  app.use(PrimeVue, {
    ripple: true,
    theme: {
      preset: Noir,
      options: {
        prefix: 'p',
        darkModeSelector: '.p-dark',
        cssLayer: false,
      },
    },
  })
  const customPalette = palette('{green}')

  updatePrimaryPalette(customPalette)

  app.component('Button', Button)
  app.component('Card', Card)
  app.component('Toast', Toast)
  app.component('Menubar', Menubar)
  app.component('InputText', InputText)
  app.component('InputNumber', InputNumber)
  app.component('Dialog', Dialog)
  app.component('DataTable', DataTable)
  app.component('Column', Column)
  app.component('ColumnGroup', ColumnGroup)
  app.component('Row', Row)
  app.component('ConfirmDialog', ConfirmDialog)
  app.use(ToastService)
  app.use(ConfirmationService)
}
