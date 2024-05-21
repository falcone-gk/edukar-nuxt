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
              @dragover.prevent @dragenter.prevent @drop="handleFileUploadOrDrop">
              <div class="flex flex-col items-center justify-center pt-5 pb-6">
                <UIcon class="h-8 w-8 mb-4 text-gray-500 dark:text-gray-400" name="i-heroicons-cloud-arrow-up" />
                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  Sube o arrastra una imagen
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, JPEG o GIF (MAX. 5MB)</p>
              </div>
              <input id="dropzone-file" type="file" class="hidden" @change="handleFileUploadOrDrop" />
            </label>
            <p v-if="props.currentImageUrl" class="text-sm">Actualmente: <ULink
                :to="useImgFullPath(props.currentImageUrl)" class="underline" active-class="text-primary"
                inactive-class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                target="_blank">
                {{ props.currentImageUrl.split('/').at(-1) }}
              </ULink>
            </p>
          </div>
        </div>
      </template>
    </UTabs>

    <div class="mt-2" v-if="props.showTips">
      <p class="text-gray-400 dark:text-gray-500 text-xs"><i>Nota: Puedes enviar texto e imagen al mismo tiempo.</i></p>
      <p class="text-gray-400 dark:text-gray-500 text-xs"><i>Tip: Las ecuaciones deben estar entre "$$" para
          renderizarse: $$ f(x) = x $$</i></p>
    </div>
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
  },
  showTips: {
    type: Boolean,
    default: true
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

// Image drop/upload valiations

const { showNotification } = useNotification()
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 Megabytes in bytes

const handleFileUploadOrDrop = (event: Event | DragEvent) => {
  // Ensure event has `dataTransfer?.files[0]` for drag events
  // const file = (event instanceof DragEvent ? event.dataTransfer?.files[0] : (event.target as HTMLInputElement).files?.[0]) as File;
  let file: File | undefined;

  if (event instanceof DragEvent) {
    file = event.dataTransfer?.files[0];
  } else {
    const target = event.target as HTMLInputElement;
    file = target.files?.[0];
  }

  if (!file) {
    return; // No file selected
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    showNotification({ message: "Tamaño de imagen excede el límite máximo de 5MB", type: 'error' });
    return;
  }

  // Common logic for valid files
  if (isValidFileType(file)) {
    fileImage.value = file;
    previewImage(file);
  } else {
    showNotification({ message: 'Debes subir una imagen', type: 'error' });
  }
};

const isValidFileType = (file: File) => {
  return file.type.split('/')[0] === 'image';
};

const previewImage = (file: File) => {
  const reader = new FileReader();
  reader.onload = () => {
    image.value = reader.result as string;
  };
  reader.readAsDataURL(file);
};

</script>
