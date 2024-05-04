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
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
              @click="closeModal" />
          </div>
        </template>

        <TipTap v-model="body.body" module="forum" />

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
              @on-delete="deleteRequest({ key: 'post', url: '/forum/posts/', id: post.slug })" type="post"
              :title="post.title" :date="post.date" :username="post.author.username" :picture="post.author.picture"
              :body="post.body" />
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
                  @on-update="openModal({ method: 'update', url: '/forum/comments/', content: comment.body, key: 'comment', id: comment.id })"
                  @on-delete="deleteRequest({ key: 'comment', url: '/forum/comments/', id: comment.id })" type="comment"
                  :date="comment.date" :username="comment.author.username" :picture="comment.author.picture"
                  :body="comment.body">
                  <template v-if="comment.replies.length > 0" #replies>
                    <PostContent v-for="reply in comment.replies"
                      @on-update="openModal({ method: 'update', url: '/forum/replies/', content: reply.body, key: 'reply', id: reply.id })"
                      @on-delete="deleteRequest({ key: 'reply', url: '/forum/replies/', id: reply.id })" type="reply"
                      :date="reply.date" :username="reply.author.username" :picture="reply.author.picture"
                      :body="reply.body" />
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
import type { Comment, PostData, Reply } from '~/types/forum';

useHead({
  title: 'Publicación'
})

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

interface CommentPost {
  title: string,
  body: string,
  type: 'comment' | 'reply' | null,
  id: number | null,
  parentId: number | null,
  send: (body?: any) => Promise<any>
}

const commentModal = reactive<CommentPost>({
  title: '',
  body: '',
  type: null,
  id: null,
  parentId: null,
  send: async () => { },
})

const route = useRoute()
const postSlug = route.params.slug

const { data: post, pending, refresh } = await useLazyAsyncData<PostData>(
  'postData',
  () => useApiFetch<PostData>(`/forum/posts/${postSlug}`),
)

interface ModalOptions {
  method: 'post' | 'update'
  url: string
  key: string
  id?: number
  content?: string
  parentId?: number
  parentKey?: string
}

const openModal = (info: ModalOptions) => {
  const { method, url, key, id, content, parentId, parentKey } = info
  crudMethods.setup({ baseKey: key, idField: id, urlCrud: url })
  body.body = content || ''

  if (method === 'post') {
    commentModal.title = 'Nuevo comentario'
    commentModal.send = crudMethods.createData
    body[key] = content as string
    body[parentKey as string] = parentId as number
  } else {
    commentModal.title = 'Actualizar comentario'
    commentModal.send = crudMethods.updateData
  }
  isOpen.value = true
}

const closeModal = () => {
  isOpen.value = false
  commentModal.body = ''
}

const sendRequest = async () => {
  await commentModal.send()
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
