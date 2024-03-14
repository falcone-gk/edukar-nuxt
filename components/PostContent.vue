<template>
  <div :class="type === 'comment' ? 'border-b border-gray-200 dark:border-gray-800' : ''">
    <UCard :ui="{ ring: '', divide: '', shadow: '' }">
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
              <p v-if="props.type === 'post'" class="text-sm">Publicado por <span class="text-primary">{{ props.username }}</span> ({{
              translateDateMonth(props.date) }})</p>
              <p v-else class="text-sm">{{ translateDateMonth(props.date) }}</p>
            </div>
          </div>
        </div>
      </template>
      <div v-html="props.body"></div>
      <div v-if="props.type !== 'reply'" class="mt-4">
        <UButton
        label="Responder"
        size="2xs"
        icon="i-heroicons-arrow-uturn-left-solid"
        color="gray" />
      </div>
    </UCard>
    <div class="ml-12" v-if="$slots['replies']">
      <slot name="replies"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { translateDateMonth } from '~/utils/text';

type Content = 'post' | 'comment' | 'reply'

const props = defineProps<{
  type: Content
  title?: string
  picture: string
  username: string
  date: string
  body: string
}>()
</script>