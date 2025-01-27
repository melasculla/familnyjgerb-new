<script setup lang="ts">
const localPath = useLocalePath()

const { pages, urlBase } = defineProps<{
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

const nuxtLinkComponent = resolveComponent('NuxtLink')
</script>

<template>
   <div>
      <!-- v-if="currentPage > pages ? true : currentPage !== 1" -->
      <div class="flex flex-wrap gap-4 justify-center mb-2">
         <component :is="urlBase ? nuxtLinkComponent : 'button'" v-if="currentPage > 5"
            class="border leading-none rounded-[50%] size-10 grid place-items-center cursor-pointer transition-colors"
            :aria-label="`Navaigate to page ${currentPage - 5}`" :to="urlBase && localPath(urlBase(currentPage - 5))"
            @click="!urlBase && pageChanged(currentPage - 5)">
            &lt;&lt;
         </component>
         <component :is="urlBase ? nuxtLinkComponent : 'button'" v-if="currentPage > 1"
            class="border leading-none rounded-[50%] size-10 grid place-items-center cursor-pointer transition-colors"
            :aria-label="`Navaigate to page ${currentPage - 1}`" :to="urlBase && localPath(urlBase(currentPage - 1))"
            @click="!urlBase && pageChanged(currentPage - 1)">
            &lt;
         </component>
         <template v-if="pages" v-for="page in pages" :key="page">
            <template v-if="(currentPage + 4 >= page && currentPage - 4 <= page) || page === 1 || page === pages">
               <p v-if="page === pages && pages - 6 >= currentPage" class="self-end">......</p>
               <component :is="urlBase ? nuxtLinkComponent : 'button'"
                  class="border leading-none rounded-[50%] size-10 grid place-items-center cursor-pointer transition-colors"
                  :class="currentPage == page ? 'border-orange-400 text-orange-400' : 'border-gray-500'"
                  :aria-label="`Navaigate to page ${page}`" :to="urlBase && localPath(urlBase(page !== 1 ? page : undefined))"
                  @click="!urlBase && pageChanged(page)">
                  {{ page }}
               </component>
               <p v-if="page === 1 && page + 6 <= currentPage" class="self-end">......</p>
            </template>
         </template>
         <component :is="urlBase ? nuxtLinkComponent : 'button'" v-if="currentPage <= pages - 1"
            class="border leading-none rounded-[50%] size-10 grid place-items-center cursor-pointer transition-colors"
            :aria-label="`Navaigate to page ${currentPage + 1}`" :to="urlBase && localPath(urlBase(currentPage + 1))"
            @click="!urlBase && pageChanged(currentPage + 1)">
            &gt;
         </component>
         <component :is="urlBase ? nuxtLinkComponent : 'button'" v-if="currentPage < pages - 5"
            class="border leading-none rounded-[50%] size-10 grid place-items-center cursor-pointer transition-colors"
            :aria-label="`Navaigate to page ${currentPage + 5}`" :to="urlBase && localPath(urlBase(currentPage + 5))"
            @click="!urlBase && pageChanged(currentPage + 5)">
            &gt;&gt;
         </component>


         <button v-if="!pages" v-for="page in pagesLoading || 10"
            class="border leading-none rounded-[50%] size-10 grid place-items-center cursor-pointer transition-colors">
            {{ page }}
         </button>
      </div>
   </div>
</template>

<style scoped></style>