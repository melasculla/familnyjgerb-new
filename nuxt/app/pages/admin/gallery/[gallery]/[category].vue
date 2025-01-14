<script setup lang="ts">
import { VueDraggableNext as draggable } from 'vue-draggable-next'

const route = useRoute()
const { data, status, error } = await useLazyFetch(routesList.api.gallery.category.single(route.params.gallery as string, route.params.category as string))

type RequiredFields<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
type ClientGalleryItem = Omit<RequiredFields<NewGalleryItem & { file?: File }, "image" | "order">, 'categoryId'>

const images = ref<ClientGalleryItem[]>([])
watch(data, (newData) => newData && (images.value = newData), { immediate: true })

const label = useId()

const { isOpen, open } = useSelectFilesWindow()
const handleSelectedImages = (imagesList: string[]) => {
   for (const item of imagesList) {
      const isImageExist = images.value?.find(({ image }) => item === image)
      if (isImageExist)
         continue

      images.value.unshift({ image: item, order: images.value.length + 1 })
   }

   isOpen.value = false
}

const { handle, error: uploadError } = useUploadedFiles(async files => {
   const result = await uploadImages(toRef(files))
   for (const item of result) {
      images.value.unshift({ image: item.path, order: images.value.length + 1 })
   }
})
</script>

<template>
   <div>
      <Teleport to="#teleports">
         <LazyMediaSelectFiles v-if="isOpen" @selected="handleSelectedImages" class="fixed inset-0 w-full h-full z-10 bg-slate-400" />
      </Teleport>
      <div class="flex justify-center items-center flex-wrap mb-5">
         <div>
            <!-- <NuxtLink v-show="locale !== _locale.code" v-for="_locale in locales" :key="_locale.code"
                     :to="switchLocalePath(_locale.code).split('#')[0]"
                     :aria-label="`${$t('seo.switch_locale')} ${_locale.name}`"
                     style="background-color: var(--primary-color); padding: .8rem; vertical-align: middle; border-radius: 25px;">
                     {{ _locale.code.toUpperCase() }}
                  </NuxtLink> -->
         </div>
         <ButtonsMain type="button" @click="open">
            Выбрать
         </ButtonsMain>
         <input :id="`upload-${label}`" type="file" :multiple="true" class="sr-only" @change="handle"
            accept=".jpg,.jpeg,.png,.webp,.gif">
         <ButtonsMain type="button">
            <label :for="`upload-${label}`" class="cursor-pointer">
               Загрузить
            </label>
         </ButtonsMain>
         <slot />
      </div>
      <div class="text-red-500 text-lg my-4" v-if="uploadError">
         <p v-html="uploadError"></p>
      </div>
      <div v-if="status === 'success' && data">
         <draggable class="grid grid-cols-3 gap-5" v-model="images" handle=".drag-handle">
            <!-- <transition-group name="list"> -->
            <div v-for="image in images" :key="image.order!" class="relative group" :data-id="image.order">
               <img v-if="image.image" class="drag-handle" loading="lazy"
                  :src="image.image.startsWith('blob:') ? image.image : routesList.api.media.getFile(image.image)" />
               <!-- @click="removeFile(file)" -->
               <button type="button" class="absolute top-2 right-2 bg-white/50 rounded-full p-2 backdrop-blur">
                  <svg class="size-5" width="32" height="32" viewBox="7 7 10 10">
                     <path fill="currentColor"
                        d="m8.054 16.673l-.727-.727L11.273 12L7.327 8.079l.727-.727L12 11.298l3.921-3.946l.727.727L12.702 12l3.946 3.946l-.727.727L12 12.727z" />
                  </svg>
               </button>
               <!-- file[`alt_${locale}`] -->
               <input v-model="image.altEn" placeholder="Image Description"
                  class="opacity-0 group-hover:opacity-100 focus-within:opacity-100 absolute bottom-1 block w-11/12 left-1/2 -translate-x-1/2 border border-orange-400 bg-white px-2 py-2 rounded-md text-base" />
            </div>
            <!-- </transition-group> -->
         </draggable>
      </div>
      <div v-else-if="status === 'pending' || status === 'idle'" class="">
         Loading
      </div>
      <div v-else-if="status === 'error'" class="text-center text-red-500 font-bold text-lg">
         {{ `Error: ${error?.statusMessage || error?.message || error?.data?.message}` }}
      </div>
   </div>
</template>

<style scoped></style>