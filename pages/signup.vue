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
      <UForm id="form" :validate="validate" :state="state" @submit="onSubmit">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <UFormGroup label="Nombre de usuario" name="username" required>
            <UInput v-model="state.username" />
          </UFormGroup>
          <UFormGroup label="Email" name="email" required>
            <UInput v-model="state.email" type="email" placeholder="you@example.com" icon="i-heroicons-envelope" />
          </UFormGroup>
          <UFormGroup label="Nombre(s)" name="name" required>
            <UInput v-model="state.name" />
          </UFormGroup>
          <UFormGroup label="Apellido(s)" name="lastname" required>
            <UInput v-model="state.lastname" />
          </UFormGroup>
          <UFormGroup label="Contraseña" name="password" required>
            <UInput v-model="state.password" type="password" />
          </UFormGroup>
          <UFormGroup label="Confirmar contraseña" name="confirm_password" required>
            <UInput v-model="state.confirm_password" type="password" />
          </UFormGroup>
        </div>
        <div class="flex flex-col gap-4 mt-4">
          <UFormGroup label="Sobre mí:" name="about_me">
            <UTextarea v-model="state.about_me" :rows="10" />
          </UFormGroup>
          <UFormGroup label="Imágen de perfil:" name="picture">
            <UInput v-model="state.picture" type="file" accept="image/*" />
          </UFormGroup>
        </div>
        <UButton type="submit" class="mt-4" block :loading="isLoading">Registrarse</UButton>
      </UForm>
    </UCard>
  </section>
</template>

<script lang="ts" setup>
import type { FormError, FormSubmitEvent } from '#ui/types'

interface userData {
  username: string | undefined,
  email: string | undefined,
  name: string | undefined,
  lastname: string | undefined,
  password: string | undefined,
  confirm_password: string | undefined,
  about_me: string | undefined,
  picture: File | undefined
}

const state = reactive<userData>({
  username: undefined,
  email: undefined,
  name: undefined,
  lastname: undefined,
  password: undefined,
  confirm_password: undefined,
  about_me: undefined,
  picture: undefined
})

const validate = (state: userData): FormError[] => {
  const errors = []
  if (!state.username) errors.push({ path: 'username', message: 'Campo requerido' })

  if (!state.email) errors.push({ path: 'email', message: 'Campo requerido' })
  const re: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(state.email as string)) errors.push({ path: 'email', message: 'Email inválido' })

  if (!state.name) errors.push({ path: 'name', message: 'Campo requerido' })
  if (!state.lastname) errors.push({ path: 'lastname', message: 'Campo requerido' })
  if (!state.password) errors.push({ path: 'password', message: 'Campo requerido' })

  if (!state.confirm_password) errors.push({ path: 'confirm_password', message: 'Campo requerido' })
  if (state.password !== state.confirm_password) {
    errors.push({ path: 'confirm_password', message: 'No coincide con contraseña' })
  }

  return errors
}

const isLoading = ref(false)
const onSubmit = async (event: FormSubmitEvent<any>) => {
  isLoading.value = true
  const form = document.getElementById('form') as HTMLFormElement
  const data = new FormData(form)
  console.log(data)
  setTimeout(() => {
    isLoading.value = false
  }, 2000)
}

</script>