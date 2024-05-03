<template>
  <UCard class="w-full" :ui="{ background: '', ring: '', shadow: '' }">

    <template #header>
      <Typography tag="h1" variant="h1">
        Mis publicaciones
      </Typography>
    </template>

    <div class="flex flex-col-reverse md:flex-row gap-2 px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
      <div class="grid flex-1 auto-cols-auto grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] gap-2">
        <UInput placeholder="Buscar..." icon="i-heroicons-magnifying-glass-solid" :value="q" @input="onInputSearch" />
        <USelect v-model="section" label="Sección" :options="sections" placeholder="--Seleccionar sección--"
          @change="subsection = undefined" />
        <USelect v-model="subsection" label="Sección" :options="subsections" placeholder="--Seleccionar subsección--"
          option-attribute="name" value-attribute="id" />
      </div>

      <div>
        <UButton label="Limpiar filtros" variant="ghost" color="gray" @click="clearFilters" />
      </div>
    </div>

    <UTable :loading="pending" :rows="data?.results"
      :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Cargando...' }"
      :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No hay publicaciones' }"
      :progress="{ color: 'primary', animation: 'carousel' }" class="w-full" :columns="columns">

      <template #actions-data="{ row }">
        <div class="space-x-2">
          <UTooltip text="Ver post">
            <UButton color="gray" icon="i-heroicons-arrow-top-right-on-square-solid" size="xs"
              :to="`/forum/${row.section.slug}/posts/${row.slug}`" />
          </UTooltip>

          <UTooltip text="Editar post">
            <UButton size="xs" icon="i-heroicons-pencil-solid" color="gray" :to="`/forum/posts/${row.slug}/edit`" />
          </UTooltip>

          <UTooltip text="Eliminar post">
            <UButton icon="i-heroicons-trash-solid" color="red" size="xs" @click="deleteCallback(row.slug)" />
          </UTooltip>
        </div>
      </template>
    </UTable>

    <div v-if="!pending && data?.count"
      class="flex justify-between px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
      <UPagination v-model="page" :page-count="pageCount" :total="data?.count" />
    </div>

  </UCard>
</template>

<script lang="ts" setup>
import type { PostData } from '~/types/forum';

type PostPagination = PaginationData<PostData>

const userStore = useUserStore()
const columns = ref([
  { key: 'title', label: 'Título' },
  { key: 'section.name', label: 'Sección' },
  { key: 'subsection.name', label: 'Subsección' },
  { key: 'time', label: 'Fecha' },
  { key: 'actions', label: 'Acciones' }
])

const forumStore = useForumStore()
const section = ref()
const sections = await forumStore.getSectionOptions()
const subsection = ref()
const subsections = computed(() => {
  if (section.value) {
    return forumStore.getSubsectionsBySectionId(Number(section.value))
  }
  return []
})

const page = ref(1)
const pageCount = ref(5)
const { data, pending, refresh } = useAsyncData('user-posts',
  () => useApiFetch<PostPagination>('/forum/posts/', {
    query: {
      page: page.value,
      q: q.value,
      size: pageCount.value,
      username: userStore.user?.username,
      section: section.value,
      subsection: subsection.value
    }
  }),
  {
    lazy: true,
    server: false,
    watch: [page]
  }
)

watch([section, subsection], async () => {
  if (page.value !== 1) {
    // This will trigger auto refresh
    page.value = 1
  } else {
    await refresh()
  }
})

const q = ref()
const timeout = ref()
const onInputSearch = (event: Event) => {
  q.value = (event.target as HTMLInputElement).value
  if (timeout) {
    clearTimeout(timeout.value);
  }
  timeout.value = setTimeout(async function () {
    page.value = 1
    await refresh()
  }, 900);
}

const clearFilters = async () => {
  // Because of watch section and subsection, we don't need to call refresh
  q.value = undefined
  section.value = undefined
  subsection.value = undefined
}

const postSelected = ref()
const postDeletePath = computed(() => {
  return `/forum/posts/${postSelected.value}`
})

const { execute: deletePost } = useLazyAsyncData(
  'post-delete',
  () => useApiFetch(postDeletePath.value, {
    method: 'delete'
  }), {
  immediate: false
})

const confimation = useConfirmDialog()
const deleteCallback = async (postSlug: string) => {
  postSelected.value = postSlug
  confimation.showConfirmDialog({
    title: 'Eliminar',
    message: '¿Deseas eliminar este post?',
    severity: 'danger',
    acceptLabel: 'Eliminar',
    accept: async () => {
      await deletePost()
      await refresh()
    },
  })
}
</script>