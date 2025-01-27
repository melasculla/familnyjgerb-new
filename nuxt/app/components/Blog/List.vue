<script setup lang="ts">
const { locale } = useI18n()
const { category, admin } = defineProps<{
   category?: Category['slug']
   admin?: boolean
}>()

const pageBase = category ? routesList.client.posts.categoryPage(category) : routesList.client.posts.page
const perPage = 12
const { currentPage, pages, totaItems } = usePagination(
   perPage,
   admin ? 'state' : 'page',
   category ? `blogPage:${category}` : 'blogPage',
   admin ? undefined : pageBase
)

const statuses = useState<PostStatus[]>('blog:statuses', () => [])
const showPlanned = useState<'false' | 'true' | 'only'>('blog:options:planned', () => 'false')

const { data: posts, status, error, refresh } = await useLazyFetch<{ posts: PostList, total?: number }>(routesList.api.posts.getAll, {
   query: {
      locale: locale.value,
      category,
      perPage,
      page: currentPage,
      statuses,
      options: {
         planned: showPlanned
      }
   },
   getCachedData: (key, nuxtApp) => {
      const data = nuxtApp.payload.data[key] || nuxtApp.static.data[key]
      if (!data)
         return

      totaItems.value = data.total
      return data
   },
   key: `${locale.value}:blog_posts:${currentPage.value}:${category}`,
   onResponseError: ({ response, error }) => {
      if (admin)
         return

      if (error)
         return showError(error)
      showError({ statusCode: response.status, message: response.statusText })
   },
})

watch(posts, (newPosts) => {
   if (newPosts?.total)
      totaItems.value = newPosts.total
}, { immediate: true })

useSeoMeta({
   title: 'Blog'
})
</script>

<template>
   <div class="grid gap-4">
      <div class="flex flex-wrap items-center justify-between gap-5">
         <ButtonsMain @click="refresh()">
            Rerfresh
         </ButtonsMain>
         <div class="flex flex-wrap gap-4 text-base" v-if="admin">
            <div class="flex items-center justify-center flex-wrap gap-2">
               <span class="capitalize text-slate-500">Status: </span>
               <PrimeSelectButton multiple v-model="statuses" :options="(postsStatusList as any)"
                  class="md:*:!text-base" />
            </div>
            <div class="flex items-center justify-center flex-wrap gap-2">
               <span class="capitalize text-slate-500">Planned: </span>
               <PrimeSelectButton :allowEmpty="false" v-model="showPlanned" :options="[
                  { key: 'No', value: 'false' },
                  { key: 'Yes', value: 'true' },
                  { key: 'Only', value: 'only' },
               ]" optionValue="value" optionLabel="key" class="md:*:!text-base" />
            </div>
         </div>
      </div>
      <Pagination v-if="totaItems > perPage" @page-changed="page => currentPage = page"
         :class="{ 'select-none pointer-events-none': (status === 'pending' || status === 'idle') }" v-bind="{
            pages,
            currentPage,
            urlBase: admin ? undefined : pageBase,
            pagesLoading: 11
         }" />
      <BlogCategories :current="category" :admin="admin" />
      <div v-if="status === 'success' && posts" class="grid grid-cols-2 md:grid-cols-6 gap-4">
         <BlogCard v-for="post in posts.posts" :key="post.id" :post="post" :admin="admin" />
      </div>
      <div v-else-if="status === 'pending' || status === 'idle'" class="grid grid-cols-2 md:grid-cols-6 gap-4">
         <BlogSkeletonCard v-for="post in perPage" />
      </div>
      <div v-else-if="status === 'error'" class="text-center text-red-500 font-bold text-lg">
         {{ `Error: ${error?.statusMessage || error?.message || error?.data?.message}` }}
      </div>
      <Pagination v-if="totaItems > perPage" @page-changed="page => currentPage = page"
         :class="{ 'select-none pointer-events-none': (status === 'pending' || status === 'idle') }" v-bind="{
            pages,
            currentPage,
            urlBase: admin ? undefined : pageBase,
            pagesLoading: 11
         }" />
   </div>
</template>

<style scoped></style>