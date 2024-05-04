<template>
  <section id="login" class="translate-y-32">
    <UCard :ui="{
      base: 'mx-auto max-w-[400px]'
    }">
      <template #header>
        <div class="flex justify-center">
          <LogoEdukar size="h-8" />
        </div>
      </template>
      <UForm ref="form" :validate="validate" :state="state" @submit="submitLogin" class="flex flex-col gap-4">
        <UFormGroup label="Username o email" name="username" required>
          <UInput v-model="state.username" placeholder="you@example.com" icon="i-heroicons-envelope" />
        </UFormGroup>
        <UFormGroup label="Contraseña" name="password" required>
          <UInput v-model="state.password" placeholder="************" type="password"
            icon="i-heroicons-lock-closed-20-solid" />
        </UFormGroup>
        <UButton type="submit" block :loading="status === 'pending'">Iniciar sesión</UButton>
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
import type { FormError, FormSubmitEvent, Form } from '#ui/types'
import type { userInfo } from '~/types'
import { userLoginSchema } from '~/schemas/auth';
import { z } from 'zod'

useHead({
  title: 'Iniciar Sesión'
})

definePageMeta({
  middleware: ['anonymous'],
})

type UserLogin = z.infer<typeof userLoginSchema>
const userStore = useUserStore()
const state = reactive<UserLogin>({
  username: '',
  password: ''
})

const form = ref<Form<any> | undefined>(undefined)
const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.username) errors.push({ path: 'username', message: 'Campo requerido' })
  if (!state.password) errors.push({ path: 'password', message: 'Campo requerido' })
  return errors
}

/* const { data, status, error, execute } = await useLazyFetch<userInfo>('/api/auth/login', {
  method: 'post',
  body: state,
  server: false,
  immediate: false,
  watch: false
}) */

const { data, status, error, execute } = await useAsyncData(
  'user',
  () => useApiFetch<userInfo>('/account/login', {
    method: 'post',
    body: state
  }),
  {
    server: false,
    lazy: true,
    immediate: false
  }
)

const submitLogin = async (event: FormSubmitEvent<UserLogin>) => {
  await execute()
  if (status.value === 'success') {
    userStore.setUser(data.value)
    navigateTo('/', { replace: true })
  } else {
    if (error.value?.statusCode === 400) {
      form.value?.setErrors([{ message: 'El nombre de usuario o contraseña son incorrectos.', path: 'password' }])
    }
  }
}
</script>
