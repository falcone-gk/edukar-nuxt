<template>
  <div :class="type === 'comment' ? 'border-b border-gray-200 dark:border-gray-800' : ''">
    <UCard :ui="{
    ring: '', divide: '', shadow: '',
    body: { padding: 'py-5' }, header: { padding: 'py-5' }, footer: { padding: 'py-5' },
  }">
      <template #header>
        <div class="flex gap-4">
          <div class="flex items-center">
            <img class="rounded-full w-[48px] h-[48px] max-w-none" :src="useImgFullPath(props.picture)"
              alt="author post">
          </div>
          <div>
            <div>
              <h1 v-if="props.type === 'post'" class="title-section">{{ props.title }}</h1>
              <h3 v-else class="text-primary"> {{ props.username }} </h3>
            </div>
            <div>
              <p v-if="props.type === 'post'" class="text-sm">Publicado por <span class="text-primary">
                  {{ props.username }}</span> ({{ translateDateMonth(props.date) }})</p>
              <p v-else class="text-sm">{{ translateDateMonth(props.date) }}</p>
            </div>
          </div>
        </div>
      </template>
      <div v-html="props.body"></div>

      <template v-if="props.type !== 'reply' || userStore.isAuthorUser(props.username)" #footer>
        <div class="space-x-2">
          <UButton v-if="props.type !== 'reply'" @click="replyCallback" label="Responder" size="2xs"
            icon="i-heroicons-arrow-uturn-left-solid" color="gray" />

          <UButton v-if="userStore.isAuthorUser(props.username)" @click="emits('onUpdate')" label="Editar" size="2xs"
            icon="i-heroicons-pencil-solid" color="gray" />

          <UButton v-if="userStore.isAuthorUser(props.username)" @click="deleteCallback" label="Eliminar" size="2xs"
            icon="i-heroicons-trash-solid" color="gray" />
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
import { translateDateMonth } from '~/utils/text';

const userStore = useUserStore()
const slots = useSlots()
const { showNotification } = useNotification()
const confimation = useConfirmDialog()

type Content = 'post' | 'comment' | 'reply'

const props = defineProps<{
  type: Content
  title?: string
  picture: string
  username: string
  date: string
  body: string
}>()

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
</script>