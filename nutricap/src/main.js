// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './assets/style.css'
import { primeVueConfig } from './composables/primeVueConfig'

const app = createApp(App)

app.use(router) // Usa Vue Router
primeVueConfig(app) // Configura PrimeVue con el tema y componentes

app.mount('#app')
