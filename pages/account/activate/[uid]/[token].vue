<template>
  <UCard v-if="!pending" :ui="{
    base: 'mx-auto max-w-[700px]'
  }">
    <template #header>
      <Typography tag="h1" variant="h1">
        {{ title }}
      </Typography>
    </template>

    <div class="flex gap-8">
      <div>
        <img class="w-48" :src="srcIcon" alt="Image mensaje enviado">
      </div>
      <div>
        <p>{{ message }}</p>
      </div>
    </div>

  </UCard>

</template>

<script lang="ts" setup>

const route = useRoute()

const { pending, error } = await useAsyncData('account-activation',
  () => useApiFetch('/account/users/activation/', {
    method: 'post',
    body: {
      uid: route.params.uid,
      token: route.params.token
    }
  }), {
  server: false,
})

const title = computed(() => {
  return error.value ? 'Error en activación de cuenta' : 'Activación de cuenta satisfactoria'
})

const message = computed(() => {
  if (error.value) {
    return 'Hubo un error al momento de activar la cuenta. Posiblemente esto se deba a que el link usado para activar la cuenta no es el correcto o este link ya ha sido usado para activar su cuenta.'
  } else {
    return 'La cuenta ha sido activada satisfactoriamente. Ahora puedes iniciar sesión.'
  }
})

const srcIcon = computed(() => {
  return error.value ? '/icons/identification.svg' : '/icons/Confetti.svg'
})

</script>