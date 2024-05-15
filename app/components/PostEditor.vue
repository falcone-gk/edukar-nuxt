<template>
  <div class="bg-white dark:bg-gray-900 rounded-lg">
    <UTabs :items="items" :ui="{
      wrapper: 'space-y-0',
      list: {
        base: 'rounded-t-lg border-t border-x border-gray-300 dark:border-gray-700',
        rounded: '', padding: '', height: ''
      },
    }">
      <template #text>
        <TipTap v-model="content" />
      </template>

      <template #image>
        <div class="border border-gray-300 dark:border-gray-700 rounded-b-md">
          <div class="flex flex-col gap-4 items-center justify-center w-full p-4">
            <div v-if="image">
              <UChip size="md" inset :ui="{ base: '-mx-2 rounded-none ring-0', background: '' }">
                <img :src="image" alt="Uploaded Image"
                  class="border-2 border-primary-600 dark:border-primary-500 max-h-[400px] w-full" />

                <template #content>
                  <UButton icon="i-heroicons-x-mark-20-solid" size="xl" :padded="false" :ui="{ rounded: 'rounded-full' }"
                    @click="onRemoveImage" />
                </template>
              </UChip>
            </div>
            <label v-else for="dropzone-file"
              class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              @dragover.prevent @dragenter.prevent @drop="handleDrop">
              <div class="flex flex-col items-center justify-center pt-5 pb-6">
                <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                </svg>
                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  Sube o arrastra una imagen
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
              </div>
              <input id="dropzone-file" type="file" class="hidden" @change="handleFileUpload" />
            </label>
            <p v-if="props.currentImageUrl" class="text-sm">Actualmente: <ULink :to="props.currentImageUrl"
                class="underline" active-class="text-primary"
                inactive-class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                target="_blank">
                {{ props.currentImageUrl.split('/').at(-1) }}
              </ULink>
            </p>
          </div>
        </div>
      </template>
    </UTabs>

    <p v-if="props.errors && props.errors.length > 0" class="mt-2 text-red-500 dark:text-red-400 text-sm">
      {{ props.errors[0].message }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { FormError } from '#ui/types'

const props = defineProps({
  errors: {
    type: Array<FormError>
  },
  currentImageUrl: {
    type: String as PropType<string | null>
  }
})

const items = [
  { slot: 'text', label: 'Editor de Texto' },
  { slot: 'image', label: 'Subir Imagen' }
]

const content = defineModel<string | undefined>('text', { default: '', required: false })
const fileImage = defineModel<File | undefined>('image', { default: undefined, required: false })
const image = ref<string | undefined>();

const onRemoveImage = () => {
  image.value = undefined
  fileImage.value = undefined
}

const { showNotification } = useNotification()
const isValidFileImage = (file: File) => {
  const typeFile = file.type.split('/')[0]
  if (typeFile !== 'image') {
    showNotification({ message: 'Debes subir una imagen', type: 'error' })
    return false
  }
  return true
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];

    if (isValidFileImage(file)) {
      fileImage.value = file
      previewImage(file);
    }
  }
};

const previewImage = (file: File) => {
  const reader = new FileReader();
  reader.onload = () => {
    image.value = reader.result as string;
  };
  reader.readAsDataURL(file);
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  const file = event.dataTransfer?.files[0];
  if (file) {
    if (isValidFileImage(file)) {
      fileImage.value = file
      previewImage(file);
    }
  }
};

</script>
