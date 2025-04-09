<script setup lang="ts">
import { VueDraggableNext as draggable } from 'vue-draggable-next'

type RequiredFields<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
type ClientGalleryItem = RequiredFields<NewGalleryItem & { file?: File }, "image" | "order">

const { locale, locales } = useI18n()
const localPath = useLocalePath()
const route = useRoute()
const galleryParam = route.params.gallery as string
const categoryParam = route.params.category as string
const initialData = ref<GalleryItem[]>([])
const { data, status, error, refresh } = await useLazyFetch(routesList.api.gallery.category.single(galleryParam, categoryParam))

const showAllItems = ref<boolean>(false)

const images = ref<ClientGalleryItem[]>([])
watch(data, (newData) => {
   if (!newData)
      return

   images.value = newData

   initialData.value = JSON.parse(JSON.stringify(newData))
}, { immediate: true })
watch(images, () => changeOrder())

const changeOrder = () => {
   nextTick(() => {
      let order = images.value.length
      for (const item of images.value) {
         item.order = order--
      }
   })
}

const label = useId()
const toast = useVueToast()


const { isOpen, open } = useSelectFilesWindow()
const handleSelectedImages = (imagesList: string[]) => {
   uploadError.value = ''

   for (const item of imagesList) {
      const isImageExist = images.value?.find(({ image }) => item === image)
      if (isImageExist) {
         uploadError.value += `Image ${item} already exists<br />`
         continue
      }

      images.value.unshift({ image: item, order: images.value.length + 1 })
   }

   isOpen.value = false
}

const loading = ref<boolean>(false)
const uploading = ref<boolean>(false)

const { handle, error: uploadError } = useUploadedFiles(async files => {
   loading.value = true
   uploading.value = true
   const uploadingToast = toast.loading('Uploading images...')

   const result = await uploadFiles(toRef(files)).catch(async err => {
      loading.value = false
      uploading.value = false
      await nextTick()
      toast.update(uploadingToast, {
         render: 'Images wasn\'t uploaded',
         autoClose: true,
         closeOnClick: true,
         type: 'error',
         isLoading: false
      })
   })

   if (!result)
      return

   for (const item of result) {
      images.value.unshift({ image: item.path, order: images.value.length + 1 })
   }

   loading.value = false
   uploading.value = false
   toast.update(uploadingToast, {
      render: 'Images Uploaded',
      autoClose: true,
      closeOnClick: true,
      type: 'success',
      isLoading: false
   })
})


const imagesToRemove = ref<ClientGalleryItem[]>([])
const removeImage = (item: ClientGalleryItem) => {
   if (item.id)
      imagesToRemove.value.push(item)

   images.value = images.value.filter(image => image.image !== item.image)
}

const projectTargetKey = `project${locale.value.charAt(0).toUpperCase() + locale.value.slice(1)}` as 'projectRu'
const { currentPage: projectsPage, totaItems: projectsTotal, pages: projectPages, perPage: projectPerPage } = usePagination(20, 'state', 'gallery:projects:page')
const projectsList = ref<Record<number, Array<{ id: number, slug: string, thumbnail?: ImageJSON, title: string }>>>({})
const fetchProjects = async (cached?: boolean) => {
   if (projectsList.value[projectsPage.value] && cached)
      return

   const result = await $fetch<any>(routesList.api.projects.getAll, {
      query: {
         locale: locale.value,
         perPage: projectPerPage,
         page: projectsPage.value
      }
   }).catch(() => { })
   if (!result)
      return

   projectsList.value[projectsPage.value] = result.projects
   projectsTotal.value = result.total
}

const activeDetails = ref<number | null>(null)
const toggleDetails = (index: number) => {
   if (activeDetails.value === index)
      return activeDetails.value = null

   fetchProjects(true)
   activeDetails.value = index
}


