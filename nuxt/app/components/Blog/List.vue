<script setup lang="ts">
const { locale } = useI18n()
const { category, admin } = defineProps<{
   category?: Category['slug']
   admin?: boolean
}>()

const pageBase = category ? routesList.client.posts.categoryPage(category) : routesList.client.posts.page
const perPage = 12
const { currentPage, pages, totaItems } = usePagination(perPage, admin ? 'state' : 'page', 'blogPage', admin ? undefined : pageBase)

const statuses = ref<PostStatus[]>(['published'])
const toggleStatus = (_status: PostStatus) => {
   if (_status === 'published' && statuses.value.length === 1 && statuses.value.includes('published'))
      return

   if (statuses.value.includes(_status))
      statuses.value = statuses.value.filter(s => s !== _status)
   else
      statuses.value.push(_status)
}

const { data: posts, status, error, refresh } = await useLazyFetch<{ posts: PostList, total?: number }>(routesList.api.posts.getAll, {
   query: {
      locale: locale.value,
      category,
      perPage,
      page: currentPage,
      statuses
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
   <div>
      <div class="flex flex-wrap justify-between">
         <ButtonsMain @click="refresh()">
            Rerfresh
         </ButtonsMain>
         <div class="flex gap-4 text-base">
            <div class="flex items-center gap-2" v-for="item in postsStatusList">
               <input class="size-6" :id="`${item}-status`" type="checkbox" @change="toggleStatus(item)"
                  :checked="statuses.includes(item)"
                  :disabled="item === 'published' && statuses.length === 1 && statuses.includes('published')" />
               <label class="capitalize" :for="`${item}-status`">{{ item }}</label>
            </div>
         </div>
      </div>
      <Pagination class="mt-5" @page-changed="page => currentPage = page"
         :class="{ 'select-none pointer-events-none': (status === 'pending' || status === 'idle') }" v-bind="{
            pages,
            currentPage,
            urlBase: admin ? undefined : pageBase,
            pagesLoading: 11
         }" />
      <BlogCategories :current="category" />
      <div v-if="status === 'success' && posts" class="grid grid-cols-2 md:grid-cols-6 gap-4">
         <BlogCard v-for="post in posts.posts" :key="post.id" :post="post" :admin="admin" />
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