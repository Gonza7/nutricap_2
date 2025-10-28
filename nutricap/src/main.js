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

const app = createApp(App)

app.use(router) // Usa Vue Router

// 4. Configura el tema
const MyPreset = definePreset(Aura, {
  // Aquí no necesitamos sobreescribir nada por ahora
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

app.mount('#app')
