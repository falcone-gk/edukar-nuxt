<template>
  <div class="mx-auto w-full max-w-[900px]">
    <UCard>
      <div v-if="!post">
        <p>No existe post</p>
      </div>
      <div v-else>
        <PostContent
        type="post"
        :title="post.title"
        :date="post.date"
        :username="post.author.username"
        :picture="post.author.picture"
        :body="post.body"/>
  
        <UDivider>
          <LogoEdukar />
        </UDivider>
  
        <h2>Comentarios:</h2>
  
        <div class="space-y-4">
          <PostContent v-for="comment in post.comments"
          type="comment"
          :date="comment.date"
          :username="comment.author.username"
          :picture="comment.author.picture"
          :body="comment.body">
            <template #replies>
              <PostContent v-for="reply in comment.replies"
              type="reply"
              :date="reply.date"
              :username="reply.author.username"
              :picture="reply.author.picture"
              :body="reply.body"/>
            </template>
          </PostContent>
        </div>
      </div>

    </UCard>
  </div>
</template>

<script lang="ts" setup>
import type { PostData } from '~/types/forum';

definePageMeta({
  name: 'post',
  breadCrumb: {
    icon: 'i-heroicons-chat-bubble-bottom-center-text-solid',
    label: 'Post'
  }
})

const route = useRoute()
const postSlug = route.params.slug

const { data: post, pending } = await useLazyAsyncData<PostData>(
  'postData',
  () => useApiFetch<PostData>(`/forum/posts/${postSlug}`)
)

</script>