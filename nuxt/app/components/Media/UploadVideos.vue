<script setup lang="ts">
import { VueDraggableNext as draggable } from 'vue-draggable-next'

const { multiple, itemsToShow } = defineProps<{
   multiple: boolean
   itemsToShow?: number
   upload?: boolean
}>()

const emit = defineEmits<{
   'update:modelValue': [UploadedFile[]]
}>()

const videos = defineModel<UploadedFile[]>({ default: [] })
const canAddMore = computed(() => multiple || videos.value.length < 1)
const showAllItems = ref<boolean>(!itemsToShow)
const label = useId()
const toast = useVueToast()
const uploading = ref<boolean>(false)

const { isOpen, open, handleSelected } = useSelectFilesWindow(videos)

const { handle, error: errors } = useUploadedFiles(async files => {
   uploading.value = true
   const uploadingToast = toast.loading('Uploading videos...')

   const result = await uploadFilesByChunks(toRef(files), 'videos', ['video/']).catch(async err => {
      uploading.value = false
      toast.update(uploadingToast, {
         render: err?.data?.message || err?.message || 'Videos havent uploaded',
         autoClose: true,
         closeOnClick: true,
         type: 'error',
         isLoading: false
      })
   })
   if (!result || !result.length) {
      uploading.value = false
      toast.update(uploadingToast, {
         render: errors.value || 'Videos havent uploaded',
         dangerouslyHTMLString: true,
         autoClose: true,
         closeOnClick: true,
         type: 'error',
         isLoading: false
      })
      return
   }

   for (const item of result) {
      videos.value.unshift({ path: item.path })
   }
   emit('update:modelValue', videos.value)

   uploading.value = false
   toast.update(uploadingToast, {
      render: 'Videos Uploaded',
      autoClose: true,
      closeOnClick: true,
      type: 'success',
      isLoading: false
   })
}, 'video')

const remove = (pathToRemove: string) => videos.value = videos.value.filter(({ path }) => path !== pathToRemove)
</script>

<template>
   <div
      class="w-full grid gap-4 mx-auto text-center items-start content-start justify-center justify-items-center bg-slate-300 p-4 rounded-lg border-t-8 border-sky-300">
      <Teleport to="#teleports">
         <LazyMediaSelectFiles v-if="isOpen" video :multiple="multiple" @selected="videoList => {
            handleSelected(videoList)
            emit('update:modelValue', videos)
         }" class="fixed inset-0 w-full h-full z-10 bg-slate-400 overflow-y-auto [scroll-behavior:none]" />
      </Teleport>

      <!-- v-if="title && !upload" -->
      <div v-if="!upload" class="capitalize text-lg text-blue-500">
         <span>Video</span>
      </div>

      <div v-if="canAddMore" class="flex flex-wrap justify-center justify-items-center gap-4">
         <ButtonsMain v-if="!upload" @click="open" class="disabled:opacity-60 disabled:cursor-not-allowed"
            :disabled="uploading">
            <IconsHand />
         </ButtonsMain>
         <ButtonsMain :disabled="uploading"
            class="disabled:opacity-60 disabled:cursor-not-allowed [&:disabled>label]:cursor-not-allowed relative">
            <IconsUpload />
            <label :for="`upload-${label}`" class="absolute inset-0 cursor-pointer" />
         </ButtonsMain>
         <ButtonsMain v-if="upload" @click="videos = []" class="bg-red-800 hover:text-black">
            Reset
         </ButtonsMain>
         <input :id="`upload-${label}`" type="file" :multiple="multiple" @change="handle" class="sr-only"
            accept=".webp,.mp4" :disabled="uploading">
      </div>
      <div class="text-red-500" v-if="errors">
         <p v-html="errors"></p>
      </div>
      <draggable class="relative grid xs:grid-cols-3 gap-3 [&.single]:grid-cols-1" :class="{ 'single': !multiple }"
         v-model="videos" handle=".drag-handle" delay="200" delayOnTouchOnly="true">
         <transition-group name="list">
            <div v-for="video, i in videos" :key="video.path" class="relative group"
               v-show="itemsToShow ? showAllItems || i < itemsToShow : true">
               <div class="drag-handle">
                  <video v-if="video.path" class="w-full min-h-10 aspect-video pointer-events-none" controls>
                     <source
                        :src="video.path.startsWith('blob:') ? video.path : routesList.api.media.getFile(video.path)">
                  </video>
               </div>
               <button v-if="!upload" @click="remove(video.path)" type="button"
                  class="absolute top-2 right-2 bg-white/50 rounded-full p-2 backdrop-blur">
                  <svg class="size-5" width="32" height="32" viewBox="7 7 10 10">
                     <path fill="currentColor"
                        d="m8.054 16.673l-.727-.727L11.273 12L7.327 8.079l.727-.727L12 11.298l3.921-3.946l.727.727L12.702 12l3.946 3.946l-.727.727L12 12.727z" />
                  </svg>
               </button>
               <div v-if="!upload" class="mt-3 grid gap-2 sm:w-11/12 mx-auto
                  [&_input]:min-w-0 [&_input]:!text-base">
                  <slot v-if="$slots.inputs" name="inputs" />
                  <PrimeInputText v-else type="text" v-model.trim="video.alt" placeholder="Caption" />
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