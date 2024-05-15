<template>
  <div :class="isReply ? 'border-b border-gray-200 dark:border-gray-800' : ''">
    <UCard :ui="{
      ring: '', divide: '', shadow: '',
      body: { padding: 'py-5' }, header: { padding: 'py-5' }, footer: { padding: 'py-5' },
    }">
      <template #header>
        <div class="flex gap-4">
          <div class="flex items-center">
            <img class="rounded-full w-[48px] h-[48px] max-w-none" :src="useImgFullPath(props.data.author.picture)"
              alt="author post">
          </div>
          <div>
            <div>
              <h1 v-if="isPost" class="title-section">{{ (props.data as Post).title }}</h1>
              <h3 v-else class="text-primary"> {{ props.data.author.username }} </h3>
            </div>
            <div>
              <p v-if="isPost" class="text-sm">Publicado por <span class="text-primary">
                  {{ props.data.author.username }}</span> ({{ translateDateMonth(props.data.date) }})</p>
              <p v-else class="text-sm">{{ translateDateMonth(props.data.date) }}</p>
            </div>
          </div>
        </div>
      </template>
      <div v-if="props.data.image">
        <img :src="useImgFullPath(props.data.image)" alt="Post Image">
      </div>
      <ClientOnly>
        <article class="prose prose-sm md:prose-base dark:prose-invert" v-html="renderLatex(props.data.body)"></article>
      </ClientOnly>

      <template v-if="!isReply || userStore.isAuthorUser(props.data.author.username)" #footer>
        <div class="space-x-2">
          <UButton v-if="!isReply" @click="replyCallback" label="Responder" size="2xs"
            icon="i-heroicons-arrow-uturn-left-solid" color="gray" />

          <UButton v-if="userStore.isAuthorUser(props.data.author.username)" @click="emits('onUpdate')" label="Editar"
            size="2xs" icon="i-heroicons-pencil-solid" color="gray" />

          <UButton v-if="userStore.isAuthorUser(props.data.author.username)" @click="deleteCallback" label="Eliminar"
            size="2xs" icon="i-heroicons-trash-solid" color="gray" />
        </div>

      </template>
    </UCard>
    <div class="ml-12" v-if="slots.replies">
      <h3>Respuestas:</h3>
      <slot name="replies" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import katex from 'katex';
import type { Comment, Post, Reply } from '~/types/forum';
import { translateDateMonth } from '~/utils/text';

const userStore = useUserStore()
const slots = useSlots()
const { showNotification } = useNotification()
const confimation = useConfirmDialog()

type Content = 'post' | 'comment' | 'reply'

const props = defineProps<{
  type: Content
  data: Post | Comment | Reply
}>()

const isPost = computed(() => {
  return props.type === 'post'
})
const isComment = computed(() => {
  return props.type === 'comment'
})
const isReply = computed(() => {
  return props.type === 'reply'
})

const emits = defineEmits([
  'onReply',
  'onUpdate',
  'onDelete'
])

const replyCallback = () => {
  if (userStore.isLogged) {
    emits('onReply')
  } else {
    showNotification({ message: 'Por favor inicia sesión', type: 'info' })
  }
}

const deleteCallback = async () => {
  confimation.showConfirmDialog({
    title: 'Eliminar',
    message: '¿Deseas eliminar este registro?',
    severity: 'danger',
    acceptLabel: 'Eliminar',
    accept: () => emits('onDelete'),
  })
}

//Katex to render equations
const renderLatex = (html: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const nodes = doc.body.childNodes;

  nodes.forEach(node => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const newNode = node.cloneNode(true);
      // @ts-ignore
      newNode.innerHTML = renderEquation(node.innerHTML);
      // @ts-ignore
      node.parentNode.replaceChild(newNode, node);
    }
  });

  return doc.body.innerHTML;
}

const renderEquation = (text: string) => {
  // Regular expression to find LaTeX expressions within $
  const regex = /\$(.*?)\$/g;
  return text.replace(regex, (match, equation) => {
    try {
      return katex.renderToString(equation, { throwOnError: false });
    } catch (e) {
      // Return the original text if there's an error in rendering LaTeX
      return match;
    }
  });
}

</script>
