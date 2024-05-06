<template>
  <div>
    <UCard class="w-full">
      <div class="text-center">
        <Typography tag="h1" variant="h1" color="primary">
          Editar Post
        </Typography>
      </div>
      <div v-if="!body">
        cargando...
      </div>
      <div v-else>
        <UForm ref="form" :state="body" :schema="postSchema" @submit="onSubmit" class="flex flex-col gap-4">
          <UFormGroup id="section" label="Sección:" name="section" required>
            <USelect v-model="body.section" label="Sección" :options="sections" placeholder="--Seleccionar sección--" />
          </UFormGroup>
          <UFormGroup id="subsection" label="Subsección:" name="subsection" required>
            <USelect v-model="body.subsection" label="Sección" :options="subsections"
              placeholder="--Seleccionar subsección--" option-attribute="name" value-attribute="id" />
          </UFormGroup>
          <UFormGroup id="title" label="Título:" name="title" required>
            <UInput v-model="body.title" label="Título" />
          </UFormGroup>
          <TipTap v-if="body.body !== ''" v-model="body.body" :value="body.body" :errors="form?.getErrors('body')"
            module="forum" />
          <UButton type="submit" :loading="status === 'pending'" block>Publicar Post</UButton>
        </UForm>
      </div>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
import { z } from 'zod'
import { postSchema } from '~/schemas/forum';
import type { Form, FormSubmitEvent } from '#ui/types'
import type { PostData } from '@/types/forum';

useHead({
  title: 'Editar Publicación'
})

definePageMeta({
  middleware: ['auth'],
  breadCrumb: {
    icon: 'i-heroicons-chat-bubble-bottom-center-text-solid',
    label: 'Editar post'
  }
})

type Schema = z.output<typeof postSchema>

const route = useRoute()
const postSlug = route.params.slug
const body = ref<{
  section: string | undefined,
  subsection: string | undefined,
  title: string,
  body: string
} | null>(null)

const { showNotification } = useNotification()
const form = ref<Form<any>>()

const forumStore = useForumStore()
const sections = await forumStore.getSectionOptions()
const subsections = computed(() => {
  if (body.value === null) return
  if (body.value && body.value.section !== null) {
    return forumStore.getSubsectionsBySectionId(Number(body.value.section))
  }
  return []
})

const { status } = await useLazyAsyncData(
  'post-retrieve',
  () => useApiFetch<PostData>(`/forum/posts/${postSlug}`, {
    onResponse({ response }) {
      if (response.status === 200) {
        const data = response._data as PostData
        body.value = {
          section: String(data.section.id),
          subsection: String(data.subsection.id),
          title: data.title,
          body: data.body
        }
      }
    }
  })
)

const { data: newPost, status: statusUpdate, error: postError, execute } = await useAsyncData(
  'post-update',
  () => useApiFetch(`/forum/posts/${postSlug}/`, {
    method: 'put',
    body: body.value,
  }), {
  immediate: false,
})

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  form.value?.validate()
  const errors = form.value?.getErrors()

  if (!errors || errors.length > 0) {
    return
  }

  await execute()
  if (statusUpdate.value === 'success') {
    navigateTo(`/forum/${newPost.value.section.slug}/posts/${newPost.value.slug}`)
  } else {
    showNotification({ type: 'error', message: postError.value?.message })
  }
}

</script>
