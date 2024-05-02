<template>
  <section id="signup" class="flex mx-4">
    <UCard :ui="{
      base: 'mx-auto max-w-[700px]'
    }">
      <template #header>
        <div class="flex flex-col">
          <div class="flex justify-center">
            <LogoEdukar size="h-12" />
          </div>
          <div class="my-4">
            <span><b>Importante:</b></span>
            <p>No está permitido ningún tipo de publicidad en el foro, ni en las publicaciones ni en las imágenes de
              perfil. Si se observa algún tipo de publicidad se procederá a banear la cuenta.</p>
          </div>
          <div>
            <span><b>Nota:</b></span>
            <p>El nombre de usuario solo permite el uso de letras y números.</p>
          </div>
        </div>
      </template>
      <UForm id="form" ref="form" :schema="userRegisterSchema" :state="state" @submit="onSubmit">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <UFormGroup label="Nombre de usuario" name="username" required>
            <UInput v-model="state.username" />
          </UFormGroup>
          <UFormGroup label="Email" name="email" required>
            <UInput v-model="state.email" type="email" placeholder="you@example.com" icon="i-heroicons-envelope" />
          </UFormGroup>
          <UFormGroup label="Nombre(s)" name="first_name" required>
            <UInput v-model="state.first_name" />
          </UFormGroup>
          <UFormGroup label="Apellido(s)" name="last_name" required>
            <UInput v-model="state.last_name" />
          </UFormGroup>
          <UFormGroup label="Contraseña" name="password" required>
            <UInput v-model="state.password" type="password" />
          </UFormGroup>
          <UFormGroup label="Confirmar contraseña" name="re_password" required>
            <UInput v-model="state.re_password" type="password" />
          </UFormGroup>
        </div>
        <div class="flex flex-col gap-4 mt-4">
          <UFormGroup label="Sobre mí:" name="about_me">
            <UTextarea v-model="state.about_me" :rows="10" />
          </UFormGroup>
          <UFormGroup label="Imágen de perfil:" name="picture">
            <UInput ref="fileImg" type="file" accept="image/*" />
          </UFormGroup>
        </div>
        <UButton type="submit" class="mt-4" block :loading="status === 'pending'">Registrarse</UButton>
      </UForm>
    </UCard>
  </section>
</template>

<script lang="ts" setup>
import type { Form, FormSubmitEvent } from '#ui/types'
import { userRegisterSchema } from '~/schemas/auth';
import { z } from 'zod'

definePageMeta({
  middleware: ['anonymous']
})

const signupEmail = useState<string | null>('signupEmail', () => null)
type UserRegister = z.infer<typeof userRegisterSchema>
const form = ref<Form<UserRegister> | undefined>()
const registerData = ref(new FormData())
const fileImg = ref()

const state = reactive<UserRegister>({
  username: '',
  email: '',
  first_name: '',
  last_name: '',
  password: '',
  re_password: '',
  about_me: ''
})

const { error, status, execute } = useAsyncData('signup',
  () => useApiFetch('account/users/', {
    method: 'post',
    body: registerData.value
  }),
  {
    lazy: true,
    server: false,
    immediate: false,
  }
)

const onSubmit = async (event: FormSubmitEvent<UserRegister>) => {
  Object.keys(event.data).forEach(key => {
    const value = event.data[key as keyof typeof event.data]
    if (value !== undefined)
      registerData.value.append(key, value)
  })

  const file = fileImg.value.input.files[0]
  if (file !== undefined) registerData.value.append('picture', file)

  await execute()

  if (status.value === 'error') {
    const errorData = error.value?.data as { [key: string]: string[] }
    form.value?.setErrors(
      Object.keys(errorData).map(key => ({ path: key, message: errorData[key][0] }))
    )
  } else {
    signupEmail.value = state.email
    navigateTo('/account/after-signup', { replace: true })
  }
}

</script>