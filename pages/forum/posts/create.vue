<template>
  <div>
    <UCard class="w-full">
      <div class="text-center">
        <Typography tag="h1" variant="h1" color="primary">
          Nuevo Post
        </Typography>
      </div>
      <div>
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
          <TipTap v-model="body.body" :errors="form?.getErrors('body')" module="forum" />
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

useHead({
  title: 'Crear Publicación'
})

definePageMeta({
  middleware: ['auth'],
  breadCrumb: {
    icon: 'i-heroicons-chat-bubble-bottom-center-text-solid',
    label: 'Nuevo post'
  }
})

const { showNotification } = useNotification()
const form = ref<Form<any>>()
const forumStore = useForumStore()
const sections = await forumStore.getSectionOptions()
const subsections = computed(() => {
  if (body.value.section !== null) {
    return forumStore.getSubsectionsBySectionId(Number(body.value.section))
  }
  return []
})

type Schema = z.output<typeof postSchema>

const body = ref<{
  section: number | undefined,
  subsection: number | undefined,
  title: string,
  body: string
}>({
  section: undefined,
  subsection: undefined,
  title: '',
  body: ''
})

const { data, error, status, execute } = useAsyncData(
  'post-create',
  () => useApiFetch('/forum/posts/', {
    method: 'post',
    body: body.value
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
  if (status.value === 'success') {
    navigateTo(`/forum/${data.value.section.slug}/posts/${data.value.slug}`)
  } else {
    if (error.value?.statusCode === 429) {
      showNotification({
        type: 'error',
        message: 'Demasiados intentos del día (máximo 2). Inténtalo de nuevo mañana.'
      })
    }
    showNotification({ type: 'error' })
  }
}
</script>

<style></style>
