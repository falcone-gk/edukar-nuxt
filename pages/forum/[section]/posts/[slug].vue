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

        <TipTap :value="commentModal.body" v-model="commentModal.body" />

        <template #footer>
          <UButton @click="sendRequest" label="Enviar" />
        </template>
      </UCard>
    </UModal>

    <div v-if="!post">
      <p>No existe post</p>
    </div>

    <UCard v-else>
      <div>
        <PostContent @show-text-editor="setupModal('post', 'comment', sendComment, post)" type="post"
          :title="post.title" :date="post.date" :username="post.author.username" :picture="post.author.picture"
          :body="post.body" />

        <UDivider>
          <LogoEdukar />
        </UDivider>

        <h2>Comentarios:</h2>

        <div class="space-y-4">
          <PostContent v-for="comment in post.comments"
            @show-text-editor="setupModal('post', 'reply', sendReply, comment)"
            @show-update-text-editor="setupModal('update', 'comment', updateComment, comment, post.id)" type="comment"
            :date="comment.date" :username="comment.author.username" :picture="comment.author.picture"
            :body="comment.body">
            <template v-if="comment.replies.length > 0" #replies>
              <PostContent v-for="reply in comment.replies"
                @show-update-text-editor="setupModal('update', 'reply', updateReply, reply, comment.id)" type="reply"
                :date="reply.date" :username="reply.author.username" :picture="reply.author.picture"
                :body="reply.body" />
            </template>
          </PostContent>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
import type { Comment, PostData, Reply } from '~/types/forum';

definePageMeta({
  name: 'post',
  breadCrumb: {
    icon: 'i-heroicons-chat-bubble-bottom-center-text-solid',
    label: 'Post'
  }
})

const isOpen = ref(false)

interface CommentPost {
  title: string,
  body: string,
  type: 'comment' | 'reply' | null
  id: number | null,
  parentId: number | null,
  send: () => void
}

const commentModal = reactive<CommentPost>({
  title: '',
  body: '',
  type: null,
  id: null,
  parentId: null,
  send: () => { }
})

const route = useRoute()
const postSlug = route.params.slug

const { data: post, pending, refresh } = await useLazyAsyncData<PostData>(
  'postData',
  () => useApiFetch<PostData>(`/forum/posts/${postSlug}`),
  { server: false }
)

const { data: comment, execute: sendComment } = await useLazyAsyncData<PostData>(
  'post-comment',
  () => useApiFetch<PostData>('/forum/comments/', {
    method: 'post',
    body: { body: commentModal.body, post: commentModal.id }
  }),
  { server: false, immediate: false }
)

const { data: reply, execute: sendReply } = await useLazyAsyncData<PostData>(
  'post-reply',
  () => useApiFetch<PostData>('/forum/replies/', {
    method: 'post',
    body: { body: commentModal.body, comment: commentModal.id }
  }),
  { server: false, immediate: false }
)

const { data: newComment, execute: updateComment } = await useLazyAsyncData<PostData>(
  'post-comment-update',
  () => useApiFetch<PostData>(`/forum/comments/${commentModal.id}/`, {
    method: 'put',
    body: {
      body: commentModal.body,
      post: commentModal.parentId
    }
  }),
  { server: false, immediate: false }
)

const { data: newReply, execute: updateReply } = await useLazyAsyncData<PostData>(
  'post-reply-update',
  () => useApiFetch<PostData>(`/forum/replies/${commentModal.id}/`, {
    method: 'put',
    body: { body: commentModal.body }
  }),
  { server: false, immediate: false }
)

const setupModal = (
  method: 'post' | 'update',
  type: 'comment' | 'reply',
  callable: () => {},
  data?: Comment | Reply,
  parentId?: number,
) => {

  if (method === 'post') {
    commentModal.title = 'Nuevo comentario'
  } else {
    commentModal.title = 'Actualizar comentario'
  }

  if (parentId) {
    commentModal.parentId = parentId
  }

  if (data) {
    commentModal.id = data.id

    if (method === 'update') {
      commentModal.body = data.body
    }
  }

  commentModal.send = callable
  commentModal.type = type
  isOpen.value = true
}

const closeModal = () => {
  isOpen.value = false
  commentModal.body = ''
}

const sendRequest = async () => {
  commentModal.send()
  await refresh()
  closeModal()
}

</script>