<script setup lang="ts">
import { VueDraggableNext as draggable } from 'vue-draggable-next'

export type UploadedImage = {
   path: string
   alt?: string
   file?: File
}

const label = ref<string>('')
onMounted(() => label.value = String(Math.floor(Math.random() * 9e15)))
const images = defineModel<UploadedImage[]>()

const { multiple, title, upload } = defineProps<{
   title: string
   multiple: boolean
   upload?: boolean
}>()

const error = ref<string>('')

const canAddMoreImages = computed(() => multiple ? true : images.value!.length === 0)

const handleFiles = (e: Event) => {
   if (!canAddMoreImages.value)
      return

   error.value = ''

   const filesInput = (e.target as HTMLInputElement).files
   if (!filesInput)
      return

   for (let file of filesInput) {
      const isFileExists = images.value!.find(({ file: loopFile }) => (file.name === loopFile?.name && file.size === loopFile?.size))
      const isSupportedFormat = file.type.includes('image')
      const isAllowedSize = file.size <= 1024 * 1024 * 5 // 5 Mb
      const size = (file.size / 1024 / 1024).toFixed(2)

      if (!isSupportedFormat) {
         error.value += `File ${file.name} have unsupported format ${file.type} (supported only images)<br>`
         continue
      }
      if (isFileExists || !isAllowedSize) {
         if (!isAllowedSize) error.value += `File ${file.name} too large: ${size} Mb (max size 3 Mb)<br>`
         if (isFileExists) error.value += `File ${file.name} already exists<br>`
         continue
      }

      const preview = URL.createObjectURL(file)
      images.value!.push({ path: preview, file: file })

      if (!multiple)
         break
   }
}

const removeFile = (removePath: string) => {
   if (!images.value?.length)
      return

   images.value = images.value.filter(({ path }) => path !== removePath)
}

const { isOpen, open, callback } = useSelectFilesWindow(images)
</script>

<template>
   <div class="grid mx-auto text-center justify-center justify-items-center">
      <LazyMediaSelectFiles v-if="isOpen" :multiple="multiple"
         class="fixed w-full left-0 bottom-0 h-svh overflow-y-scroll bg-white p-2 z-50" @selected="callback" />
      <div v-if="multiple ? true : images && !images.length" class="flex flex-wrap justify-items-center gap-4">
         <ButtonsSelect v-if="!upload" @click="open" type="button" class="block">
            Select {{ title }}
         </ButtonsSelect>
         <ButtonsSelect class="!p-0" type="button">
            <label :for="`upload-${label}`" class="cursor-pointer block px-6 py-2">
               Upload {{ title }}
            </label>
         </ButtonsSelect>
         <input :id="`upload-${label}`" type="file" :multiple="multiple" @change="handleFiles" class="sr-only"
            accept=".jpg,.jpeg,.png,.webp,.gif">
      </div>
      <div class="text-red-500 my-4" v-if="error">
         <p v-html="error"></p>
      </div>
      <draggable v-if="images" class="grid gap-4 px-8 mt-4" :class="multiple && 'grid-cols-2 md:grid-cols-4'"
         v-model="images" handle=".drag-handle">
         <transition-group name="list">
            <div v-for="file in images" :key="file.path"
               class="grid justify-items-center content-between group relative">
               <div class="w-full relative group"
                  :class="multiple ? `h-[150px] sm:h-[200px] md:h-[300px]` : `max-w-[400px]`">
                  <button type="button"
                     class="absolute right-2 top-2 rounded-full bg-white/60 p-2 opacity-0 text-red-600 transition-opacity group-hover:opacity-100"
                     @click="removeFile(file.path)">
                     <svg class="size-5" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="7 7 10 10">
                        <path fill="currentColor"
                           d="m8.054 16.673l-.727-.727L11.273 12L7.327 8.079l.727-.727L12 11.298l3.921-3.946l.727.727L12.702 12l3.946 3.946l-.727.727L12 12.727z" />
                     </svg>
                  </button>
                  <img :src="file.path.startsWith('blob:') ? file.path : routesList.getFile(file.path)"
                     class="w-full h-full object-cover drag-handle">
               </div>
               <input v-if="!upload" v-model="file.alt" placeholder="Image Description"
                  class="block w-full border border-orange-400 bg-white mt-2 px-2 py-2 rounded-md text-base" />
            </div>
         </transition-group>
      </draggable>
   </div>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
   transition: all 400ms ease;
}

.list-enter-from,
.list-leave-to {
   opacity: 0;
   transform: scale(0);
}

/* .list-leave-active {
   position: absolute;
} */
</style>