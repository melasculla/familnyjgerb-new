<script setup lang="ts">
import { NuxtLink } from '#components'

const localPath = useLocalePath()

const { pages, currentPage, urlBase } = defineProps<{
   pages: number
   currentPage: number
   urlBase?: (page?: number) => string,
   pagesLoading?: number
}>()

const emit = defineEmits<{
   pageChanged: [page: number]
}>()

const pageChanged = (page: number) => {
   if (urlBase)
      return

   emit('pageChanged', page)
}

const changePageInput = async (event: Event) => {
   const target = event.target as HTMLInputElement
   const value = target.value
   if (!value.length)
      return

   const page = Number(value)
   if (
      page != null
      && !Number.isNaN(page)
      && page <= pages
      && page >= 1
      && page <= pages
   )
      urlBase ? await navigateTo(localPath(urlBase(page))) : pageChanged(page)
}
</script>

<template>
   <div>
      <!-- v-if="currentPage > pages ? true : currentPage !== 1" -->
      <div class="flex items-center gap-5">
         <component :is="urlBase ? NuxtLink : 'button'" class="text-basic-900 hover:text-basic-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all
            [&.disabled]:opacity-50 [&.disabled]:cursor-not-allowed" :disabled="currentPage === 1"
            :class="{ 'disabled': currentPage === 1 }" :aria-label="`Navaigate to page ${currentPage - 1}`"
            :to="urlBase ? ((currentPage > 1) ? localPath(urlBase(currentPage - 1)) : undefined) : undefined"
            @click="!urlBase && (currentPage > 1) && pageChanged(currentPage - 1)">
            <svg class="w-7" viewBox="0 0 24 24" fill="none">
               <path
                  d="M4.01871 12.7857L13.122 21.8874L12 23L1 12L12 1L13.122 2.11257L4.01714 11.2143H23V12.7857H4.01871Z"
                  fill="currentColor" />
               <path
                  d="M4.37936 11.0643L13.228 2.21866L13.3346 2.11214L13.2276 2.00606L12.1056 0.893487L11.9996 0.788315L11.8939 0.893934L0.893934 11.8939L0.787868 12L0.893934 12.1061L11.8939 23.1061L11.9996 23.2117L12.1056 23.1065L13.2276 21.9939L13.3346 21.8879L13.2281 21.7814L4.38089 12.9357H23H23.15V12.7857V11.2143V11.0643H23H4.37936Z"
                  stroke="currentColor" stroke-width="0.3" />
            </svg>
         </component>

         <div class="flex justify-items-center items-center gap-3">
            <div class="self-stretch mr-2 w-[2px] bg-black"></div>

            <span>
               Страница
            </span>

            <input class="min-w-14 max-w-23 py-1 px-5 bg-accent-800 text-white font-bold border border-transparent
               hover:border-accent-800 hover:bg-white hover:text-accent-800 transition-colors outline-none
               focus:bg-transparent focus:text-accent-800 focus:border-accent-800" @change="changePageInput"
               :value="currentPage">

            <span>из</span>

            <span class="font-bold">
               {{ pages }}
            </span>

            <div class="self-stretch ml-2 w-[2px] bg-black"></div>
         </div>

         <component :is="urlBase ? NuxtLink : 'button'" class="text-basic-900 hover:text-basic-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all
            [&.disabled]:opacity-50 [&.disabled]:cursor-not-allowed" :disabled="currentPage >= pages"
            :class="{ 'disabled': currentPage >= pages }" :aria-label="`Navaigate to page ${currentPage + 1}`"
            :to="urlBase ? ((currentPage < pages) ? localPath(urlBase(currentPage + 1)) : undefined) : undefined"
            @click="!urlBase && (currentPage < pages) && pageChanged(currentPage + 1)">
            <svg class="w-7" viewBox="0 0 24 24" fill="none">
               <path
                  d="M19.6206 11.0643L10.772 2.21866L10.6654 2.11214L10.7724 2.00606L11.8944 0.893487L12.0004 0.788315L12.1061 0.893934L23.1061 11.8939L23.2121 12L23.1061 12.1061L12.1061 23.1061L12.0004 23.2117L11.8944 23.1065L10.7724 21.9939L10.6654 21.8879L10.7719 21.7814L19.6191 12.9357H1H0.85V12.7857V11.2143V11.0643H1H19.6206Z"
                  fill="currentColor" stroke="currentColor" stroke-width="0.3" />
            </svg>
         </component>
      </div>
   </div>
</template>

<style scoped></style>