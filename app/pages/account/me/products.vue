<script lang="ts" setup>
interface PrivateProduct {
  name: string;
  slug: string;
  description: string;
  source: string;
  type: number;
}

const columns = [
  { key: "name", label: "Nombre" },
  { key: "description", label: "Descripción" },
  { key: "source" },
];

const nuxtApp = useNuxtApp();
const { data, status } = useEdukarAPI<PrivateProduct[]>(
  "/account/user/products/",
  {
    getCachedData: (key) =>
      nuxtApp.payload.data[key] || nuxtApp.static.data[key],
  },
);
const loading = computed(() => status.value === "pending");

const clickedDocument = ref("");
const {
  data: doc,
  status: downLoadStatus,
  execute: download,
} = useEdukarAPI<Blob>(
  () => `/store/document/download/${clickedDocument.value}`,
  {
    immediate: false,
    watch: false,
  },
);

const { showNotification } = useNotification();
async function onClickDownloadDocument(product: PrivateProduct) {
  clickedDocument.value = product.slug;
  await download();

  if (!doc.value) {
    showNotification({
      title: "Error al descargar documento",
      type: "error",
      message:
        "Hubo un error al descargar su documento. Por favor contactar con soporte de Edukar.",
    });
  } else {
    downloadFile(doc.value, product.name);
  }
}
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
        <UButton
          v-if="row.type === 1"
          label="Descargar"
          color="gray"
          :loading="
            downLoadStatus === 'pending' && row.slug === clickedDocument
          "
          @click="onClickDownloadDocument(row)"
          block
        />
        <UButton
          v-else-if="row.type === 2"
          label="Ver"
          color="gray"
          :to="{
            name: 'services-videos-identifier',
            params: { identifier: row.slug },
          }"
          block
        />
      </template>
    </UTable>
  </UCard>
</template>
