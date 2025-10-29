//Importaciones:
//PrimeVue
import PrimeVue from 'primevue/config'
//Temas y presets
import { definePreset } from '@primeuix/themes'
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

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{indigo.50}',
      100: '{indigo.100}',
      200: '{indigo.200}',
      300: '{indigo.300}',
      400: '{indigo.400}',
      500: '{indigo.500}',
      600: '{indigo.600}',
      700: '{indigo.700}',
      800: '{indigo.800}',
      900: '{indigo.900}',
      950: '{indigo.950}',
    },
  },
})

export const primeVueConfig = (app) => {
  app.use(PrimeVue, {
    ripple: true,
    theme: {
      preset: MyPreset,
      options: {
        prefix: 'p',
        darkModeSelector: 'system',
        cssLayer: false,
      },
    },
  })

  app.use(ToastService)
  app.component('Button', Button)
  app.component('Card', Card)
  app.component('Toast', Toast)
  app.component('Menubar', Menubar)
  app.component('InputText', InputText)
}
