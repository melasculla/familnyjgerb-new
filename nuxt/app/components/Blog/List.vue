<script setup lang="ts">
const { category } = defineProps<{
   category?: Category['slug']
}>()

const pageBase = category ? routesList.client.posts.categoryPage(category) : routesList.client.posts.page
const perPage = 12
const { currentPage, pages, totaItems } = usePagination(perPage, 'page', 'blogPage', pageBase)

const { data: posts, status, error } = await useLazyFetch<{ posts: PostList, total?: number }>(routesList.api.posts.getAll, {
   query: {
      locale: 'ru',
      category,
      perPage,
      page: currentPage
   },
   getCachedData: (key, nuxtApp) => {
      const data = nuxtApp.payload.data[key] || nuxtApp.static.data[key]
      if (!data)
         return

      totaItems.value = data.total
      return data
   },
   key: `ru:blog_posts:${currentPage.value}:${category}`,
   onResponseError: ({ response, error }) => {
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
   <div>
      <Pagination class="mt-5"
         :class="{ 'select-none pointer-events-none': (status === 'pending' || status === 'idle') }" v-bind="{
            pages,
            currentPage,
            urlBase: pageBase,
            pagesLoading: 11
         }" />
      <BlogCategories :current="category" />
      <div v-if="status === 'success' && posts" class="grid grid-cols-2 md:grid-cols-6 gap-4">
         <BlogCard v-for="post in posts.posts" :key="post.id" :post="post" />
      </div>
      <div v-else-if="status === 'pending' || status === 'idle'" class="grid grid-cols-2 md:grid-cols-6 gap-4">
         <BlogSkeletonCard v-for="post in perPage" />
      </div>
      <div v-else-if="status === 'error'" class="text-center text-red-500 font-bold text-lg">
         {{ `Error: ${error?.statusMessage || error?.message || error?.data?.message}` }}
      </div>
   </div>
</template>

<style scoped></style>