<script setup lang="ts">
import EditorJS, {
   type OutputData,
   type BlockTool,
   type BlockToolConstructorOptions,
   // type BlockToolData,
   // type ToolboxConfig,
   // type PasteConfig,
   // type PasteEvent
} from '@editorjs/editorjs'
import Header from '@editorjs/header'
import List from '@editorjs/list'
import Embed from '@editorjs/embed'
import Image from '@editorjs/image'
import Quote from '@editorjs/quote'
// @ts-ignore
import Delimiter from '@editorjs/delimiter'
import CheckList from '@editorjs/checklist'
import Underline from '@editorjs/underline'
import AlignmentTuneTool from 'editorjs-text-alignment-blocktune'
import DragAndDrop from 'editorjs-drag-drop'
import Columns from '@calumk/editorjs-columns'
import ColorPlugin from 'editorjs-text-color-plugin'
import Alert from 'editorjs-alert'
import CustomButtonTool from '~/assets/js/editorJS/modules'
// @ts-ignore
import Undo from 'editorjs-undo'

const uniqueID = useId()
const config = useRuntimeConfig()

const props = defineProps<{
   data?: OutputData | null
}>()

const currentImage = ref<string>()
const { isOpen, open, close } = useSelectFilesWindow()
const confirm = useConfirm()
const handleSelected = (images: string[]) => {
   if (!images[0])
      return

   currentImage.value = images[0]
   close()
}

class MyImage extends Image implements BlockTool {
   constructor(editorJSInstance: BlockToolConstructorOptions,) {
      super(editorJSInstance)
   }

   render() {
      if (this.ui.nodes.imageEl)
         this.ui.nodes.imageEl.src = routesList.api.media.getFile(this.data.file.url)

      return super.render()
   }

   public async appendCallback() { }
   public rendered() {
      // const blocks = this.api.blocks
      // currentImage.value = this.block.id
      // blocks.delete(blocks.getCurrentBlockIndex())
      if (this.ui.nodes.imageEl)
         return

      const accept = () => {
         // const check = (e: Event) => {
         //    console.log(e)
         // }
         // this.ui.nodes.fileButton.addEventListener('cancel', check)

         this.ui.nodes.fileButton.click()
         return
      }
      const reject = () => {
         const imageSrcWatcher = watch(currentImage, newValue => {
            if (!newValue)
               return

            this.ui.fillImage(routesList.api.media.getFile(newValue))
            this._data.file.url = newValue

            imageSrcWatcher()
            currentImage.value = undefined
         })

         open()
      }

      confirm.require({
         // message: '',
         header: 'Как хочешь добавить изображение',
         accept,
         reject,
         acceptLabel: 'Загрузить новое',
         rejectLabel: 'Выбрать существующее',
         // icon: 'pi pi-upload',
         rejectProps: {
            severity: 'info',
            icon: 'pi pi-upload',
            variant: 'outlined',
            size: 'large'
         },
         acceptProps: {
            severity: 'succcess',
            icon: 'pi pi-image',
            variant: 'outlined',
            size: 'large'
         },
      })
   }

   save() {
      if (this._data.file.url.startsWith('http') && !this._data.file.url.includes('blob'))
         this._data.file.url = this._data.file.url.substring(this._data.file.url.lastIndexOf('/') + 1)

      const key = routesList.api.media.getFile('1').replace('1', '')
      if (this._data.file.url.startsWith(key))
         this._data.file.url = this._data.file.url.replace(key, '')

      return super.save()
   }
}

