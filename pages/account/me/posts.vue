<template>
  <UCard class="w-full" :ui="{ background: '', ring: '', shadow: '' }">

    <template #header>
      <Typography tag="h1" variant="h1">
        Mis publicaciones
      </Typography>
    </template>

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

    <div v-if="!pending" class="flex justify-between px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
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

const page = ref(1)
const pageCount = ref(5)
const { data, pending, refresh } = useAsyncData('user-posts',
  () => useApiFetch<PostPagination>('/forum/posts/', {
    query: {
      username: userStore.user?.username,
      page: page.value,
      size: pageCount.value
    }
  }),
  {
    lazy: true,
    server: false,
    watch: [page]
  }
)

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