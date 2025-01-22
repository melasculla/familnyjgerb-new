<script setup lang="ts">
import { joinURL } from 'ufo'

const { multiple, video } = defineProps<{
   multiple?: boolean
   video?: boolean
}>()

const emit = defineEmits<{
   selected: [string[]]
}>()

const { perPage, currentPage, pages, totaItems } = usePagination(32, 'state', 'selectFilesPage')

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

const folder = ref<string | null>(null)
const { data: folders } = await useLazyFetch<{ data: string[] }>(routesList.api.media.list, {
   query: {
      options: { folders: true }
   }
})

const depth = ref<boolean>(false)
const { data, status, refresh, error } = await useLazyFetch<{ data: string[], total: number, folders?: string[] }>(
   () => folder.value ? routesList.api.media.match(folder.value) : routesList.api.media.list, {
   query: {
      page: currentPage,
      perPage: perPage,
      searchParam: searchParam,
      options: { depth, types: video ? ['webm, mp4'] : ['webp', 'jpg', 'png', 'jpeg', 'gif'] }
   },
   onResponse({ response }) {
      totaItems.value = response._data.total ?? response._data?.data?.total ?? 1
   }
})

const changePage = (page: number) => currentPage.value = page

const selectedFiles = ref<string[]>([])
const selectMultiple = (file: string) => {
   const isFileExists = selectedFiles.value.find(_file => file === _file)
   if (isFileExists) {
      selectedFiles.value = selectedFiles.value.filter(_file => file !== _file)
   } else {
      selectedFiles.value.push(file)
   }

   if (!multiple)
      emit('selected', selectedFiles.value)
}
</script>

<template>
   <div class="py-2">
      <div class="grid grid-cols-[120px,1fr,120px] items-start gap-5 px-2">
         <input type="text" pattern="[0-9]" class="text-sm border border-orange-400 rounded-md px-2 py-1"
            @change="(event) => currentPage = parseInt((event.target as HTMLInputElement).value) || 1"
            placeholder="Страница:">
         <Pagination class="col-start-2" :pages="pages ?? null" :current-page="currentPage" :total="totaItems"
            @page-changed="changePage" />
         <div class="uppercase text-lg flex items-center gap-2">
            <p>DEPTH:</p>
            <input type="checkbox" v-model="depth" class="size-10" title="Depth">
         </div>
      </div>
      <div class="grid grid-cols-2 xs:grid-cols-3 gap-4 px-2" :class="{ 'sm:grid-cols-5 lg:grid-cols-8': !video }">
         <div class="col-span-full flex items-center gap-4 max-w-full flex-wrap">
            <div class="flex-shrink-0 flex gap-2">
               <svg class="max-xs:hidden size-12" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                  viewBox="0 0 24 24">
                  <path fill="#888888"
                     d="M9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l5.6 5.6q.275.275.275.7t-.275.7t-.7.275t-.7-.275l-5.6-5.6q-.75.6-1.725.95T9.5 16m0-2q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14" />
               </svg>
               <input type="text" name="search" class="text-lg border border-orange-400 rounded-md px-2 py-1 flex-1"
                  @input="search($event as InputEvent)" placeholder="Найти:">
            </div>
            <select name="search" v-model="folder"
               class="text-lg flex-1 min-w-0 border border-orange-400 rounded-md px-2 py-1">
               <option :value="null" :selected="folder == null" :disabled="!folder">Выбрать папку</option>
               <option v-for="item in folders?.data" :value="item">{{ item }}</option>
            </select>
            <button class="uppercase text-lg px-4 py-2 bg-green-400 border-none outline-none rounded-md ml-auto"
               @click="refresh()" type="button">
               Refresh
            </button>
            <button class="uppercase text-lg px-4 py-2 bg-teal-500 border-none outline-none rounded-md ml-auto"
               v-if="multiple && selectedFiles.length" @click="emit('selected', selectedFiles)" type="button">
               Apply
            </button>
         </div>
         <div v-if="status === 'success' && data" v-for="file in data.data" :key="file"
            class="transform hover:scale-105 transition-all cursor-pointer flex items-center"
            :class="{ 'outline outline-4 outline-sky-600': selectedFiles.find((_file) => _file === file), 'outline outline-1 outline-red-300 p-10': video }"
            @click="selectMultiple(file)">
            <NuxtImg v-if="!video" :src="joinURL('/fs/', file)" loading="lazy" class="w-full"
               placeholder="/loader.svg" />
            <video v-else controls preload="metadata">
               <source :src="routesList.api.media.getFile(file)">
            </video>
         </div>
         <div v-else-if="status === 'pending' || status === 'idle'" v-for="file in 48" class="flex">
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