<template>
  <div class="border border-accent-color dark:border-dark-accent-color rounded-md">
    <div v-if="editor">
      <div
      class="flex items-center gap-1 h-8 px-2 border-b border-b-accent-color dark:border-dark-accent-color">
        <UButton
        icon="i-heroicons-bold-solid"
        :variant="editor.isActive('bold') ? 'outline' : 'link'"
        :color="editor.isActive('bold') ? 'primary' : 'gray'"
        size="2xs"
        :padding="false"
        @click="editor.chain().focus().toggleBold().run()" />
  
        <UButton
        icon="i-heroicons-italic-solid"
        :variant="editor.isActive('italic') ? 'outline' : 'link'"
        :color="editor.isActive('italic') ? 'primary' : 'gray'"
        size="2xs"
        :padding="false"
        @click="editor.chain().focus().toggleItalic().run()" />

        <UButton
        variant="link"
        color="gray"
        icon="i-heroicons-photo-solid"
        size="2xs"
        :padding="false"
        @click="console.log('hola')" />
      </div>
      <div>
        <TiptapEditorContent :editor="editor" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Image as ImageTipTap} from '@tiptap/extension-image'

const props = defineProps({
  value: {
    type: String
  }
})
const emits = defineEmits(['update:modelValue'])

function toFixedNumber(num: number, digits: number, base: number = 10){
  const pow = Math.pow(base, digits);
  return Math.round(num*pow) / pow;
}

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

ImageTipTap.configure({
  allowBase64: true,
  inline: true
})

const editor = useEditor({
  content: props.value,
  extensions: [TiptapStarterKit, ImageTipTap],
  editorProps: {
    attributes: {
      class: 'outline-none rounded-b-md px-2 py-5 min-h-[300px]',
    },
    handleDrop: function(view, event, slice, moved) {
      if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) { // if dropping external files
        let file = event.dataTransfer.files[0]; // the dropped file
        let filesize = toFixedNumber((file.size / 1024) / 1024, 4); // get the filesize in MB
        if ((file.type === "image/jpeg" || file.type === "image/png") && filesize < 10) { // check valid image type under 10MB

          getBase64(file).then((base64url) => {
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
          })
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
  editor.value?.destroy()
})

</script>
