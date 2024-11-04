<template>
  <UCard class="w-full" :ui="{ background: '', ring: '', shadow: '' }">
    <template #header>
      <Typography tag="h1" variant="h1"> Mis publicaciones </Typography>
    </template>

    <div
      class="flex flex-col-reverse md:flex-row gap-2 px-3 py-3.5 border-b border-gray-200 dark:border-gray-700"
    >
      <div
        class="grid flex-1 auto-cols-auto grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] gap-2"
      >
        <UInput
          placeholder="Buscar..."
          icon="i-heroicons-magnifying-glass-solid"
          :value="filters.q"
          @input="onInputSearch"
        />
        <USelect
          v-model="filters.section"
          label="Sección"
          :options="sections"
          placeholder="--Seleccionar sección--"
          @change="filters.subsection = undefined"
        />
        <USelect
          v-model="filters.subsection"
          label="Sección"
          :options="subsections"
          placeholder="--Seleccionar subsección--"
          option-attribute="name"
          value-attribute="id"
        />
      </div>

      <div>
        <UButton
          label="Limpiar filtros"
          variant="ghost"
          color="gray"
          @click="clearFilters"
        />
      </div>
    </div>

    <UTable
      :loading="pending"
      :rows="data?.results"
      :loading-state="{
        icon: 'i-heroicons-arrow-path-20-solid',
        label: 'Cargando...',
      }"
      :empty-state="{
        icon: 'i-heroicons-circle-stack-20-solid',
        label: 'No hay publicaciones',
      }"
      :progress="{ color: 'primary', animation: 'carousel' }"
      class="w-full"
      :columns="columns"
    >
      <template #actions-data="{ row }">
        <div class="space-x-2">
          <UTooltip text="Ver post">
            <UButton
              color="gray"
              icon="i-heroicons-arrow-top-right-on-square-solid"
              size="xs"
              :to="`/forum/${row.section.slug}/posts/${row.slug}`"
            />
          </UTooltip>

          <UTooltip text="Editar post">
            <UButton
              size="xs"
              icon="i-heroicons-pencil-solid"
              color="gray"
              :to="`/forum/posts/${row.slug}/edit`"
            />
          </UTooltip>

          <UTooltip text="Eliminar post">
            <UButton
              icon="i-heroicons-trash-solid"
              color="red"
              size="xs"
              @click="deleteCallback(row.slug)"
            />
          </UTooltip>
        </div>
      </template>
    </UTable>

    <div
      v-if="!pending && data?.count"
      class="flex justify-between px-3 py-3.5 border-t border-gray-200 dark:border-gray-700"
    >
      <UPagination
        v-model="page"
        :page-count="pageCount"
        :total="data?.count"
      />
    </div>
  </UCard>
</template>

<script lang="ts" setup>
import type { Post } from "~/types/forum";

type PostPagination = PaginationData<Post>;

const columns = ref([
  { key: "title", label: "Título" },
  { key: "section.name", label: "Sección" },
  { key: "subsection.name", label: "Subsección" },
  { key: "time", label: "Fecha" },
  { key: "actions", label: "Acciones" },
]);

const userStore = useUserStore();
const forumStore = useForumStore();
const filters = reactive({
  q: "",
  section: undefined,
  subsection: undefined,
  username: userStore.user?.username,
});
const sections = await forumStore.getSectionOptions();
const subsections = computed(() => {
  if (filters.section) {
    return forumStore.getSubsectionsBySectionId(Number(filters.section));
  }
  return [];
});
const pageCount = ref(5);
const { getFilteredData, page, clearFilters } = usePaginationFilter({
  size: pageCount.value,
  filters: filters,
  url: "/forum/posts/",
});
const { data, status, refresh } = getFilteredData<PostPagination>({
  lazy: true,
});
const pending = computed(() => status.value === "pending");

const timeout = ref();
const onInputSearch = (event: Event) => {
  if (timeout) {
    clearTimeout(timeout.value);
  }
  timeout.value = setTimeout(async function () {
    filters.q = (event.target as HTMLInputElement).value;
  }, 900);
};

const postSelected = ref();
const postDeletePath = computed(() => {
  return `/forum/posts/${postSelected.value}`;
});

const { execute: deletePost } = useEdukarAPI(() => postDeletePath.value, {
  method: "DELETE",
  immediate: false,
  watch: false,
});

const confimation = useConfirmDialog();
const deleteCallback = async (postSlug: string) => {
  postSelected.value = postSlug;
  confimation.showConfirmDialog({
    title: "Eliminar",
    message: "¿Deseas eliminar este post?",
    severity: "danger",
    acceptLabel: "Eliminar",
    accept: async () => {
      await deletePost();
      await refresh();
    },
  });
};
</script>
