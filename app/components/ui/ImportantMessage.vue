<template>
<div>
  <UAlert
    v-if="isOpen"
    title="AVISO IMPORTANTE !!!"
    description="NOSOTROS SOMOS LA EMPRESA EDUKAR DE AREQUIPA Y BRINDAMOS SERVICIOS DE CLASES DE REFORZAMIENTO ACADÉMICO, VENTA DE SOLUCIONARIOS DE EXÁMENES ADMISIÓN Y TALLERES PSICOLÓGICOS. NOSOTROS NO OFRECEMOS NINGUN SERVICIO DE SUSCRIPCIÓN MENSUAL, NI VENTA DE CURSOS ONLINE Y NO TENEMOS ALIANZA CON NINGUNA OTRA EMPRESA."
    color="red"
    class="rounded-none bg-red-800 dark:text-white dark:bg-red-800"
    :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'white', variant: 'link', padded: false }"
    @close="isOpen = false"
  />
</div>
</template>

<script lang="ts" setup>
const isOpen = ref(true);
</script>