const saveData = async () => {
   if (imagesToRemove.value.length) {
      loading.value = true
      const removeToast = toast.loading('Deleting images...')

      await $fetch(routesList.api.gallery.items.delete(galleryParam, categoryParam), {
         method: 'DELETE',
         body: {
            ids: imagesToRemove.value.map(item => item.id!)
         }
      }).catch(async err => {
         loading.value = false
         await nextTick()
         toast.update(removeToast, {
            render: 'Images wasn\'t deleted',
            autoClose: true,
            closeOnClick: true,
            type: 'error',
            isLoading: false
         })
      })

      loading.value = false
      await nextTick()
      toast.update(removeToast, {
         render: 'Images Deleted',
         autoClose: true,
         closeOnClick: true,
         type: 'success',
         isLoading: false
      })

      imagesToRemove.value = []
   }

   if (!initialData.value)
      return

   const itemsToUpsert = [
      ...images.value.filter(item => !item.id),
      ...images.value.filter(item => {
         if (!item.id)
            return false

         const correspondingItem = initialData.value.find(initialItem => initialItem.id === item.id);
         return correspondingItem && (
            item.order !== correspondingItem.order
            || item.image !== correspondingItem.image
            || item.altEn !== correspondingItem.altEn
            || item.altRu !== correspondingItem.altRu
            || item.title !== correspondingItem.title
            || item.type !== correspondingItem.type
            || item.usage !== correspondingItem.usage
            || item.info !== correspondingItem.info
            || item.projectRu !== correspondingItem.projectRu
            || item.projectEn !== correspondingItem.projectEn
         )
         // @ts-expect-error
      }).map(({ categoryId, projectDetailsRu, projectDetailsEn, ...item }) => item)
   ]

   if (!itemsToUpsert.length)
      return

   loading.value = true
   const upsertToast = toast.loading('Saving images...')

   const updatedItems = await $fetch<GalleryItem[]>(routesList.api.gallery.items.upsert(galleryParam, categoryParam), {
      method: 'POST',
      body: {
         items: itemsToUpsert
      }
   }).catch(async err => {
      loading.value = false
      await nextTick()
      toast.update(upsertToast, {
         render: 'Images wasn\'t deleted' + ` (${err?.data?.message || err?.message})`,
         autoClose: true,
         closeOnClick: true,
         type: 'error',
         isLoading: false
      })
   })

   if (!updatedItems)
      return

   loading.value = false
   await nextTick()
   toast.update(upsertToast, {
      render: 'Images Saved',
      type: 'success',
      autoClose: true,
      closeOnClick: true,
      isLoading: false
   })

   updatedItems.forEach(item => {
      const index = images.value.findIndex(image => image.image === item.image)
      images.value[index] = item
   })

   initialData.value = JSON.parse(JSON.stringify(images.value))
}

const { data: categories } = await useLazyFetch<any>(routesList.api.gallery.category.list(galleryParam), {
   getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] || nuxtApp.static.data[key],
   key: `galleryCategotyList:${route.params.gallery}`
})
</script>

