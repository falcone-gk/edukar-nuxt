<template>
  <UCard :ui="{
    base: 'mx-auto max-w-[700px]'
  }">
    <template #header>
      <Typography tag="h1" variant="h1">
        Correo enviado!
      </Typography>
    </template>

    <div class="flex gap-8">
      <div>
        <img class="w-48" src="/icons/Unread.svg" alt="Image mensaje enviado">
      </div>
      <div>
        <p class="mb-4">
          Se ha enviado un correo a <Typography tag="span" variant="body">{{ resetEmail }}</Typography> de manera exitosa.
          Recuerde que si no lo encuentra en su bandeja de entrada, porfavor revisar en spam o en última instancia
          contactar con la administración de Edukar.
        </p>
      </div>
    </div>

  </UCard>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: [
    // Middleare to check if user just send a reset email
    function () {
      const resetEmail = useState<string | null>('reset-email', () => null)
      if (!resetEmail.value) {
        return abortNavigation()
      }
    }
  ]
})

const resetEmail = useState('reset-email', () => '')

</script>
