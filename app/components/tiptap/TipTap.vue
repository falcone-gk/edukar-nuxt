<template>
  <div>
    <div class="border border-gray-300 dark:border-gray-700 rounded-b-md">
      <div v-if="editor">
        <div class="flex items-center gap-1 h-8 px-2 border-b border-b-gray-300 dark:border-gray-700">

          <USelectMenu v-model="labels" :options="headingOptions" value-attribute="id" option-attribute="label" :ui-menu="{
            width: 'w-48'
          }">
            <TipTapButton title="Cabeceras" :icon="headingOptions[headingSelected].icon" />
            <template #option="{ option: heading }">
              <span>{{ heading.label }}</span>
              <span>{{ heading.name }}</span>
            </template>
          </USelectMenu>

          <TipTapButton title="Bold" @click="editor.chain().focus().toggleBold().run()" icon="i-heroicons-bold-solid"
            :is-active="editor.isActive('bold')" />
          <TipTapButton title="Italic" @click="editor.chain().focus().toggleItalic().run()"
            icon="i-heroicons-italic-solid" :is-active="editor.isActive('italic')" />
          <TipTapButton title="Strike" @click="editor.chain().focus().toggleStrike().run()" icon="i-ri-strikethrough"
            :is-active="editor.isActive('strike')" />

          <UDivider class="w-1 h-full" orientation="vertical" />

          <TipTapButton title="Unordered list" @click="editor.chain().focus().toggleBulletList().run()"
            icon="i-heroicons-list-bullet-solid" :is-active="editor.isActive('bulletList')" />
          <TipTapButton title="Ordered list" @click="editor.chain().focus().toggleOrderedList().run()"
            icon="i-ri-list-ordered" :is-active="editor.isActive('orderedList')" />

          <UDivider class="w-1 h-full" orientation="vertical" />

          <TipTapButton title="Undo" @click="editor.chain().focus().undo().run()" icon="i-ri-arrow-go-back-fill"
            :disabled="!editor.can().chain().focus().undo().run()" />
          <TipTapButton title="Redo" @click="editor.chain().focus().redo().run()" icon="i-ri-arrow-go-forward-line"
            :disabled="!editor.can().chain().focus().redo().run()" />


        </div>
        <div>
          <TiptapEditorContent :editor="editor" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Mathematics from '@tiptap-pro/extension-mathematics'
import 'katex/dist/katex.min.css'
// import { Image as ImageTipTap } from '@tiptap/extension-image'

const model = defineModel({ required: true })

// const EditorButton = defineComponent(
//   (props) => {
//     return () => {
//       return h(UButton, {
//         color: props.isActive ? 'primary' : 'gray',
//         variant: props.isActive ? 'outline' : 'ghost',
//         padding: false, size: '2xs', icon: props.icon,
//       })
//     }
//   },
//   {
//     props: {
//       isActive: { type: Boolean, required: false },
//       icon: String
//     }
//   }
// )


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
  // formData.append('module', props.module)

  return useApiFetch('account/image/upload', {
    method: 'post',
    body: formData
  })
}

// ImageTipTap.configure({
//   allowBase64: true,
//   inline: true
// })

