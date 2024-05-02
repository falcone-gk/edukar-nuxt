<template>
  <UCard class="w-full" :ui="{ background: '', ring: '', shadow: '' }">

    <template #header>
      <Typography tag="h1" variant="h1">
        Mis publicaciones
      </Typography>
    </template>

    <DataLoading :loading="pending" :data="data">
      <template #loading>
        <SkeletonForumPost />
      </template>
      <template #data="{ data: posts }">
        <div class="flex flex-col gap-4">
          <UCard v-if="posts.results.length > 0" :ui="{ body: { base: 'flex flex-col gap-4', padding: '' } }">
            <div
              class="flex justify-between px-4 py-5 sm:p-6 last:border-b-0 border-b-200 dark:border-b-gray-700 border-b"
              v-for="post in posts.results">
              <div>
                <Typography tag="a" variant="big" color="base" :to="`/forum/${post.section.slug}/posts/${post.slug}`">
                  {{ post.title }}
                </Typography>
              </div>
              <div>
                <UButton icon="i-heroicons-pencil-square-solid" color="gray" variant="link"
                  :to="`/forum/posts/${post.slug}/edit`" />
                <UButton icon="i-heroicons-trash-solid" color="red" variant="ghost"
                  @click="deleteCallback(post.slug)" />
              </div>
            </div>
            <template v-if="!pending && data" #footer>
              <div class="flex justify-center">
                <UPagination :total="data?.count" :page-count="pageCount" v-model="page" />
              </div>
            </template>
          </UCard>
          <div v-else>
            <DataEmpty />
          </div>
        </div>
      </template>
    </DataLoading>

  </UCard>
</template>

<script lang="ts" setup>

const userStore = useUserStore()
const page = ref(1)
const pageCount = ref(5)
const { data, pending, refresh } = useAsyncData('user-posts',
  () => useApiFetch('/forum/posts/', {
    query: {
      username: userStore.user?.username,
      page: page.value,
      size: pageCount.value
    }
  }),
  {
    lazy: true,
    server: false,
    watch: [page, pageCount]
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