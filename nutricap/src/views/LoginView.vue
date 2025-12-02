<template>
  <div class="flex items-center justify-center min-h-screen px-4">
    <Card class="w-full max-w-md shadow-lg">
      <template #title>
        <div class="text-center mb-4">
          <img src="@/assets/logo.png" alt="Nutricap Logo" class="h-16 w-auto mx-auto mb-2" />
          <span class="text-2xl font-bold">Bienvenido</span>
        </div>
      </template>

      <template #content>
        <form @submit.prevent="handleLogin" class="flex flex-col gap-6 mt-4">

          <div class="flex flex-col gap-2">
            <FloatLabel variant="on">
              <InputText id="username" v-model="v$.username.$model" class="w-full"
                :class="{ 'p-invalid': v$.username.$invalid && submitted }" />
              <label for="username">Correo electrónico</label>
            </FloatLabel>
            <small v-if="v$.username.$invalid && submitted" class="text-red-500">
              El correo es requerido.
            </small>
          </div>

          <div class="flex flex-col gap-2">
            <FloatLabel variant="on">
              <InputText id="password" v-model="v$.password.$model" type="password" class="w-full"
                :class="{ 'p-invalid': v$.password.$invalid && submitted }" />
              <label for="password">Contraseña</label>
            </FloatLabel>
            <small v-if="v$.password.$invalid && submitted" class="text-red-500">
              La contraseña es requerida.
            </small>
          </div>

          <Button type="submit" label="Iniciar Sesión" icon="pi pi-sign-in" :loading="loading" class="w-full mt-2" />
          <div class="text-center mt-2">
            <Button label="¿Olvidaste tu contraseña?" link class="p-0 text-sm" @click="mostrarDialogoRecuperacion" />
          </div>
        </form>
      </template>
    </Card>
    <Dialog v-model:visible="dialogoRecuperacion" header="Recuperar Contraseña" :modal="true" class="w-full max-w-sm">
      <div class="flex flex-col gap-4">
        <p class="text-sm">
          Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
        </p>
        <div class="flex flex-col gap-2">
          <label for="emailReset">Correo electrónico</label>
          <InputText id="emailReset" v-model="emailRecuperacion" class="w-full" />
        </div>
        <Button label="Enviar Correo" icon="pi pi-send" :loading="cargandoRecuperacion"
          @click="enviarCorreoRecuperacion" />
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators' // Importamos email si quieres validar formato
import { supabase } from '@/supabase' // <--- Importamos nuestro cliente

const router = useRouter()
const toast = useToast()

const loading = ref(false)
const submitted = ref(false)

const form = reactive({
  username: '', // En Supabase esto será el email
  password: ''
})

const rules = {
  username: { required, email }, // Validamos que sea email
  password: { required }
}

const v$ = useVuelidate(rules, form)

const handleLogin = async () => {
  submitted.value = true
  const isValid = await v$.value.$validate()

  if (!isValid) return

  loading.value = true

  try {
    // --- AUTENTICACIÓN CON SUPABASE ---
    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.username,
      password: form.password
    })

    if (error) throw error

    if (data.session) {
      
      toast.add({ severity: 'success', summary: 'Bienvenido', detail: 'Inicio de sesión exitoso', life: 3000 })
      router.push({ name: 'home' })
    }

  } catch (error) {
    console.error(error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message === 'Invalid login credentials' ? 'Credenciales incorrectas' : 'Error al iniciar sesión',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}
// --- LÓGICA DE RECUPERACIÓN ---
const dialogoRecuperacion = ref(false)
const emailRecuperacion = ref('')
const cargandoRecuperacion = ref(false)

const mostrarDialogoRecuperacion = () => {
  emailRecuperacion.value = ''
  dialogoRecuperacion.value = true
}

const enviarCorreoRecuperacion = async () => {
  if (!emailRecuperacion.value) {
    toast.add({ severity: 'warn', summary: 'Atención', detail: 'Ingresa un correo', life: 3000 })
    return
  }

  cargandoRecuperacion.value = true
  try {
    // Esta función envía el mail mágico
    const { error } = await supabase.auth.resetPasswordForEmail(emailRecuperacion.value, {
      redirectTo: 'http://localhost:5173/update-password', // A dónde vuelve el usuario
    })

    if (error) throw error

    toast.add({ severity: 'success', summary: 'Correo enviado', detail: 'Revisa tu bandeja de entrada', life: 5000 })
    dialogoRecuperacion.value = false

  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 })
  } finally {
    cargandoRecuperacion.value = false
  }
}
</script>