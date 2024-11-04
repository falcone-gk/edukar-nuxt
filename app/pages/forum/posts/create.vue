<template>
  <div>
    <UCard class="w-full">
      <div class="text-center">
        <Typography tag="h1" variant="h1" color="primary">
          Nuevo Post
        </Typography>
      </div>
      <div>
        <UForm
          ref="form"
          :state="body"
          :schema="postSchema"
          @submit="onSubmit"
          class="flex flex-col gap-4"
        >
          <UFormGroup id="section" label="Sección:" name="section" required>
            <USelect
              v-model="body.section"
              @change="onChangeSection"
              label="Sección"
              :options="sections"
              placeholder="--Seleccionar sección--"
            />
          </UFormGroup>
          <UFormGroup
            id="subsection"
            label="Subsección:"
            name="subsection"
            required
          >
            <USelect
              v-model="body.subsection"
              label="Sección"
              :options="subsections"
              placeholder="--Seleccionar subsección--"
              option-attribute="name"
              value-attribute="id"
            />
          </UFormGroup>
          <UFormGroup id="title" label="Título:" name="title" required>
            <UInput v-model="body.title" label="Título" />
          </UFormGroup>
          <PostEditor
            v-model:text="body.body"
            v-model:image="body.image"
            :errors="form?.getErrors('body')"
          />
          <UButton type="submit" :loading="status === 'pending'" block
            >Publicar Post</UButton
          >
        </UForm>
      </div>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
import { z } from "zod";
import { postSchema } from "~/schemas/forum";
import type { Form, FormSubmitEvent } from "#ui/types";
import type { Post } from "~/types/forum";

useHead({
  title: "Crear Publicación",
});

definePageMeta({
  middleware: ["auth"],
  breadCrumb: {
    icon: "i-heroicons-chat-bubble-bottom-center-text-solid",
    label: "Nuevo post",
  },
});

const { showNotification } = useNotification();
const form = ref<Form<any>>();
const forumStore = useForumStore();
const sections = await forumStore.getSectionOptions();
const subsections = computed(() => {
  if (body.value.section !== null) {
    return forumStore.getSubsectionsBySectionId(Number(body.value.section));
  }
  return [];
});

type Schema = z.output<typeof postSchema>;

const body = ref<{
  section: number | undefined;
  subsection: number | undefined;
  title: string;
  body: string;
  image: File | undefined;
}>({
  section: undefined,
  subsection: undefined,
  title: "",
  body: "",
  image: undefined,
});

const onChangeSection = () => {
  body.value.subsection = undefined;
};

const postFormData = ref(new FormData());
const { data, error, status, execute } = useEdukarAPI<Post>("/forum/posts/", {
  method: "POST",
  body: postFormData,
  immediate: false,
  watch: false,
});
/* const { data, error, status, execute } = useAsyncData(
  'post-create',
  () => useApiFetch('/forum/posts/', {
    method: 'post',
    body: postFormData.value
  }), {
  immediate: false,
}) */

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  form.value?.validate();
  const errors = form.value?.getErrors();

  if (!errors || errors.length > 0) {
    return;
  }

  // make sure form is empty before population
  postFormData.value = new FormData();

  Object.keys(event.data).forEach((key) => {
    const value = event.data[key as keyof typeof event.data];
    if (value) {
      postFormData.value.append(key, value);
    }
  });

  await execute();
  if (data.value) {
    navigateTo(`/forum/${data.value.section.slug}/posts/${data.value.slug}`);
  } else {
    if (error.value?.statusCode === 429) {
      showNotification({
        type: "error",
        message:
          "Demasiados intentos del día (máximo 2). Inténtalo de nuevo mañana.",
      });
    }
    showNotification({ type: "error" });
  }
};
</script>

<style></style>
