<script lang="ts" setup>
const columns = [
  { key: "products", label: "Productos" },
  { key: "total_cost", label: "Costo" },
  { key: "paid_at", label: "Fecha de compra" },
];

const nuxtApp = useNuxtApp();
const { data, status } = useEdukarAPI("/account/user/purchases/", {
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
      :rows="data || []"
      :columns="columns"
      :loading-state="{
        icon: 'i-heroicons-arrow-path-20-solid',
        label: 'Cargando...',
      }"
      :empty-state="{
        icon: 'i-heroicons-circle-stack-20-solid',
        label: 'No hay compras',
      }"
      :ui="{
        td: { base: 'whitespace-normal align-top' },
      }"
    >
      <template #products-data="{ row }">
        <ul class="list-disc">
          <li v-for="prod in row.products">{{ prod.name }}</li>
        </ul>
      </template>

      <template #paid_at-data="{ row }">
        {{ new Intl.DateTimeFormat("en-CA").format(new Date(row.paid_at)) }}
      </template>

      <template #total_cost-data="{ row }">
        <p class="whitespace-nowrap">{{ `S/ ${row.total_cost}` }}</p>
      </template>
    </UTable>
  </UCard>
</template>
