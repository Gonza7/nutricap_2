// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'

// 1. Importa el motor de temas y el tema "Aura"
import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'

// 2. Importa los CSS de íconos y grillas
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

// 3. Importa nuestro CSS base (el que acabamos de editar)
import './assets/main.css'

// --- Importa componentes (opcional, pero recomendado) ---
// (Así no hay que importarlos en cada vista)
import Button from 'primevue/button'
import Card from 'primevue/card'
import ToastService from 'primevue/toastservice'
import Toast from 'primevue/toast'
import Menubar from 'primevue/menubar'
import InputText from 'primevue/inputtext'
const app = createApp(App)

app.use(router) // Usa Vue Router

// 4. Configura el tema
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

app.use(PrimeVue, {
  ripple: true,
  theme: {
    preset: MyPreset, // Usa el tema Aura
    options: {
      prefix: 'p',
      darkModeSelector: 'system',
      cssLayer: false,
    },
  },
})

app.use(ToastService) // Servicio para notificaciones

// 5. Registra los componentes globalmente
app.component('Button', Button)
app.component('Card', Card)
app.component('Toast', Toast)
app.component('Menubar', Menubar)
app.component('InputText', InputText)
app.mount('#app')
