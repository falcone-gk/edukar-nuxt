<script lang="ts" setup>
definePageMeta({
  layout: "centered",
});

const isPaid = useState<boolean | null>("isPaid");
if (!isPaid.value) {
  navigateTo("checkout/payment");
}

const sucessContent = reactive({
  title: "Compra realizada exitosamente",
  message:
    "Tu compra se ha realizado de manera exitosa, para ver tu historial de compras y visualizar ingresa a tu perfil.",
  icon: "/icons/Confetti.svg",
});
</script>

<template>
  <div>
    <DisplayAnnouncement v-bind="sucessContent" />
  </div>
</template>
