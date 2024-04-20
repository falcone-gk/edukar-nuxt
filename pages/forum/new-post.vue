<template>
  <div>
    <UCard class="w-full">
      <div class="text-center">
        <h1 class="title-section">Nuevo post</h1>
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
          <TipTap v-model="body.body" :errors="form?.getErrors('body')" />
          <UButton type="submit" :loading="loading" block>Publicar Post</UButton>
        </UForm>
      </div>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
import { z } from 'zod'
import { postSchema } from '~/schemas/forum';
import type { Form, FormSubmitEvent } from '#ui/types'

definePageMeta({
  breadCrumb: {
    icon: 'i-heroicons-chat-bubble-bottom-center-text-solid',
    label: 'Nuevo post'
  }
})

const loading = ref(false)
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
  section: number | null,
  subsection: number | null,
  title: string,
  body: string
}>({
  section: null,
  subsection: null,
  title: '',
  body: ''
})

const { data, error, pending, status, execute } = await useAsyncData(
  'post-create',
  () => useApiFetch('/forum/posts/', {
    method: 'post',
    body: body.value
  }), {
  lazy: true,
  server: false,
  immediate: false,
})

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  form.value?.validate()
  const errors = form.value?.getErrors()

  if (!errors || errors.length > 0) {
    return
  }

  loading.value = true
  await execute()
  if (status.value === 'success') {
    loading.value = false
  } else {
    loading.value = false
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