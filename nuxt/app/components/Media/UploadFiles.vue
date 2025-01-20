<script setup lang="ts">
import { VueDraggableNext as draggable } from 'vue-draggable-next'

const { multiple, itemsToShow } = defineProps<{
   title: string
   multiple: boolean
   itemsToShow?: number
   upload?: boolean
}>()

const emit = defineEmits<{
   'update:modelValue': [UploadedFile[]]
}>()

const images = defineModel<UploadedFile[]>({ default: [] })
const canAddMore = computed(() => multiple || images.value.length < 1)
const showAllItems = ref<boolean>(!itemsToShow)
const label = useId()
const toast = useToast()
const uploading = ref<boolean>(false)

const { isOpen, open, handleSelected } = useSelectFilesWindow(images)

const wannaCustomPath = ref<boolean>(false)
const path = ref<string | undefined>()
const validatePath = computed<string | undefined>({
   get: () => path.value,
   set: (newPath) => {
      if (!newPath || newPath == undefined)
         return path.value = undefined

      return path.value = newPath
         .replace(/[^a-zA-Z0-9\s/]/g, '')
         .replace(/(?<!\/)\/+/g, '/')
         .replace(/\s+/g, '/')
   }
})
const { handle, error: errors } = useUploadedFiles(async files => {
   uploading.value = true
   const uploadingToast = toast.loading('Uploading images...')

   const result = await uploadFiles(toRef(files), path.value)
   for (const item of result) {
      images.value.unshift({ path: item.path })
   }
   emit('update:modelValue', images.value)

   uploading.value = false
   toast.update(uploadingToast, {
      render: 'Images Uploaded',
      autoClose: true,
      closeOnClick: true,
      type: 'success',
      isLoading: false
   })
})

const remove = (pathToRemove: string) => images.value = images.value.filter(({ path }) => path !== pathToRemove)
</script>

<template>
   <div class="grid gap-4 mx-auto text-center justify-center justify-items-center">
      <Teleport to="#teleports">
         <LazyMediaSelectFiles v-if="isOpen" :multiple="multiple" @selected="imageList => {
            handleSelected(imageList)
            emit('update:modelValue', images)
         }" class="fixed inset-0 w-full h-full z-10 bg-slate-400 overflow-y-auto [scroll-behavior:none]" />
      </Teleport>

      <button v-if="!wannaCustomPath && upload" type="button" @click="wannaCustomPath = true" class="text-base mb-2">
         Do you want a custom path?
      </button>
      <input v-if="wannaCustomPath" type="text" class="min-w-0 px-2 py-1 rounded-md text-base" placeholder="Path"
         v-model="validatePath">

      <div v-if="canAddMore" class="flex flex-wrap justify-center justify-items-center gap-4">
         <ButtonsMain v-if="!upload" @click="open" class="disabled:opacity-60 disabled:cursor-not-allowed"
            :disabled="uploading">
            Select {{ title }}
         </ButtonsMain>
         <ButtonsMain :disabled="uploading"
            class="disabled:opacity-60 disabled:cursor-not-allowed [&:disabled>label]:cursor-not-allowed relative">
            Upload {{ title }}
            <label :for="`upload-${label}`" class="absolute inset-0 cursor-pointer" />
         </ButtonsMain>
         <ButtonsMain v-if="upload" @click="images = []" class="bg-red-800 hover:text-black">
            Reset
         </ButtonsMain>
         <input :id="`upload-${label}`" type="file" :multiple="multiple" @change="handle" class="sr-only"
            accept=".jpg,.jpeg,.png,.webp,.gif" :disabled="uploading">
      </div>
      <div class="text-red-500" v-if="errors">
         <p v-html="errors"></p>
      </div>
      <draggable class="relative grid xs:grid-cols-3 2xl:grid-cols-6 gap-3 [&.single]:grid-cols-1"
         :class="{ 'single': !multiple }" v-model="images" handle=".drag-handle">
         <transition-group name="list">
            <div v-for="image, i in images" :key="image.path" class="relative group"
               v-show="itemsToShow ? showAllItems || i < itemsToShow : true">
               <img v-if="image.path" class="drag-handle w-full min-h-10" loading="lazy"
                  :src="image.path.startsWith('blob:') ? image.path : routesList.api.media.getFile(image.path)" />
               <button v-if="!upload" @click="remove(image.path)" type="button"
                  class="absolute top-2 right-2 bg-white/50 rounded-full p-2 backdrop-blur">
                  <svg class="size-5" width="32" height="32" viewBox="7 7 10 10">
                     <path fill="currentColor"
                        d="m8.054 16.673l-.727-.727L11.273 12L7.327 8.079l.727-.727L12 11.298l3.921-3.946l.727.727L12.702 12l3.946 3.946l-.727.727L12 12.727z" />
                  </svg>
               </button>
               <div v-if="!upload" class="mt-3 sm:absolute bottom-2 grid gap-2 sm:w-11/12 mx-auto sm:left-1/2 sm:-translate-x-1/2
                  [&_input]:min-w-0 [&_input]:sm:opacity-0 [&_input]:group-hover:opacity-100
                  [&_input]:focus-within:opacity-100 [&_input]:border [&_input]:border-orange-400 [&_input]:bg-white
                  [&_input]:px-2 [&_input]:py-2 [&_input]:rounded-md [&_input]:text-base">
                  <slot v-if="$slots.inputs" name="inputs" />
                  <input v-else placeholder="Alt" v-model="image.alt" />
               </div>
            </div>
         </transition-group>
      </draggable>
      <button v-if="!showAllItems" @click="showAllItems = true"
         class="block mx-auto text-lg mt-7 rounded-lg bg-sky-400 px-4 py-2 sticky bottom-2">
         Show all
      </button>
   </div>
</template>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
   transition: all 400ms ease;
}

.list-enter-from,
.list-leave-to {
   opacity: 0;
   transform: scale(0);
}

.list-leave-active {
   position: absolute;
   width: 33.3%;
}
</style>