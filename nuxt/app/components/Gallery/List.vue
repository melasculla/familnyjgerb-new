<script setup lang="ts">
const { locale } = useI18n()

const { type } = defineProps<{
   type: 'gerbs' | 'monograms'
}>()

const { currentPage, pages, totaItems, perPage } = usePagination(20, 'query', 'page')
const { data, status } = await useLazyFetch(routesList.api.gallery.main, {
   query: {
      gallery: type,
      page: currentPage,
      perPage: perPage
   },
   onResponse({ response }) {
      if (response._data?.total)
         totaItems.value = response._data?.total
   }
})

const projectKey = `projectDetails${locale.value.charAt(0).toUpperCase() + locale.value.slice(1)}` as 'projectDetailsRu'
</script>

<template>
   <div class="grid grid-cols-[1fr_4fr] gap-8 px-10">
      <div class="">
         filters
      </div>

      <div class="">
         <Pagination @page-changed="page => currentPage = page"
            :class="{ 'select-none pointer-events-none': (status === 'pending' || status === 'idle') }" v-bind="{
               pages,
               currentPage,
               pagesLoading: 11
            }" />

         <div class="columns-4 gap-2 space-y-2">
            <div class="" v-for="image in data?.items">
               <NuxtImg class="w-full break-inside-avoid" :src="FS_IMAGE_SRC(image.image!)"
                  :alt="image[`alt${locale.charAt(0).toUpperCase() + locale.slice(1)}` as keyof GalleryItem['altRu']] || image.altRu || undefined"
                  placeholder="/loader.svg" />

               <div v-if="image[projectKey]" class="text-center w-full bg-accent-500 text-white py-2">
                  <NuxtLink :to="$localePath(routesList.client.projects.single(image[projectKey]!.slug))" class="">
                     Смотреть проект
                  </NuxtLink>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<style scoped></style>