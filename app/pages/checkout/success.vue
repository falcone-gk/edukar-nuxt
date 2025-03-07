<script lang="ts" setup>
definePageMeta({
  layout: "centered",
  middleware: [
    function () {
      const isPaid = useState<boolean | null>("isPaid");

      if (!isPaid.value) {
        return navigateTo({ name: "store" });
      }
    },
  ],
});

const successContent = reactive({
  title: "Compra realizada exitosamente",
  icon: "/icons/Confetti.svg",
});
const emailPayment = useState<string>("emailPayment");
</script>

<template>
  <div>
    <UCard
      :ui="{
        base: 'mx-auto max-w-[700px]',
      }"
    >
      <template #header>
        <Typography tag="h1" variant="h1">
          {{ successContent.title }}
        </Typography>
      </template>

      <div class="flex gap-8">
        <div class="flex items-center">
          <img class="w-96" :src="successContent.icon" alt="icono mensaje" />
        </div>
        <div>
          <p>
            Tu compra se ha realizado de manera exitosa, para ver tu historial
            de compras ingresa a tu perfil en el apartado de
            <span class="text-primary-500 dark:text-primary-400"
              >Mis compras</span
            >. Si has realizado la compra de un solucionario, podrás ver tu
            producto en tu perfil, en el apartado de
            <span class="text-primary-500 dark:text-primary-400"
              >Mis solucionarios</span
            >. El comprobante de pago de su compra fue enviado a su correo
            electrónico <strong>{{ emailPayment }}</strong
            >.
          </p>

          <div class="mt-8">
            <UButton to="/" target="_blank" label="Ir al inicio" />
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>
