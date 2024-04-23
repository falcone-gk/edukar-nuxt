<template>
  <div>
    <div class="border border-gray-300 dark:border-gray-700 rounded-md">
      <div v-if="editor">
        <div class="flex items-center gap-1 h-8 px-2 border-b border-b-gray-300 dark:border-gray-700">
          <UButton icon="i-heroicons-bold-solid" :variant="editor.isActive('bold') ? 'outline' : 'link'"
            :color="editor.isActive('bold') ? 'primary' : 'gray'" size="2xs" :padding="false"
            @click="editor.chain().focus().toggleBold().run()" />

          <UButton icon="i-heroicons-italic-solid" :variant="editor.isActive('italic') ? 'outline' : 'link'"
            :color="editor.isActive('italic') ? 'primary' : 'gray'" size="2xs" :padding="false"
            @click="editor.chain().focus().toggleItalic().run()" />

          <UPopover :popper="{ arrow: true, placement: 'top' }">
            <UButton variant="link" color="gray" icon="i-heroicons-photo-solid" size="2xs" :padding="false" />
            <template #panel>
              <div class="p-2">
                <UFormGroup label="Subir URL de imagen">
                  <UInput />
                </UFormGroup>
              </div>
            </template>
          </UPopover>
        </div>
        <div>
          <TiptapEditorContent :editor="editor" />
        </div>
      </div>
    </div>
    <p v-if="errors && errors.length > 0" class="mt-2 text-red-500 dark:text-red-400 text-sm">
      {{ errors[0].message }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { Image as ImageTipTap } from '@tiptap/extension-image'
import type { FormError } from '#ui/types'

const props = defineProps({
  value: {
    type: String,
  },
  errors: {
    type: Array<FormError>
  },
  module: {
    type: String,
    required: true
  }
})
const emits = defineEmits(['update:modelValue'])

function toFixedNumber(num: number, digits: number, base: number = 10) {
  const pow = Math.pow(base, digits);
  return Math.round(num * pow) / pow;
}

// TODO: Refactor image upload

const options = {
  maxWidth: 512,
  maxHeight: 384,
  contentType: "image/png",
  quality: 0.2
}

const calculateSize = (image: HTMLImageElement) => {
  let w = image.width,
    h = image.height;
  if (w > h) {
    if (w > options.maxWidth) {
      h = Math.round((h * options.maxWidth) / w);
      w = options.maxWidth;
    }
  } else {
    if (h > options.maxHeight) {
      w = Math.round((w * options.maxHeight) / h);
      h = options.maxHeight;
    }
  }
  return [w, h];
};

function getBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error);
  });
}

function uploadImage(file: File) {
  const formData = new FormData()
  formData.append('image', file)
  formData.append('module', props.module)

  return useApiFetch('account/image/upload', {
    method: 'post',
    body: formData
  })
}

ImageTipTap.configure({
  allowBase64: true,
  inline: true
})

const editor = useEditor({
  content: props.value,
  extensions: [TiptapStarterKit, ImageTipTap],
  editorProps: {
    attributes: {
      class: 'outline-none rounded-b-md px-2 py-2 h-[400px] overflow-y-auto',
    },
    handleDrop: function (view, event, slice, moved) {
      if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) { // if dropping external files
        let file = event.dataTransfer.files[0]; // the dropped file
        let filesize = toFixedNumber((file.size / 1024) / 1024, 4); // get the filesize in MB
        if ((file.type === "image/jpeg" || file.type === "image/png") && filesize < 10) { // check valid image type under 10MB

          let _URL = window.URL || window.webkitURL;
          let img = new Image(); /* global Image */
          img.src = _URL.createObjectURL(file);
          img.onload = function () {
            uploadImage(file).then((response) => {
              // place the now uploaded image in the editor where it was dropped
              console.log(response)
              const imgSrc = useImgFullPath(response.image)
              const { schema } = view.state;
              const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
              const node = schema.nodes.image.create({ src: imgSrc }); // creates the image element
              const transaction = view.state.tr.insert(coordinates!.pos, node); // places it in the correct position
              return view.dispatch(transaction);
            }).catch((error) => {
              if (error) {
                window.alert(error);
              }
            })
          }
          /* getBase64(file).then((base64url) => {
            const { schema } = view.state;
            const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });

            const img = new Image()
            img.src = base64url
            img.onload = (event) => {
              const canvas = document.createElement('canvas'); //create a canvas
              const [newWidth, newHeight] = calculateSize(img);
              canvas.width = newWidth;
              canvas.height = newHeight;
              const ctx = canvas.getContext("2d");
              ctx?.drawImage(img, 0, 0, newWidth, newHeight);
              const srcEncoded = canvas.toDataURL(options.contentType, options.quality)

              const node = schema.nodes.image.create({ src: srcEncoded }); // creates the image element
              const transaction = view.state.tr.insert(coordinates!.pos, node); // places it in the correct position
              view.dispatch(transaction);
            }
          }) */
        } else {
          window.alert("Las imágenes deben ser 'jpg' o 'png'");
        }
        return true; // handled
      }
      return false; // not handled use default behaviour
    }
  },
  onUpdate: (props) => {
    emits('update:modelValue', props.editor.getHTML())
  }
});

onBeforeUnmount(() => {
  unref(editor)?.destroy()
})

</script>
