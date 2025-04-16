<script setup lang="ts">
const { locale } = useI18n()

const { type } = defineProps<{
   type: 'gerbs' | 'monograms'
}>()

const route = useRoute()
const query = computed(() => route.query)

const { currentPage, pages, totaItems, perPage } = usePagination(20, 'query', 'page')

const fetchQuery = computed(() => ({
   page: currentPage.value,
   perPage: perPage,

   gallery: type,
   category: convertQueryToStringArray(query.value.category),
   type: convertQueryToStringArray(query.value.type),
   usage: convertQueryToStringArray(query.value.usage),
   info: convertQueryToStringArray(query.value.info),
}))

const items = useState<Array<{
   type: number[] | null
   usage: number[] | null
   info: number[] | null
   id: number
   image: string | null
   title: string | null
   altEn: string | null
   altRu: string | null
   order: number | null
   categoryId: number
   projectRu: number | null
   projectEn: number | null
   projectDetailsRu: { slug: string } | null
   projectDetailsEn: { slug: string } | null
}>>(`gallery`, () => []) // :${JSON.stringify(fetchQuery.value)}

const addMore = ref<boolean>(false)
const unshift = ref<boolean>(false)

const pagesRange = useState<Set<number>>('gallery:pages_range', () => new Set())

const { data, status, error } = await useLazyFetch(routesList.api.gallery.main, {
   query: fetchQuery,
   key: `gallery:${JSON.stringify(fetchQuery.value)}`,
   onResponse({ response }) {
      if (response._data?.items && response._data?.total != null) {
         if (addMore.value) {
            items.value.push(...response._data.items)
            pagesRange.value.add(currentPage.value)
         }

         else if (unshift.value) {
            items.value.unshift(...response._data.items)
            pagesRange.value.add(currentPage.value)
         }

         else {
            items.value = response._data.items
            pagesRange.value.clear()
            pagesRange.value.add(currentPage.value)
         }

         totaItems.value = response._data.total
      }
   },
   // getCachedData(key, nuxtApp) {
   //    console.log(key)
   //    return undefined
   // },
})

watch(status, () => {
   if (status.value !== 'pending') {
      addMore.value = false
      unshift.value = false
   }
})

const projectKey = `projectDetails${locale.value.charAt(0).toUpperCase() + locale.value.slice(1)}` as 'projectDetailsRu'
const altKey = `alt${locale.value.charAt(0).toUpperCase() + locale.value.slice(1)}` as 'altRu'

const showFilters = ref<boolean>(true)

const { isOpen, open, close } = useModalWindow()
const activeImageRef = ref<typeof items.value[0] | null>(null)
const activeImageKey = ref<number>(1)
const activeImageIndex = computed<number>(() => {
   const active = activeImageRef.value
   return active ? items.value?.findIndex(item => item.id === active.id) : -1
})
const openImage = async (image: typeof items.value[0] | (() => Promise<typeof items.value[0] | null>)) => {
   const newImage = typeof image === 'function' ? await image() : image
   if (!newImage)
      return

   if (activeImageRef.value)
      activeImageKey.value = activeImageKey.value + 1

   activeImageRef.value = newImage

   if (!isOpen.value) {
      open()
      window.addEventListener('keyup', galleryNav)
   }
}
const closeImage = () => {
   activeImageRef.value = null
   window.removeEventListener('keyup', galleryNav)
   close()
}


const activePages = computed<[number, number]>(() => {
   const arr = Array.from(pagesRange.value).sort((a, b) => a - b)
   const first = arr[0]!
   const last = arr.pop()

   return [first, first === last ? first : last!]
})

