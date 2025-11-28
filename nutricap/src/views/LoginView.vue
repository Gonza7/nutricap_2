<template>
    <div class="flex items-center justify-center min-h-screen bg-surface-50 dark:bg-surface-900 px-4">
        <Card class="w-full max-w-md shadow-lg">
            <template #title>
                <div class="text-center mb-4">
                    <img src="@/assets/logo.png" alt="Nutricap Logo" class="h-16 w-auto mx-auto mb-2" />
                    <span class="text-2xl font-bold text-primary-600">Bienvenido</span>
                </div>
            </template>

            <template #content>
                <form @submit.prevent="handleLogin" class="flex flex-col gap-6 mt-4">

                    <div class="flex flex-col gap-2">
                        <FloatLabel variant="on">
                            <InputText id="username" v-model="v$.username.$model" class="w-full"
                                :class="{ 'p-invalid': v$.username.$invalid && submitted }" />
                            <label for="username">Usuario</label>
                        </FloatLabel>
                        <small v-if="v$.username.$invalid && submitted" class="text-red-500">
                            El usuario es requerido.
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

                    <Button type="submit" label="Iniciar Sesión" icon="pi pi-sign-in" :loading="loading"
                        class="w-full mt-2" />
                </form>
            </template>
        </Card>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

const router = useRouter()
const toast = useToast()

const loading = ref(false)
const submitted = ref(false)

const form = reactive({
    username: '',
    password: ''
})

const rules = {
    username: { required },
    password: { required }
}

const v$ = useVuelidate(rules, form)

const handleLogin = async () => {
    submitted.value = true
    const isValid = await v$.value.$validate()

    if (!isValid) return

    loading.value = true

    // Simulamos una petición al backend (espera de 1 segundo)
    setTimeout(() => {

        // AQUÍ IRÍA TU LÓGICA REAL DE AUTENTICACIÓN
        // Por ahora, aceptamos cualquier credencial válida
        if (form.username && form.password) {
            localStorage.setItem('isAuthenticated', 'true')
            toast.add({ severity: 'success', summary: 'Bienvenido', detail: 'Inicio de sesión exitoso', life: 3000 })

            // Redirigir al Home o Tambo
            router.push({ name: 'home' })
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Credenciales inválidas', life: 3000 })
        }

        loading.value = false
    }, 1000)
}
</script>