const uploadByFile = async (file: File) => {
   const isAllowedSize = file.size <= 1024 * 1024 * 5 // 5 Mb
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
const uploadByUrl = async (url: string): Promise<{ success: 0 | 1, file?: { url: string } }> => {
   if (!url.startsWith(config.public.baseUrl))
      return { success: 0 }

   try {
      const link = new URL(url)
      const path = link.pathname

      let finalUrl: string = ''
      if (path.startsWith('/_ipx/')) {
         finalUrl = path.split('/').filter((item, i) => i > 3).join('/')
      } else if (path.startsWith('/api/media/')) {
         finalUrl = path.split('/').filter((item, i) => i > 2).join('/')
      }

      return {
         success: 1,
         file: {
            url: routesList.api.media.getFile(finalUrl)
         }
      }
   } catch (err: any) {
      return { success: 0 }
   }
}

class MyDelimiter extends Delimiter implements BlockTool {
   public settings: { name: string, title: string, icon: string }[]

   constructor(editorJSInstance: BlockToolConstructorOptions) {
      super(editorJSInstance)

      // @ts-ignore
      this.data.size = editorJSInstance.data.size !== undefined ? editorJSInstance.data.size : 'size-2rem'
      // @ts-ignore
      this.wrapper = undefined
      this.settings = [
         ...['0.5rem', '1rem', '2rem', '3rem', '4rem', '5rem'].map(item => ({
            name: `size-${item}`,
            title: `${item}`,
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M16 11h-3V5.41l.79.8a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.42l-2.5-2.5a1 1 0 0 0-.33-.21a1 1 0 0 0-.76 0a1 1 0 0 0-.33.21l-2.5 2.5a1 1 0 0 0 1.42 1.42l.79-.8V11H8a1 1 0 0 0 0 2h3v5.59l-.79-.8a1 1 0 0 0-1.42 1.42l2.5 2.5a1 1 0 0 0 .33.21a.94.94 0 0 0 .76 0a1 1 0 0 0 .33-.21l2.5-2.5a1 1 0 0 0-1.42-1.42l-.79.8V13h3a1 1 0 0 0 0-2"/></svg>`
         }))
      ]
   }

   override render() {
      // @ts-ignore
      const mainWrapper = (this._element as HTMLDivElement)
      // @ts-ignore
      mainWrapper.style.paddingTop = this.data.size ? this.data.size.replace('size-', '') : undefined
      // @ts-ignore
      mainWrapper.style.paddingBottom = this.data.size ? this.data.size.replace('size-', '') : undefined

      return super.render()
   }

   renderSettings() {
      const wrapper = document.createElement('div')
      wrapper.style.display = 'grid'
      wrapper.style.gap = '0.5rem'
      wrapper.style.justifyContent = 'start'
      wrapper.style.justifyItems = 'start'

      this.settings.forEach(tune => {
         const button = document.createElement('div')

         button.classList.add('cdx-settings-button')
         // @ts-ignore
         if (tune.name === this.data.size)
            button.classList.add('cdx-settings-button--active')

         button.innerHTML = tune.icon + tune.title
         wrapper.appendChild(button)

         button.addEventListener('click', () => {
            this._toggleTune(tune.name, wrapper)
            button.classList.toggle('cdx-settings-button--active')
         })
      })

      return wrapper
   }

   private _toggleTune(tune: string, wrapper: HTMLDivElement) {
      // @ts-ignore
      const mainWrapper = (this._element as HTMLDivElement)
      mainWrapper.style.paddingTop = tune.replace('size-', '')
      mainWrapper.style.paddingBottom = tune.replace('size-', '')

      Array.from(wrapper.childNodes).forEach(item => {
         (item as HTMLButtonElement).classList.remove('cdx-settings-button--active')
      })

      // @ts-ignore
      this.data.size = tune
   }

   override save(toolsContent: HTMLElement) {
      // @ts-ignore
      return this.data
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
            uploadByFile,
            uploadByUrl
         },
      }
   },
   quote: {
      class: Quote,
      inlineToolbar: true
   },
   delimiter: MyDelimiter,
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
         new Undo({ editor: editor.value })
         new DragAndDrop(editor.value)

         if (props.data?.blocks.length)
            await editor.value?.render(props.data)
      }
   })
})

const save = async (): Promise<OutputData> => await editor.value!.save()

defineExpose({ save })
</script>

<template>
   <div class="w-full">
      <Teleport to="#teleports">
         <transition>
            <LazyMediaSelectFiles v-if="isOpen" :multiple="false" @selected="handleSelected" @close="close()"
               class="fixed inset-0 w-full h-full z-10 bg-slate-400 dark:bg-primary overflow-y-auto [scroll-behavior:none]" />
         </transition>
      </Teleport>

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