const waitFetchSuccess = async () => {
   await new Promise(resolve => {
      const watcher = watch(status, newValue => {
         if (newValue === 'pending')
            return

         resolve({})
         watcher()
      })
   })
   await nextTick()
}
const prevImage = async () => {
   if (
      status.value !== 'pending'
      && activeImageIndex.value === 0
      && activePages.value[0] > 1
   ) {
      unshift.value = true
      currentPage.value = activePages.value[0] - 1

      await waitFetchSuccess()
   }

   const item = items.value[activeImageIndex.value - 1]
   return item ? item : null
}
const nextImage = async () => {
   const index = items.value?.findIndex(item => item.id === activeImageRef.value!.id)

   if (
      status.value !== 'pending'
      && index >= (items.value.length - 1)
      && activePages.value[1]
      && activePages.value[1] < pages.value
   ) {
      addMore.value = true
      currentPage.value = activePages.value[1] + 1

      await waitFetchSuccess()
   }

   const item = items.value[index + 1]
   return item ? item : null
}

const activeImage = computed(() => {
   if (activeImageRef.value == undefined)
      return null

   return {
      id: activeImageRef.value.id,
      image: FS_IMAGE_SRC(activeImageRef.value.image!), // path: item.path.includes('http') ? item.path : joinURL('/fs/', item.path),
      type: activeImageRef.value.type,
      usage: activeImageRef.value.usage,
      info: activeImageRef.value.info,
      order: activeImageRef.value.order,

      project: activeImageRef.value[projectKey],
      alt: activeImageRef.value[altKey],
   }
})

const galleryNav = async (e: KeyboardEvent) => {
   if (e.key === 'ArrowLeft' && activeImage.value && status.value !== 'pending') await openImage(prevImage)
   if (e.key === 'ArrowRight' && activeImage.value && status.value !== 'pending') await openImage(nextImage)
}
</script>

