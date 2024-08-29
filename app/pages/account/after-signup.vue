<template>
  <UModal prevent-close v-model="isOpen">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <Typography tag="h1" variant="big">
            {{ modalContent.title }}
          </Typography>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
            @click="isOpen = false" />
        </div>
      </template>

      <p>{{ modalContent.message }}</p>

    </UCard>
  </UModal>

  <UCard :ui="{
    base: 'mx-auto max-w-[700px]'
  }">
    <template #header>
      <Typography tag="h1" variant="h1">
        Cuenta creada!
      </Typography>
    </template>

    <div class="flex gap-8">
      <div>
        <img class="w-48" src="/icons/Unread.svg" alt="Image mensaje enviado">
      </div>
      <div>
        <p class="mb-4">
          Felicidades por registrarte a Edukar, para poder logearte tienes que verificar tu cuenta, para ello
          te hemos enviado un email a tu correo
          <Typography tag="span" color="primary" variant="body">
            {{ signupEmail }}
          </Typography>.
        </p>

        <p>
          ¿No te llegó el link de verificación? Recuerda revisar en spam o dar click al siguiente botón para volver a
          enviar el link:
          <UButton label="Reenviar email" size="2xs" variant="ghost" icon="i-heroicons-paper-airplane"
            :loading="status === 'pending'" @click="resendEmail" color="cyan" :disabled="isButtonDisabled" />

          <span class="text-xs mt-4" v-if="timeLeft > 0">Botón de reenvío se habilitará en {{ timeLeft }}
            segundos.</span>
        </p>
      </div>
    </div>

  </UCard>
</template>

<script lang="ts" setup>
useHead({
  title: 'Registro Exitoso'
})

definePageMeta({
  middleware: [
    // Middleare to check if user just signed up
    function () {
      const signupEmail = useState<string | null>('signupEmail', () => null)
      if (!signupEmail.value) {
        return abortNavigation()
      }
    }
  ],
  layout: 'centered'
})

const signupEmail = useState<string>('signupEmail')
const isOpen = ref(false)
const isButtonDisabled = ref(false)
const timeLeft = ref(0)
const modalContent = reactive({
  title: '',
  message: '',
})

const { status, execute } = useEdukarAPI('/account/users/resend_activation/', {
  method: 'POST',
  body: { email: signupEmail.value },
  immediate: false,
  watch: false
})

/* const { status, execute } = useAsyncData('resend-email',
  () => useApiFetch('/account/users/resend_activation/', {
    method: 'post',
    body: {
      email: signupEmail.value
    }
  }), {
  immediate: false
}) */

const resendEmail = async () => {
  await execute()

  if (status.value === 'success') {
    isOpen.value = true
    modalContent.title = 'Email reenviado'
    modalContent.message = 'Se ha reenviado el link de verificación a su correo de manera satisfactoria.'

    isButtonDisabled.value = true

    // Set a timer to re-enable the button
    setTimeout(() => {
      isButtonDisabled.value = false
    }, 60000)

    const countdown = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--
      } else {
        clearInterval(countdown)
      }
    }, 1000)

    timeLeft.value = 60

  } else {
    isOpen.value = true
    modalContent.title = 'Error reenviando link de verificación'
    modalContent.message = 'No se pudo reenviar el link de verificación. Tu cuenta ya ha sido verificada o no ha sido registrada anteriormente.'

    isButtonDisabled.value = true
  }
}
</script>
