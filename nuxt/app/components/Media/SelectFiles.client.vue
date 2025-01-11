<script setup lang="ts">
const { multiple } = defineProps<{
   multiple?: boolean
}>()

const emit = defineEmits<{
   selected: [image: string[]]
}>()

const { perPage, currentPage, pages, totaItems } = usePagination(24, 'state', 'selectFilesPage')

let debounceTimer: NodeJS.Timeout;
const search = ({ target }: InputEvent) => {
   const title = (target as HTMLInputElement).value

   clearTimeout(debounceTimer)

   const regex = /^[^<>'"`;%$&#()]*$/
   if (!regex.test(title))
      return

   debounceTimer = setTimeout(() => {
      currentPage.value = 1
      searchParam.value = title
   }, 500)
}
const searchParam = ref<string>('')

const { data, status, refresh, error } = await useLazyFetch<{ data: string[], total: number }>(routesList.api.media.images.list, {
   query: {
      page: currentPage,
      perPage: perPage,
      searchParam
   },
   onResponse({ response }) {
      totaItems.value = response._data.total ?? response._data?.data?.total ?? 1
   }
})

const changePage = (page: number) => {
   // search.value = ''
   currentPage.value = page
}

const selectedImages = ref<string[]>([])

const select = (image: string) => emit('selected', [image])

const selectMultiple = (image: string) => {
   const isImageExists = selectedImages.value.find((_image) => image === _image)
   if (isImageExists) {
      selectedImages.value = selectedImages.value.filter((_image) => image !== _image)
   } else {
      selectedImages.value.push(image)
   }
}
</script>

<template>
   <div>
      <Pagination :pages="pages ?? null" :current-page="currentPage" :total="totaItems" @page-changed="changePage" />
      <div class="grid grid-cols-8 gap-4">
         <div class="col-span-full flex items-center gap-4">
            <svg class="max-xs:hidden size-12 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
               viewBox="0 0 24 24">
               <path fill="#888888"
                  d="M9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l5.6 5.6q.275.275.275.7t-.275.7t-.7.275t-.7-.275l-5.6-5.6q-.75.6-1.725.95T9.5 16m0-2q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14" />
            </svg>
            <input type="text" name="search" class="text-lg border border-orange-400 rounded-md px-2 py-1"
               @input="search($event as InputEvent)" placeholder="Найти фото:">
            <Button class="ml-auto" @click="refresh">
               Refresh
            </Button>
            <ButtonsSubmit class="ml-auto" v-if="multiple && selectedImages.length"
               @click="emit('selected', selectedImages)">
               Apply
            </ButtonsSubmit>
         </div>
         <div v-if="status === 'success' && data" v-for="image in data.data" :key="image"
            class="transform hover:scale-105 transition-all cursor-pointer flex items-center"
            :class="{ 'outline outline-4 outline-sky-600': selectedImages.find((_image) => _image === image) }"
            @click="multiple ? selectMultiple(image) : select(image)">
            <NuxtImg :src="'/fs/' + image" loading="lazy" class="w-full" placeholder="/loader.svg" />
         </div>
         <div v-else-if="status === 'pending' || status === 'idle'" v-for="image in 48" class="flex">
            <img src="/loader.svg" loading="lazy" class="w-full" />
         </div>
         <div v-else-if="status === 'error'"
            class="text-center text-lg text-balance text-red-600 font-semibold pt-20 px-20 col-span-full flex justify-center gap-2">
            Error: <p class="[&_span]:text-secondary"
               v-html="error?.data?.message ?? error?.statusMessage ?? error?.message"></p>
         </div>
      </div>
   </div>
</template>

<style scoped></style>