<template>
   <div class="">
      <div class="grid gap-8 text-center px-10 py-10">
         <h2 class="text-accent-800 uppercase text-3xl font-semibold">Галерея геральдической мастерской</h2>

         <p class="leading-8 text-balance">
            Представляем Вашему вниманию примеры проектов выполненных нашими мастерами в соответствии с категориями.
            Руководствуясь опытом и пользой наших клиентов, нами разработаны наиболее выгодные предложения-категории:
            «стандарт», «премиум» и «элит». Они отличаются по комплектности стоимости и степени полезности в
            практическом применении символа.
            Также возможно формирование индивидуального проекта исходя из Ваших специальных задач и целей.
         </p>

         <ButtonsMain class="justify-self-center">
            Узнать подробнее
         </ButtonsMain>
      </div>

      <div
         class="grid grid-rows-[var(--_head-h)_auto] px-5 [--_border:var(--color-basic-900)] *:border-[var(--_border)] transition-all [--_head-h:3.1rem]"
         :class="showFilters ? 'grid-cols-[30rem_1fr]' : 'grid-cols-[0_1fr] [&_.filters]:border-transparent [&_.gallery-head]:border-r-transparent'">
         <div class="col-[1/1] row-[1/1] content-center flex justify-evenly items-end border-r border-b overflow-hidden
         [&>*:hover]:bg-primary-500 [&>*:hover]:text-white *:duration-300 [&_.router-link-active]:bg-accent-800!
         [&_.router-link-active]:text-white text-accent-800 *:transition-all gallery-head
         *:p-3 *:block *:leading-none uppercase font-semibold">
            <NuxtLink :to="{
               path: $localePath(routesList.client.gallery.gerbs),
               // query: { ...query, page: 1, category: undefined }
            }" class="">
               Gerbs
            </NuxtLink>

            <NuxtLink :to="{
               path: $localePath(routesList.client.gallery.monograms),
               // query: { ...query, page: 1, category: undefined }
            }">
               Monograms
            </NuxtLink>
         </div>

         <GalleryFilters
            class="col-[1/1] row-[2/-1] sticky top-14 w-full h-[94svh] border-r pt-5 filters [&_.p-scrollpanel-content]:overscroll-contain"
            :gallery="type" />

         <div class="col-[2/-1] row-[1/-1]">
            <div class="flex flex-col min-h-full">
               <div v-if="(addMore || unshift) ? true : (status !== 'error' && status !== 'pending')" class="px-5 py-7">
                  <template v-if="items.length">
                     <div class="grid gap-2 items-start" :class="showFilters
                        ? 'grid-cols-4'
                        : 'grid-cols-5'">
                        <div v-for="image in items" :key="image.id" class="break-inside-avoid">
                           <NuxtImg class="w-full h-full object-cover cursor-pointer" :src="FS_IMAGE_SRC(image.image!)"
                              densities="x1" width="500"
                              :format="image.image!.split('.').pop() === 'gif' ? undefined : 'webp'"
                              :alt="image[`alt${locale.charAt(0).toUpperCase() + locale.slice(1)}` as keyof GalleryItem['altRu']] || image.altRu || undefined"
                              placeholder="/loader.svg" @click="openImage(image)" />

                           <NuxtLink v-if="image[projectKey]"
                              :to="$localePath(routesList.client.projects.single(image[projectKey]!.slug))"
                              class="block w-full text-center bg-accent-500 text-white py-2">
                              Смотреть проект
                           </NuxtLink>
                        </div>
                     </div>

                     <template v-if="status === 'pending' ? true : currentPage < pages">
                        <button v-if="status !== 'pending'"
                           class="flex items-center gap-4 mt-5 mx-auto text-xl text-accent-800 px-10 py-2 cursor-pointer"
                           @click="() => {
                              addMore = true
                              currentPage = currentPage + 1
                           }">
                           <svg class="w-8" viewBox="0 0 33 32" fill="none">
                              <path
                                 d="M16.678 32C12.162 32 8.33629 30.451 5.20085 27.3531C2.06695 24.2537 0.5 20.4716 0.5 16.0069C0.5 11.5421 2.06695 7.75848 5.20085 4.656C8.33475 1.55352 12.1605 0.00152381 16.678 0C19.4251 0 21.9974 0.645334 24.3948 1.936C26.7907 3.22667 28.7221 5.02857 30.1889 7.34171V0H32.5V11.9543H20.4128V9.66857H28.964C27.7591 7.39048 26.0658 5.5901 23.8841 4.26743C21.7024 2.94476 19.3003 2.28419 16.678 2.28571C12.8261 2.28571 9.55195 3.61905 6.85563 6.28571C4.1593 8.95238 2.81114 12.1905 2.81114 16C2.81114 19.8095 4.1593 23.0476 6.85563 25.7143C9.55195 28.381 12.8261 29.7143 16.678 29.7143C19.6439 29.7143 22.321 28.8762 24.7092 27.2C27.0973 25.5238 28.7729 23.3143 29.7359 20.5714H32.1903C31.1703 23.9939 29.2336 26.7543 26.3801 28.8526C23.5266 30.9509 20.2926 32 16.678 32Z"
                                 fill="currentColor" />
                           </svg>

                           <span class="font-bold">{{ $t('gallery.main.more') }}</span>
                        </button>
                        <img v-else class="mx-auto w-1/4 aspect-square" src="/loader.svg" alt="" />
                     </template>
                  </template>

                  <div v-else>
                     <p>
                        Nothing found return to
                        <NuxtLink :to="{ query: { page: 1 } }" class="text-accent-500">
                           first page
                        </NuxtLink>
                     </p>
                  </div>


                  <transition name="zoomedImage">
                     <Teleport to="#teleports">
                        <div v-if="isOpen && activeImage"
                           class="fixed z-[200] inset-0 w-full h-full [&:not(.zoomedImage-enter-active)]:backdrop-blur-md transition-all">
                           <div class="size-full" @click="closeImage()">
                              <NuxtImg :src="activeImage.image" placeholder="/loader.svg" :key="activeImageKey"
                                 class="size-full object-contain" />
                           </div>

                           <!-- <p v-if="activeImage.alt" class="fixed top-5 left-1/2 -translate-x-1/2 bg-accent-300 rounded-2xl px-4 py-2
                           font-semibold text-white dark:text-primary max-w-[90%] w-max max-sm:text-center">
                           {{ activeImage.alt }}
                        </p> -->

                           <button
                              class="absolute max-xl:bottom-10 xl:top-1/2 xl:-translate-y-1/2 left-2 lg:left-20 bg-accent-800 cursor-pointer">
                              <!-- && activeImage.prev !== null -->
                              <svg v-if="status !== 'pending'" class="size-14 lg:size-20 text-white" width="32"
                                 height="32" viewBox="0 0 24 24" @click="openImage(prevImage)">
                                 <path fill="currentColor"
                                    d="m7.85 13l2.85 2.85q.3.3.288.7t-.288.7q-.3.3-.712.313t-.713-.288L4.7 12.7q-.3-.3-.3-.7t.3-.7l4.575-4.575q.3-.3.713-.287t.712.312q.275.3.288.7t-.288.7L7.85 11H19q.425 0 .713.288T20 12t-.288.713T19 13z" />
                              </svg>

                              <img v-else-if="status === 'pending'" class="size-14 lg:size-20 text-white"
                                 src="/loader.svg">
                           </button>

                           <button
                              class="absolute max-xl:bottom-10 xl:top-1/2 xl:-translate-y-1/2 right-2 lg:right-20 bg-accent-800 cursor-pointer">
                              <!-- && activeImage.next !== null -->
                              <svg v-if="status !== 'pending'" class="size-14 lg:size-20 text-white" width="32"
                                 height="32" viewBox="0 0 24 24" @click="openImage(nextImage)">
                                 <path fill="currentColor"
                                    d="M16.15 13H5q-.425 0-.712-.288T4 12t.288-.712T5 11h11.15L13.3 8.15q-.3-.3-.288-.7t.288-.7q.3-.3.713-.312t.712.287L19.3 11.3q.15.15.213.325t.062.375t-.062.375t-.213.325l-4.575 4.575q-.3.3-.712.288t-.713-.313q-.275-.3-.288-.7t.288-.7z" />
                              </svg>

                              <img v-else-if="status === 'pending'" class="size-14 lg:size-20 text-white"
                                 src="/loader.svg">
                           </button>
                        </div>
                     </Teleport>
                  </transition>
               </div>

               <div v-else-if="status === 'pending' || status === 'idle'">
                  <img class="w-full aspect-square" src="/loader.svg" alt="" />
               </div>

               <div v-else>
                  {{ error }}
               </div>

               <div v-for="item in 2" :class="item === 1 ? '-order-1 border-b' : 'mt-auto order-1 border-t'"
                  class="content-center h-(--_head-h) grid grid-cols-[1fr_3fr_1fr] items-center gap-2 overflow-hidden px-5">
                  <div class="flex items-center gap-2 cursor-pointer" @click="showFilters = !showFilters">
                     <svg class="h-6 transition-all duration-500" :class="{ 'rotate-180': !showFilters }"
                        viewBox="0 0 16 16" fill="none">
                        <path
                           d="M3.28222 7.35L8.82005 1.81408L8.9266 1.70757L8.81962 1.60149L8.10562 0.893487L7.99955 0.788315L7.89393 0.893934L0.893934 7.89393L0.787868 8L0.893934 8.10607L7.89393 15.1061L7.99955 15.2117L8.10562 15.1065L8.81962 14.3985L8.92659 14.2924L8.82006 14.1859L3.28318 8.65H15H15.15V8.5V7.5V7.35H15H3.28222Z"
                           fill="currentColor" stroke="currentColor" stroke-width="0.3" />
                     </svg>

                     <div class="self-stretch w-[2px] bg-black"></div>

                     <span class="leading-none">{{ $t(`gallery.main.${showFilters ? 'hide' : 'show'}`) }}</span>
                  </div>

                  <Pagination v-if="data?.items.length" @page-changed="page => currentPage = page" class="mx-auto"
                     :class="{ 'select-none pointer-events-none': (status === 'pending' || status === 'idle') }" v-bind="{
                        pages,
                        currentPage,
                        pagesLoading: 12
                     }" />

                  <div class="">
                     {{ activePages }}
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<style scoped>
.zoomedImage-enter-active,
.zoomedImage-leave-active {
   transition: all 400ms;
}

.zoomedImage-enter-from,
.zoomedImage-leave-to {
   opacity: 0;
   transform: scale(0);
   translate: 0 100vh;
}
</style>