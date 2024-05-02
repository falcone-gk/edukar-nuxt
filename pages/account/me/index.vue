<template>
  <UCard class="w-full" :ui="{ background: '', ring: '', shadow: '' }">

    <template #header>
      <Typography tag="h1" variant="h1">
        Perfil
      </Typography>
    </template>

    <DataLoading :loading="pending" :data="data">
      <template #loading>
        cargando...
      </template>
      <template #data="{ data: profile }">
        <div class="flex flex-col gap-4">
          <div class="text-center">
            <UAvatar :src="profile.picture" size="3xl" alt="picture" />
          </div>

          <!-- User profile data -->
          <div v-if="!isEditMode" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <Typography tag="span">Nombre:</Typography>
                <p>{{ profile.first_name }}</p>
              </div>
              <div>
                <Typography tag="span">Apellido:</Typography>
                <p>{{ profile.last_name }}</p>
              </div>
              <div>
                <Typography tag="span">Nombre de Usuario:</Typography>
                <p>{{ profile.username }}</p>
              </div>
              <div>
                <Typography tag="span">Correo electrónico:</Typography>
                <p>{{ profile.email }}</p>
              </div>
            </div>
            <div>
              <Typography tag="span">Sobre mi:</Typography>
              <p>{{ profile.about_me }}</p>
            </div>
            <UButton icon="i-heroicons-pencil-square" label="Editar" @click="isEditMode = true" />
          </div>

          <!-- Edit mode -->
          <div v-else>
            <UForm ref="form" :state="state" @submit="onUpdateSubmit" :schema="userUpdateSchema">
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <UFormGroup label="Nombre de usuario" name="username" required>
                  <UInput v-model="state.username" />
                </UFormGroup>
                <UFormGroup label="Nombre(s)" name="first_name" required>
                  <UInput v-model="state.first_name" />
                </UFormGroup>
                <UFormGroup label="Apellido(s)" name="last_name" required>
                  <UInput v-model="state.last_name" />
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
              <div class="space-x-2">
                <UButton label="Cancelar" color="gray" @click="isEditMode = false" />
                <UButton type="submit" class="mt-4" label="Actualizar" :loading="statusUpdate === 'pending'" />
              </div>
            </UForm>
          </div>

        </div>
      </template>
    </DataLoading>

  </UCard>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent, Form } from '#ui/types'
import type { UserProfile } from '~/types'
import { userUpdateSchema } from '~/schemas/auth'

definePageMeta({
  middleware: ['auth']
})

const form = ref<Form<UserProfile> | undefined>()
const fileImg = ref()
const isEditMode = ref(false)
const state = reactive<UserProfile>({
  username: '',
  first_name: '',
  last_name: '',
  about_me: '',
  email: ''
})
const formData = ref(new FormData())

const { data, pending, refresh } = useAsyncData(
  'profile',
  () => useApiFetch<UserProfile>('/account/users/me/', {
    onResponse({ response }) {
      if (response.status === 200) {
        const data = response._data as UserProfile
        state.username = data.username
        state.first_name = data.first_name
        state.last_name = data.last_name
        state.about_me = data.about_me
        state.email = data.email
      }
    }
  }), {
  server: false,
  lazy: true
})

const { error, status: statusUpdate, execute: update } = useAsyncData(
  'user-update',
  () => useApiFetch<UserProfile>('/account/users/me/', {
    method: 'patch',
    body: formData.value
  }),
  {
    immediate: false,
  }
)

const onUpdateSubmit = async (event: FormSubmitEvent<UserProfile>) => {
  form.value?.clear()
  Object.keys(event.data).forEach(key => {
    const value = event.data[key as keyof typeof event.data]
    if (value !== undefined) {
      formData.value.append(key, value)
    }
  })

  const file = fileImg.value.input.files[0]
  if (file !== undefined) formData.value.append('picture', file)

  await update()

  if (statusUpdate.value === 'error') {
    const errorData = error.value?.data as { [key: string]: string[] }
    form.value?.setErrors(
      Object.keys(errorData).map(key => ({ path: key, message: errorData[key][0] }))
    )
  } else {
    await refresh()
    isEditMode.value = false
    formData.value = new FormData()
  }
}

</script>