const editor = useEditor({
  content: model.value as string,
  extensions: [
    TiptapStarterKit,
    Mathematics
  ],
  editorProps: {
    attributes: {
      class: 'prose dark:prose-invert outline-none rounded-b-md px-2 py-2 h-[400px] overflow-y-auto',
    },
    // handleDrop: function (view, event, slice, moved) {
    //   if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) { // if dropping external files
    //     let file = event.dataTransfer.files[0]; // the dropped file
    //     let filesize = toFixedNumber((file.size / 1024) / 1024, 4); // get the filesize in MB
    //     if ((file.type === "image/jpeg" || file.type === "image/png") && filesize < 10) { // check valid image type under 10MB
    //
    //       let _URL = window.URL || window.webkitURL;
    //       let img = new Image(); /* global Image */
    //       img.src = _URL.createObjectURL(file);
    //       img.onload = function () {
    //         uploadImage(file).then((response) => {
    //           // place the now uploaded image in the editor where it was dropped
    //           const imgSrc = useImgFullPath(response.image)
    //           const { schema } = view.state;
    //           const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
    //           const node = schema.nodes.image.create({ src: imgSrc }); // creates the image element
    //           const transaction = view.state.tr.insert(coordinates!.pos, node); // places it in the correct position
    //           return view.dispatch(transaction);
    //         }).catch((error) => {
    //           if (error) {
    //             window.alert(error);
    //           }
    //         })
    //       }
    //       /* getBase64(file).then((base64url) => {
    //         const { schema } = view.state;
    //         const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
    //
    //         const img = new Image()
    //         img.src = base64url
    //         img.onload = (event) => {
    //           const canvas = document.createElement('canvas'); //create a canvas
    //           const [newWidth, newHeight] = calculateSize(img);
    //           canvas.width = newWidth;
    //           canvas.height = newHeight;
    //           const ctx = canvas.getContext("2d");
    //           ctx?.drawImage(img, 0, 0, newWidth, newHeight);
    //           const srcEncoded = canvas.toDataURL(options.contentType, options.quality)
    //
    //           const node = schema.nodes.image.create({ src: srcEncoded }); // creates the image element
    //           const transaction = view.state.tr.insert(coordinates!.pos, node); // places it in the correct position
    //           view.dispatch(transaction);
    //         }
    //       }) */
    //     } else {
    //       window.alert("Las imágenes deben ser 'jpg' o 'png'");
    //     }
    //     return true; // handled
    //   }
    //   return false; // not handled use default behaviour
    // }
  },
  onUpdate: (props) => {
    //emits('update:modelValue', props.editor.getHTML())
    model.value = props.editor.getHTML()
  },
  onSelectionUpdate: ({ editor }) => {
    if (editor.isActive('heading', { level: 1 })) {
      headingSelected.value = 1
    } else if (editor.isActive('heading', { level: 2 })) {
      headingSelected.value = 2
    } else if (editor.isActive('heading', { level: 3 })) {
      headingSelected.value = 3
    } else {
      headingSelected.value = 0
    }
  }
});

const headingSelected = ref(0)
const headingOptions = [
  { id: 0, name: 'párrafo', label: 'p', icon: 'i-ri-paragraph' },
  { id: 1, name: 'Cabecera 1', label: 'H1', icon: 'i-ri-h-1' },
  { id: 2, name: 'Cabecera 1', label: 'H2', icon: 'i-ri-h-2' },
  { id: 3, name: 'Cabecera 1', label: 'H3', icon: 'i-ri-h-3' },
  // { id: 4, name: 'Cabecera 1', label: 'H4' },
  // { id: 5, name: 'Cabecera 1', label: 'H5' },
  // { id: 6, name: 'Cabecera 1', label: 'H6' },
]
const labels = computed({
  get: () => headingSelected.value,
  set: (id) => {
    if (id === 0) {
      editor.value!.commands.toggleHeading({ level: headingSelected.value as any })
      headingSelected.value = 0
    }
    else if (headingSelected.value === id) {
      editor.value!.commands.toggleHeading({ level: id as any })
      headingSelected.value = 0
    } else {
      editor.value!.commands.setHeading({ level: id as any })
      headingSelected.value = id
    }
  }
})

onBeforeUnmount(() => {
  unref(editor)?.destroy()
})

</script>

<style>
/* Basic editor styles */
.ProseMirror .Tiptap-mathematics-editor {
  background: #202020;
  color: #fff;
  font-family: monospace;
  padding: 0.2rem 0.5rem;
}

.ProseMirror .Tiptap-mathematics-render {
  cursor: pointer;
  padding: 0 0.25rem;
  transition: background 0.2s;
}

.ProseMirror .Tiptap-mathematics-render:hover {
  background: #eee;
}

.ProseMirror .Tiptap-mathematics-editor,
.ProseMirror .Tiptap-mathematics-render {
  border-radius: 0.25rem;
  display: inline-block;
}
</style>
