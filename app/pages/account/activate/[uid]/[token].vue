<template>
  <div>
    <div v-if="status === 'pending' || status === 'idle'">
      <DataLoadingTransition message="Verificando credenciales" />
    </div>
    <div v-else>
      <DisplayAnnouncement v-if="status === 'success'" v-bind="sucessContent" />
      <DisplayAnnouncement v-else v-bind="errorContent" />
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "centered",
});

const route = useRoute();

const { status } = useEdukarAPI("/account/users/activation/", {
  method: "POST",
  lazy: true,
  // server: false,
  body: {
    uid: route.params.uid,
    token: route.params.token,
  },
});

const sucessContent = reactive({
  title: "Activación de cuenta satisfactoria",
  message:
    "La cuenta ha sido activada satisfactoriamente. Ahora puedes iniciar sesión.",
  icon: "/icons/Confetti.svg",
});

const errorContent = reactive({
  title: "Error en activación de cuenta",
  message:
    "Hubo un error al momento de activar la cuenta. Posiblemente esto se deba a que el link usado para activar la cuenta no es el correcto o este link ya ha sido usado para activar su cuenta.",
  icon: "/icons/identification.svg",
});
</script>
