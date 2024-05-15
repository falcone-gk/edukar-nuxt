<template>
  <UModal prevent-close v-model="isOpen">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <Typography tag="h1" color="info" variant="big">
            Invitación
          </Typography>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
            @click="isOpen = false" />
        </div>
      </template>

      <p>Por diversos motivos tuvimos que reniciar nuestros datos. Por ello, <span
          class="text-yellow-500 dark:text-yellow-400">te invitamos a
          registrarte nuevamente</span> a nuestra comunidad de estudiantes.</p>

      <template #footer>
        <div class="flex justify-end gap-2">
          <CustomButtonGradient label="Ir a registrarse" color="gray" to="/signup" />
        </div>
      </template>

    </UCard>
  </UModal>
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
        <p>¿Se ha olvidado su contraseña? <ULink to="/account/reset-password" class="text-primary underline">
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

useSeoMeta({
  title: 'Iniciar Sesión',
  description: 'Inicia sesión para acceder a los distintos recursos disponibles en nuestra página web.'
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

const { data, status, error, execute } = await useAsyncData(
  'user',
  () => useApiFetch<userInfo>('/account/login', {
    method: 'post',
    body: state
  }),
  {
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
      isOpen.value = true
    }
  }
}

const isOpen = ref(false)

</script>
