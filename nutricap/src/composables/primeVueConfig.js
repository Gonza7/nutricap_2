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

const MyPreset = definePreset(Aura, {
})

export const primeVueConfig = (app) => {
  app.use(PrimeVue, {
    ripple: true,
    theme: {
      preset: MyPreset,
      options: {
        prefix: 'p',
        darkModeSelector: '.p-dark',
        cssLayer: false,
      },
    },
  })
  const customPalette = palette('{pink}')
  updatePrimaryPalette(customPalette)
  app.use(ToastService)
  app.component('Button', Button)
  app.component('Card', Card)
  app.component('Toast', Toast)
  app.component('Menubar', Menubar)
  app.component('InputText', InputText)
}
