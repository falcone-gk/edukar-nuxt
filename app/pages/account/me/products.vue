<script lang="ts" setup>
const columns = [
  { key: "name", label: "Nombre" },
  { key: "description", label: "Descripción" },
  { key: "source" },
];

const nuxtApp = useNuxtApp();
const { data, status } = useEdukarAPI("/account/user/products/", {
  getCachedData: (key) => nuxtApp.payload.data[key] || nuxtApp.static.data[key],
});
const loading = computed(() => status.value === "pending");
</script>

<template>
  <UCard class="w-full" :ui="{ background: '', ring: '', shadow: '' }">
    <template #header>
      <Typography tag="h1" variant="h1"> Productos </Typography>
    </template>
    <UTable
      :loading="loading"
      :columns="columns"
      :rows="data || []"
      :loading-state="{
        icon: 'i-heroicons-arrow-path-20-solid',
        label: 'Cargando...',
      }"
      :empty-state="{
        icon: 'i-heroicons-circle-stack-20-solid',
        label: 'No hay productos',
      }"
      :ui="{
        td: { base: 'whitespace-normal align-top' },
      }"
    >
      <template #source-data="{ row }">
        <UButton v-if="row.type === 1" label="Descargar" color="gray" block />
        <UButton v-else-if="row.type === 2" label="Ver" color="gray" block />
      </template>
    </UTable>
  </UCard>
</template>
