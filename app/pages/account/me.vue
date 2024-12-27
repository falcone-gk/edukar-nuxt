<template>
  <UContainer class="flex gap-8">
    <UVerticalNavigation
      class="hidden md:block max-w-[200px] basis-1/4"
      :links="links"
    />
    <NuxtPage />
  </UContainer>
</template>

<script lang="ts" setup>
useHead({
  title: "Cuenta",
});

const links = [
  {
    label: "Perfil",
    icon: "i-heroicons-user-solid",
    to: "/account/me",
    exact: true,
  },
  {
    label: "Mis Publicaciones",
    icon: "i-heroicons-chat-bubble-left-right-solid",
    to: "/account/me/posts",
    exact: true,
  },
  {
    label: "Notificaciones",
    icon: "i-heroicons-envelope-solid",
    to: "/account/me/notifications",
    exact: true,
  },
  {
    icon: "i-mdi-book",
    label: "Solucionarios",
    to: "/account/me/products",
  },
  {
    icon: "i-mdi-cart-variant",
    label: "Mis compras",
  },
];
</script>
