<template>
  <UModal prevent-close v-model="isOpen">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <Typography tag="h1" variant="big" :color="modalContent.titleColor">
            {{ modalContent.title }}
          </Typography>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="onCloseModal" />
        </div>
      </template>

      <p>{{ modalContent.message }}</p>

    </UCard>
  </UModal>

  <section class="flex">
    <UCard :ui="{
      base: 'mx-4 w-full md:mx-auto md:w-[350px]'
    }">
      <template #header>
        <div class="flex justify-center">
          <LogoEdukar size="h-12" />
        </div>
      </template>
      <UForm ref="form" class="flex flex-col gap-4" :state="state" :schema="schema" @submit="submitReset">
        <UFormGroup label="Nueva contraseña" name="new_password" required>
          <UInput v-model="state.new_password" type="password" />
        </UFormGroup>
        <UFormGroup label="Confirmar nueva contraseña" name="re_new_password" required>
          <UInput v-model="state.re_new_password" type="password" />
        </UFormGroup>
        <UButton type="submit" color="primary" block label="Reestablecer contraseña" :loading="status === 'pending'" />
      </UForm>
    </UCard>
  </section>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { Form } from '#ui/types'

const isOpen = ref(false)
const modalContent = reactive({
  title: '',
  titleColor: 'primary',
  message: ''
})


const route = useRoute()

const schema = z.object({
  new_password: z.string({ required_error: 'Campo requerido' }).min(8, { message: 'Este campo debe tener al menos 8 caracteres.' }),
  re_new_password: z.string(),
}).superRefine(({ re_new_password, new_password }, ctx) => {
  if (re_new_password !== new_password) {
    ctx.addIssue({
      code: 'custom',
      message: 'Las contraseñas no coinciden',
      path: ['re_new_password']
    })
  }
})
type Schema = z.output<typeof schema>
const state = reactive({
  uid: route.params.uid,
  token: route.params.token,
  new_password: undefined,
  re_new_password: undefined
})

const { status, error, execute } = useAsyncData(
  'send-reset-password',
  () => useApiFetch('account/users/reset_password_confirm/', {
    method: 'post',
    body: state
  }), {
  immediate: false
})

const onCloseModal = () => {
  if (!error.value) {
    navigateTo('/login')
  }
  isOpen.value = false
}

const form = ref<Form<Schema> | undefined>()
const submitReset = async () => {
  await execute()
  if (status.value === 'error') {
    modalContent.title = 'Error al actualizar contraseña.'
    modalContent.message = 'No se pudo actualizar su contraseña, posiblemente el URL ha caducado. Contactar con la administración de Edukar para el respectivo soporte.'
    modalContent.titleColor = 'danger'
  } else {
    modalContent.title = 'Contraseña actualizada'
    modalContent.message = 'Su contraseña ha sido actualizada satisfactoriamente.'
    modalContent.titleColor = 'primary'
  }
  isOpen.value = true
}
</script>
