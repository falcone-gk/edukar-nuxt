<template>
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
        <UFormGroup label="Email" name='email' required>
          <UInput v-model="state.email" type="email" placeholder="you@example.com" icon="i-heroicons-envelope" />
        </UFormGroup>
        <UButton type="submit" color="primary" block label="Enviar link de recuperación"
          :loading="status === 'pending'" />
      </UForm>
    </UCard>
  </section>
</template>

<script lang="ts" setup>
import { z } from 'zod'
import type { Form } from '#ui/types'

useHead({
  title: 'Recuperar Contraseña'
})

definePageMeta({
  middleware: ['anonymous']
})

const schema = z.object({
  email: z.string()
    .min(1, { message: 'Campo requerido' })
    .email({ message: 'Email inválido' })
})
type Schema = z.output<typeof schema>
const state = reactive({
  email: ''
})
const { error, status, execute } = useEdukarAPI('account/users/reset_password/', {
  method: 'POST',
  body: state,
  immediate: false,
  watch: false
})
/* const { error, status, execute } = useAsyncData(
  'reset-password',
  () => useApiFetch('account/users/reset_password/', {
    method: 'post',
    body: {
      email: state.email
    }
  }), {
  immediate: false,
}) */

// TODO: Agregar funcionalidad de recuperar contraseña
const form = ref<Form<Schema> | undefined>()
const submitReset = async () => {
  await execute()
  if (status.value === 'error') {
    const errorData = error.value?.data as string[]
    form.value?.setErrors([{ message: errorData[0], path: 'email' }])
  } else {
    const resetEmail = useState('reset-email', () => '')
    resetEmail.value = state.email
    navigateTo('/account/reset-password/send-success')
  }
}
</script>
