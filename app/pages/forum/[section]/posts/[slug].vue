<template>
  <div class="mx-auto w-full max-w-[900px]">

    <UModal prevent-close v-model="isOpen" :ui="{
      width: 'w-full sm:max-w-[600px] md:max-w-[700px]',
      ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      container: 'flex min-h-full items-center justify-center text-center'
    }">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-primary">{{ commentModal.title }}</h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="closeModal" />
          </div>
        </template>

        <PostEditor v-model:text="body.body" v-model:image="body.image" :current-image-url="body.currentImage" />
        <p v-if="error" class="mt-2 text-red-500 dark:text-red-400 text-sm">
          {{ error }}
        </p>
        <template #footer>
          <UButton @click="sendRequest" :loading="postStatus === 'pending' || putStatus === 'pending'" label="Enviar" />
        </template>
      </UCard>
    </UModal>
    <UCard>
      <div>
        <DataLoading :loading="pending" :data="post">
          <template #loading>
            <SkeletonPostContent />
          </template>
          <template #data="{ data: post }">
            <PostContent
              @on-reply="openModal({ method: 'post', url: '/forum/comments/', key: 'comment', parentId: post.id, parentKey: 'post' })"
              @on-update="navigateTo(`/forum/posts/${post.slug}/edit`)"
              @on-delete="deleteRequest({ key: 'post', url: '/forum/posts/', id: post.slug })" type="post" :data="post" />
          </template>
        </DataLoading>

        <UDivider>
          <LogoEdukarIcon />
        </UDivider>

        <h2>Comentarios:</h2>

        <div class="space-y-4">
          <DataLoading :loading="pending" :data="post" :list="post?.comments" empty-message="No hay comentarios">
            <template #loading>
              <SkeletonPostContent />
            </template>
            <template #data="{ data: post }">
              <div>
                <PostContent v-for="comment in post.comments"
                  @on-reply="openModal({ method: 'post', url: '/forum/replies/', key: 'reply', parentId: comment.id, parentKey: 'comment' })"
                  @on-update="openModal({ method: 'update', url: '/forum/comments/', content: comment.body, key: 'comment', id: comment.id, currentImage: comment.image })"
                  @on-delete="deleteRequest({ key: 'comment', url: '/forum/comments/', id: comment.id })" type="comment"
                  :data="comment">
                  <template v-if="comment.replies.length > 0" #replies>
                    <PostContent v-for="reply in comment.replies"
                      @on-update="openModal({ method: 'update', url: '/forum/replies/', content: reply.body, key: 'reply', id: reply.id, currentImage: reply.image })"
                      @on-delete="deleteRequest({ key: 'reply', url: '/forum/replies/', id: reply.id })" type="reply"
                      :data="reply" />
                  </template>
                </PostContent>
              </div>
            </template>
          </DataLoading>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
import type { Post } from '~/types/forum';
import { commentSchema } from '~/schemas/forum';

//useHead({
//  title: 'Publicación'
//})

definePageMeta({
  name: 'post',
  breadCrumb: {
    icon: 'i-heroicons-chat-bubble-bottom-center-text-solid',
    label: 'Post'
  }
})

const isOpen = ref(false)
const crudMethods = useCrudMethods()
const { postStatus, putStatus } = crudMethods.getStatus()
const body = crudMethods.body
const cleanForm = crudMethods.cleanForm

interface CommentPost {
  title: string,
  method: 'post' | 'update' | undefined
  type: 'comment' | 'reply' | null,
  id: number | null,
  parentId: number | null,
  send: (body?: any) => Promise<any>
}

const commentModal = reactive<CommentPost>({
  title: '',
  method: undefined,
  type: null,
  id: null,
  parentId: null,
  send: async () => { },
})

const route = useRoute()
const postSlug = route.params.slug

const { data: post, pending, refresh } = await useLazyAsyncData(
  'postData',
  () => useApiFetch<Post>(`/forum/posts/${postSlug}`)
)

const { getAbsoluteUrl } = useAbsoluteUrl()
const { getAbsoluteApiUrl } = useAbsoluteApiUrl()

useSeoMeta({
  title: () => `${post.value?.title}`,
  description: () => `${post.value?.body}`,

  // Social media
  ogImage: () => `${post.value?.image ? getAbsoluteApiUrl(post.value?.image) : getAbsoluteUrl('/images/banner_edukar.jpg')}`,
  ogImageAlt: () => 'Imagen de la publicación',
  ogDescription: () => `${post.value?.body}`,
  ogTitle: () => `${post.value?.title}`,
  ogUrl: () => getAbsoluteUrl(`/forum/${post.value?.section.slug}/${post.value?.slug}`),

  // Twitter
  twitterImage: () => `${post.value?.image ? getAbsoluteApiUrl(post.value?.image) : getAbsoluteUrl('/images/banner_edukar.jpg')}`,
  twitterDescription: () => `${post.value?.body}`,
  twitterTitle: () => `${post.value?.title}`,
})

interface PostModalOptions {
  method: 'post'
  parentId: number
  parentKey: string
}

interface UpdateModalOptions {
  method: 'update'
  content: string
}

type ModalOptions = {
  url: string
  key: string
  id?: number | string
  currentImage?: string | undefined
} & (PostModalOptions | UpdateModalOptions)

const openModal = (info: ModalOptions) => {
  const { method, url, key, id, currentImage } = info
  // Make sure body and form are empty before population
  error.value = undefined
  cleanForm()
  crudMethods.setup({ baseKey: key, idField: id, urlCrud: url })
  body.value.image = undefined

  if (method === 'post') {
    commentModal.title = 'Nuevo comentario'
    commentModal.send = crudMethods.createData
    body.value.body = ''
    body.value[info.parentKey] = info.parentId
    body.value.currentImage = undefined
  } else {
    commentModal.title = 'Actualizar comentario'
    commentModal.send = crudMethods.updateData
    body.value.currentImage = currentImage || undefined
    body.value.body = info.content
  }
  commentModal.method = method
  isOpen.value = true
}

const closeModal = () => {
  isOpen.value = false
}

const error = ref()
const { showNotification } = useNotification()
const sendRequest = async () => {
  // Zod schema validation
  const result = await commentSchema.safeParseAsync(toValue(body.value))
  if (!result.success) {
    error.value = 'Debes escribir un texto o subir una imagen'
    return
  }

  await commentModal.send()
  // We don't continue with refresh or close modal unless the
  // request is success.
  if (commentModal.method === 'post') {
    if (postStatus.value !== 'success') {
      showNotification({ type: 'error' })
      return
    }
  } else {
    if (putStatus.value !== 'success') {
      showNotification({ type: 'error' })
      return
    }
  }

  await refresh()
  closeModal()
}

const deleteRequest = async (
  info: { key: string, url: string, id: number | string }
) => {
  const { key, url, id } = info
  crudMethods.setup({ baseKey: key, idField: id, urlCrud: url })
  await crudMethods.destroyData()

  // if post is deleted then redirect to forum
  if (key === 'post') {
    navigateTo('/forum')
  } else {
    await refresh()
  }
}

</script>