<template>
   <div>
      <ClientOnly>
         <Teleport to="#admin__teleport">
            <div class="flex flex-wrap gap-6 text-base xl:pl-20 uppercase" v-if="categories">
               <NuxtLink class="cursor-pointer py-2 px-3 bg-lime-300 rounded-lg mr-6"
                  :to="localPath(routesList.client.admin.gallery.category.list(galleryParam))">
                  {{ galleryParam }}
               </NuxtLink>

               <p class="cursor-pointer py-2 px-3 bg-emerald-400 rounded-lg" v-for="item in categories"
                  :class="{ 'bg-red-700': categoryParam === item.name }"
                  @click="$router.push({ params: { category: item.name } })">
                  {{ item.name }}
               </p>
            </div>
         </Teleport>
      </ClientOnly>

      <Teleport to="#teleports">
         <LazyMediaSelectFiles v-if="isOpen" @selected="handleSelectedImages" multiple
            class="fixed inset-0 w-full h-full z-10 bg-slate-400 overflow-y-auto [scroll-behavior:none]" />
      </Teleport>

      <div class="flex justify-center items-center flex-wrap mb-5 gap-4">
         <button
            class="uppercase text-lg p-1 bg-green-400 border-none outline-none rounded-md  disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            @click="refresh()" type="button" :disabled="loading">
            <IconsRefresh />
         </button>

         <ButtonsMain @click="open" class="disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            :disabled="uploading">
            Выбрать
         </ButtonsMain>

         <input :id="`upload-${label}`" class="sr-only" type="file" multiple @change="handle"
            accept=".jpg,.jpeg,.png,.webp,.gif" :disabled="uploading">
         <ButtonsMain
            class="disabled:opacity-60 disabled:cursor-not-allowed [&:disabled>label]:cursor-not-allowed cursor-pointer"
            :disabled="uploading">
            <label :for="`upload-${label}`" class="cursor-pointer">
               Загрузить
            </label>
         </ButtonsMain>

         <button
            class="uppercase text-lg px-4 py-2 bg-green-400 border-none outline-none rounded-md disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            @click="saveData" type="button" :disabled="loading">
            Сохранить
         </button>
      </div>

      <div class="text-red-500 text-lg my-4" v-if="uploadError">
         <p v-html="uploadError"></p>
      </div>

      <div v-if="status === 'success' && data">
         <draggable class="grid xs:grid-cols-3 2xl:grid-cols-6 gap-3 relative" v-model="images" handle=".drag-handle"
            delay="200" delayOnTouchOnly="true">
            <transition-group name="list">
               <div v-for="image, i in images" :key="image.image!" class="relative group" :data-id="image.order"
                  v-show="showAllItems || i < 6">
                  <div class="drag-handle">
                     <img v-if="image.image" class="pointer-events-none w-full min-h-10" loading="lazy"
                        :src="image.image.startsWith('blob:') ? image.image : routesList.api.media.getFile(image.image)" />
                  </div>

                  <button
                     class="absolute left-2 top-2 opacity-0 group-hover:opacity-100 transition-all bg-primary-300 rounded-lg p-1 cursor-pointer"
                     @click="toggleDetails(i)">
                     <svg width="32" height="32" viewBox="0 0 36 36">
                        <path fill="currentColor"
                           d="M32 6H4a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h28a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2m0 22H4V8h28Z"
                           class="clr-i-outline clr-i-outline-path-1" />
                        <path fill="currentColor" d="M9 14h18a1 1 0 0 0 0-2H9a1 1 0 0 0 0 2"
                           class="clr-i-outline clr-i-outline-path-2" />
                        <path fill="currentColor" d="M9 18h18a1 1 0 0 0 0-2H9a1 1 0 0 0 0 2"
                           class="clr-i-outline clr-i-outline-path-3" />
                        <path fill="currentColor" d="M9 22h10a1 1 0 0 0 0-2H9a1 1 0 0 0 0 2"
                           class="clr-i-outline clr-i-outline-path-4" />
                        <path fill="none" d="M0 0h36v36H0z" />
                     </svg>
                  </button>

                  <template v-if="activeDetails === i">
                     <Teleport to="#teleports">
                        <div @click.self="toggleDetails(i)"
                           class="fixed inset-0 flex items-center justify-center backdrop-blur">
                           <div
                              class="size-10/12 bg-accent-200 rounded-2xl p-4 shadow-main grid gap-10 content-start overflow-y-auto">
                              <div class="grid grid-cols-3 gap-4 *:min-w-0">
                                 <PrimeMultiSelect v-model="image.type" class="w-full" placeholder="Тип"
                                    option-value="value" option-label="label" :options="Object.keys(GALLERY_ENUM.type).map(item => ({
                                       value: Number(item),
                                       label: $t(`gallery.enum.type.${item}`)
                                    }))" />

                                 <PrimeMultiSelect v-model="image.usage" class="w-full" placeholder="Применение"
                                    option-value="value" option-label="label" :options="Object.keys(GALLERY_ENUM.usage).map(item => ({
                                       value: Number(item),
                                       label: $t(`gallery.enum.usage.${item}`)
                                    }))" />

                                 <PrimeMultiSelect v-model="image.info" class="w-full" placeholder="Дополнительно"
                                    option-value="value" option-label="label" :options="Object.keys(GALLERY_ENUM.info).map(item => ({
                                       value: Number(item),
                                       label: $t(`gallery.enum.info.${item}`)
                                    }))" />
                              </div>

                              <div class="grid grid-cols-6 gap-4">
                                 <div v-for="project in projectsList[projectsPage]" :key="project.id"
                                    class="text-center cursor-pointer rounded-2xl"
                                    :class="{ 'outline-4 outline-accent-500 outline-offset-4': image[projectTargetKey] === project.id }"
                                    @click="() => {
                                       image[projectTargetKey] = image[projectTargetKey] === project.id ? null : project.id
                                    }">
                                    <div class="w-full aspect-square rounded-2xl overflow-hidden mb-4">
                                       <img class="size-full object-cover" v-if="project.thumbnail"
                                          :src="FS_IMAGE_SRC(project.thumbnail.path, 'img')" alt="">
                                       <div v-else class="size-full bg-secondary-300"></div>
                                    </div>

                                    <p>{{ project.title }}</p>
                                 </div>

                                 <div class="col-span-full flex gap-4 items-center">
                                    <button
                                       class="uppercase text-lg p-1 bg-green-400 border-none outline-none rounded-md cursor-pointer"
                                       @click="fetchProjects()" type="button">
                                       <IconsRefresh />
                                    </button>

                                    <Pagination class="mx-auto *:mb-0!" v-bind="{
                                       currentPage: projectsPage,
                                       pages: projectPages
                                    }" @page-changed="newPage => {
                                       projectsPage = newPage
                                       fetchProjects(true)
                                    }" />
                                 </div>
                              </div>
                           </div>
                        </div>
                     </Teleport>
                  </template>

                  <button @click="removeImage(image)" type="button"
                     class="absolute top-2 right-2 bg-white/50 rounded-full p-2 backdrop-blur">
                     <svg class="size-5" width="32" height="32" viewBox="7 7 10 10">
                        <path fill="currentColor"
                           d="m8.054 16.673l-.727-.727L11.273 12L7.327 8.079l.727-.727L12 11.298l3.921-3.946l.727.727L12.702 12l3.946 3.946l-.727.727L12 12.727z" />
                     </svg>
                  </button>

                  <div class="mt-3 sm:absolute bottom-2 grid gap-2 sm:w-11/12 mx-auto sm:left-1/2 sm:-translate-x-1/2">
                     <input v-for="item in locales" :key="item.code" :placeholder="`Alt ${item.code}`"
                        v-model="image[`alt${item.code.charAt(0).toUpperCase() + item.code.slice(1)}` as keyof ClientGalleryItem]"
                        class="min-w-0 sm:opacity-0 group-hover:opacity-100 focus-within:opacity-100 border border-orange-400 bg-white px-2 py-2 rounded-md text-base" />
                  </div>
               </div>
            </transition-group>
         </draggable>

         <button v-if="!showAllItems" @click="showAllItems = true"
            class="block mx-auto text-lg mt-7 rounded-lg bg-sky-400 px-4 py-2 sticky bottom-2">
            Show all
         </button>
      </div>

      <div v-else-if="status === 'pending' || status === 'idle'" class="grid xs:grid-cols-3 2xl:grid-cols-6 gap-3">
         <img src="/loader.svg" class="w-full" loading="lazy" v-for="item in 12" />
      </div>

      <div v-else-if="status === 'error'" class="text-center text-red-500 font-bold text-lg">
         {{ `Error: ${error?.statusMessage || error?.message || error?.data?.message}` }}
      </div>
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