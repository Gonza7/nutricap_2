<template>
  <div class="flex items-center justify-center min-h-screen bg-surface-50 dark:bg-surface-900 px-4">
    <Card class="w-full max-w-md shadow-lg">
      <template #title>
        <div class="text-center mb-4">
          <span class="text-2xl font-bold text-primary-600">Establecer Nueva Contraseña</span>
        </div>
      </template>
      
      <template #content>
        <form @submit.prevent="updatePassword" class="flex flex-col gap-6 mt-4">
          <div class="flex flex-col gap-2">
            <FloatLabel variant="on">
              <InputText 
                id="newPassword" 
                v-model="password" 
                type="password"
                class="w-full" 
                required
              />
              <label for="newPassword">Nueva Contraseña</label>
            </FloatLabel>
          </div>

          <Button type="submit" label="Guardar Contraseña" icon="pi pi-check" :loading="loading" class="w-full mt-2" />
        </form>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabase'
import { useToast } from 'primevue/usetoast'

const password = ref('')
const loading = ref(false)
const router = useRouter()
const toast = useToast()

const updatePassword = async () => {
  loading.value = true
  try {
    const { error } = await supabase.auth.updateUser({
      password: password.value
    })

    if (error) throw error

    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Contraseña actualizada correctamente', life: 3000 })
    router.push({ name: 'home' }) // Redirigir al home ya logueado

  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 })
  } finally {
    loading.value = false
  }
}
</script>