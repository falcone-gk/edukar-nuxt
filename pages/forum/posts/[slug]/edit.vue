<template>
  <div>
    <UCard class="w-full">
      <div class="text-center">
        <Typography tag="h1" variant="h1" color="primary">
          Editar Post
        </Typography>
      </div>
      <DataLoading :data="data" :loading="pending">
        <template #data="{ data }">
          <div>
            <UForm ref="form" :state="body" :schema="postSchema" @submit="onSubmit" class="flex flex-col gap-4">
              <UFormGroup id="section" label="Sección:" name="section" required>
                <USelect v-model="body.section" @change="onChangeSection" label="Sección" :options="sections"
                  placeholder="--Seleccionar sección--" />
              </UFormGroup>
              <UFormGroup id="subsection" label="Subsección:" name="subsection" required>
                <USelect v-model="body.subsection" label="Sección" :options="subsections"
                  placeholder="--Seleccionar subsección--" option-attribute="name" value-attribute="id" />
              </UFormGroup>
              <UFormGroup id="title" label="Título:" name="title" required>
                <UInput v-model="body.title" label="Título" />
              </UFormGroup>
              <PostEditor v-model:text="body.body" v-model:image="body.image" :current-image-url="body.currentImageUrl"
                :errors="form?.getErrors('body')" />
              <UButton type="submit" :loading="status === 'pending'" block>Publicar Post</UButton>
            </UForm>
          </div>
        </template>
      </DataLoading>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
import { z } from 'zod'
import { postSchema } from '~/schemas/forum';
import type { Form, FormSubmitEvent } from '#ui/types'
import type { Post } from '@/types/forum';

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


const { showNotification } = useNotification()
const form = ref<Form<any>>()

const forumStore = useForumStore()
const sections = await forumStore.getSectionOptions()
const subsections = computed(() => {
  return forumStore.getSubsectionsBySectionId(Number(body.section))
})
const onChangeSection = () => {
  body.subsection = undefined
}

interface PostUpdate {
  section: number | undefined
  subsection: number | undefined
  title: string | undefined
  body: string | undefined
  image: File | undefined
  currentImageUrl: string | undefined
}

const body = reactive<PostUpdate>({
  section: undefined,
  subsection: undefined,
  title: undefined,
  body: undefined,
  image: undefined as File | undefined,
  currentImageUrl: undefined
})

const { data, pending, status } = await useLazyAsyncData(
  'post-retrieve',
  () => useApiFetch<Post>(`/forum/posts/${postSlug}`, {
    onResponse({ response }) {
      if (response.status === 200) {
        const data = response._data as Post
        body.section = data.section.id
        body.subsection = data.subsection.id
        body.title = data.title
        body.body = data.body
        body.currentImageUrl = data.image
      }
    }
  }), { server: false }
)

const postFormData = ref(new FormData())
const { data: newPost, status: statusUpdate, error: postError, execute } = await useAsyncData(
  'post-update',
  () => useApiFetch(`/forum/posts/${postSlug}/`, {
    method: 'patch',
    body: postFormData.value,
  }), {
  immediate: false,
})

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  form.value?.validate()
  const errors = form.value?.getErrors()

  if (!errors || errors.length > 0) {
    return
  }

  // make sure form is empty before population
  postFormData.value = new FormData()

  Object.keys(body).forEach(key => {
    const value = event.data[key as keyof typeof event.data]
    if (value !== undefined && value !== null)
      postFormData.value.append(key, value)
  })

  postFormData.value.delete('currentImageUrl')

  await execute()
  if (statusUpdate.value === 'success') {
    navigateTo(`/forum/${newPost.value.section.slug}/posts/${newPost.value.slug}`)
  } else {
    showNotification({ type: 'error', message: postError.value?.message })
  }
}

</script>
