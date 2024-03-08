<template>
  <section id="login" class="flex mx-4">
    <UCard :ui="{
      base: 'mx-auto max-w-[400px]'
    }">
      <template #header>
        <div class="flex justify-center">
          <LogoEdukar size="h-8" />
        </div>
      </template>
      <UForm :validate="validate" :state="state" @submit="submitLogin" class="flex flex-col gap-4">
        <UFormGroup label="Username o email" name="username" required>
          <UInput v-model="state.username" placeholder="you@example.com" icon="i-heroicons-envelope" />
        </UFormGroup>
        <UFormGroup label="Contraseña" name="password" required>
          <UInput v-model="state.password" placeholder="************" type="password"
            icon="i-heroicons-lock-closed-20-solid" />
        </UFormGroup>
        <UButton type="submit" block :loading="isLoading">Iniciar sesión</UButton>
      </UForm>

      <template #footer>
        <p>¿Se ha olvidado su contraseña? <ULink to="/account/send-reset-password" class="text-primary underline">
            Recuperar contraseña</ULink>
        </p>
      </template>
    </UCard>
  </section>
</template>

<script lang="ts" setup>
import type { FormError, FormSubmitEvent } from '#ui/types'

const state = reactive({
  username: undefined,
  password: undefined
})

const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.username) errors.push({ path: 'username', message: 'Campo requerido' })
  if (!state.password) errors.push({ path: 'password', message: 'Campo requerido' })
  return errors
}

const isLoading = ref(false)
const submitLogin = async (event: FormSubmitEvent<any>) => {
  isLoading.value = true
  console.log(event.data)
  setTimeout(() => {
    isLoading.value = false
  }, 2000)
}
</script>