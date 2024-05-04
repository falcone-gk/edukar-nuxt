<template>
  <section id="login" class="flex">
    <UCard :ui="{
      base: 'mx-4 w-full md:mx-auto md:w-[350px]'
    }">
      <template #header>
        <div class="flex justify-center">
          <LogoEdukar size="h-12" />
        </div>
      </template>
      <form class="flex flex-col gap-4">
        <UFormGroup label="Email" required>
          <UInput type="email" placeholder="you@example.com" icon="i-heroicons-envelope" />
        </UFormGroup>
        <UButton @click="submitLogin" color="primary" block :loading="isLoading">Enviar link de recuperación</UButton>
      </form>
    </UCard>
  </section>
</template>

<script lang="ts" setup>
useHead({
  title: 'Recuperar Contraseña'
})

const isLoading = ref(false)

// TODO: Agregar funcionalidad de recuperar contraseña
const submitLogin = () => {
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
  }, 2000)
}
</script>
