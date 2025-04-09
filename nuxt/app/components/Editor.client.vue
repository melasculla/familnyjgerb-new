<script setup lang="ts">
import EditorJS, { type OutputData } from '@editorjs/editorjs'
import Header from '@editorjs/header'
import List from '@editorjs/list'
import Embed from '@editorjs/embed'
import Image from '@editorjs/image'
import Quote from '@editorjs/quote'
import CheckList from '@editorjs/checklist'
import Underline from '@editorjs/underline'
import AlignmentTuneTool from 'editorjs-text-alignment-blocktune'
import DragAndDrop from 'editorjs-drag-drop'
import Columns from '@calumk/editorjs-columns'
import ColorPlugin from 'editorjs-text-color-plugin'
import Alert from 'editorjs-alert'
import CustomButtonTool from '~/assets/js/editorJS/modules'

const uniqueID = useId()

const props = defineProps<{
   data?: OutputData | null
}>()

class MyImage extends Image {
   constructor(EditorJSInstance: any) {
      super(EditorJSInstance)
   }

   render() {
      if (this.ui.nodes.imageEl)
         this.ui.nodes.imageEl.src = routesList.api.media.getFile(this.data.file.url)

      this.ui.nodes.imageEl.style.marginInline = 'auto'

      return super.render()
   }

   save() {
      if (this._data.file.url.startsWith('http') && !this._data.file.url.includes('blob'))
         this._data.file.url = this._data.file.url.substring(this._data.file.url.lastIndexOf('/') + 1)

      return super.save()
   }
}

const uploadByFile = async (file: File) => {
   const isAllowedSize = file.size <= 1024 * 1024 * 3 // 3 Mb
   if (!isAllowedSize) {
      alert('Image too big ' + (file.size / 1024 / 1024).toFixed(2) + 'Mb')
      return { success: 0 }
   }

   const body = new FormData()
   body.append('images', file)
   try {
      const urls = await $fetch<string[]>(routesList.api.media.images.upload, {
         method: 'POST',
         body
      })
      if (!urls || !urls[0])
         return { success: 0 }

      return {
         success: 1,
         file: {
            url: routesList.api.media.getFile(urls[0]),
         }
      }
   } catch (err: any) {
      console.error(err)
      return { success: 0 }
   }
}

const editor = ref<EditorJS>()
const tools = {
   customButton: CustomButtonTool,
   header: {
      class: Header,
      inlineToolbar: true,
      config: {
         placeholder: 'Enter a header',
         levels: [2, 3],
         defaultLevel: 2,
      },
      tunes: ['AligmentTune']
   },
   paragraph: {
      tunes: ['AligmentTune']
   },
   list: {
      class: List,
      inlineToolbar: true
   },
   checklist: {
      class: CheckList,
      inlineToolbar: true,
   },
   underline: Underline,
   Color: {
      class: ColorPlugin, // if load from CDN, please try: window.ColorPlugin
      config: {
         colorCollections: ['#EC7878', '#9C27B0', '#673AB7', '#3F51B5', '#0070FF', '#03A9F4', '#00BCD4', '#4CAF50', '#8BC34A', '#CDDC39', '#FFF'],
         defaultColor: '#FF1300',
         type: 'text',
         customPicker: true // add a button to allow selecting any colour  
      }
   },
   Marker: {
      class: ColorPlugin, // if load from CDN, please try: window.ColorPlugin
      config: {
         defaultColor: '#FFBF00',
         type: 'marker',
         icon: `<svg fill="#000000" height="200px" width="200px" version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M17.6,6L6.9,16.7c-0.2,0.2-0.3,0.4-0.3,0.6L6,23.9c0,0.3,0.1,0.6,0.3,0.8C6.5,24.9,6.7,25,7,25c0,0,0.1,0,0.1,0l6.6-0.6 c0.2,0,0.5-0.1,0.6-0.3L25,13.4L17.6,6z"></path> <path d="M26.4,12l1.4-1.4c1.2-1.2,1.1-3.1-0.1-4.3l-3-3c-0.6-0.6-1.3-0.9-2.2-0.9c-0.8,0-1.6,0.3-2.2,0.9L19,4.6L26.4,12z"></path> </g> <g> <path d="M28,29H4c-0.6,0-1-0.4-1-1s0.4-1,1-1h24c0.6,0,1,0.4,1,1S28.6,29,28,29z"></path> </g> </g></svg>`
      }
   },
   alert: Alert,
   image: {
      class: MyImage,
      inlineToolbar: true,
      config: {
         uploader: {
            uploadByFile
         }
      }
   },
   quote: {
      class: Quote,
      inlineToolbar: true
   },
   embed: {
      class: Embed,
      config: {
         services: {
            youtube: true,
            instagram: true,
            pinterest: true,
            twitter: true,
            facebook: true
         }
      }
   },
   AligmentTune: {
      class: AlignmentTuneTool,
      config: {
         default: "left",
         blocks: {
            header: 'center',
         }
      },
   }
}
const mainTools: any = {
   ...tools,
   columns: {
      class: Columns,
      config: {
         EditorJsLibrary: EditorJS,
         tools
      }
   },
}

onMounted(() => {
   editor.value = new EditorJS({
      holder: `${uniqueID}_editorjs`,
      tools: mainTools,
      onReady: async () => {
         new DragAndDrop(editor.value)

         if (props.data?.blocks.length)
            await editor.value?.render(props.data)
      },
      // data: props.data || { blocks: [] }
   })
})

const save = async (): Promise<OutputData> => await editor.value!.save()

defineExpose({ save })
</script>

<template>
   <div>
      <div class="w-full [&_.ce-paragraph]:text-sm [&_.ce-paragraph]:md:text-base
         [&_h2]:text-xl [&_h3]:text-lg">
         <div :id="`${uniqueID}_editorjs`" class="border-4 border-blue-500 bg-white min-h-[500px]"></div>
      </div>
   </div>
</template>

<style>
.ce-toolbar__actions {
   right: -20px !important;
}

.ce-editorjsColumns_col {
   border: 1px solid #000;
}
</style>