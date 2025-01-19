<script setup lang="ts">
const route = useRoute()
const { locale } = useI18n()
const slug = computed(() => Array.isArray(route.params.slug) ? route.params.slug[0]! : route.params.slug!)
const { data, status, error } = await useLazyFetch<{ post: Post, category: Category, prev?: string, next?: string }>(
   routesList.api.posts.getSingle(slug.value),
   {
      query: {
         locale,
      },
      getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] || nuxtApp.static.data[key],
      key: `${locale.value}:blog_posts:${slug.value}`
   },
)

useSeoMeta({
   title: () => data.value?.post.title || null
})
</script>

<template>
   <div>
      <div class="flex justify-evenly sticky top-0 backdrop-blur-sm backdrop-brightness-125 bg-gray-200/80">
         <NuxtLink class="underline text-base text-purple-600 my-5 block text-center" href="/blog_o_geraldike">
            Blog
         </NuxtLink>
         <a class="underline text-base text-purple-600 my-5 block text-center" target="_blank"
            :href="routesList.api.posts.getSingle(route.params.slug as string) + '?locale=ru'">
            API
         </a>
         <a class="underline text-base text-purple-600 my-5 block text-center" target="_blank"
            :href="`https://familnyjgerb.com/${data?.category.slug}/${route.params.slug}`">
            Original
         </a>
         <NuxtLink v-if="route.params.slug && !Array.isArray(route.params.slug)"
            class="underline text-base text-purple-600 my-5 block text-center"
            :href="routesList.client.admin.posts.single(route.params.slug)">
            Edit
         </NuxtLink>
      </div>
      <div v-if="status === 'success' && data">
         <EditorContent :content="data.post.content" />
         <div
            class="flex justify-between px-10 py-2 mt-5 backdrop-brightness-125 bg-gray-200/80 text-lg uppercase sticky bottom-0 w-full">
            <NuxtLink v-if="data.prev" :to="data.prev" class="text-teal-400">
               Prev
            </NuxtLink>
            <NuxtLink v-if="data.next" :to="data.next" class="text-teal-400 ml-auto">
               Next
            </NuxtLink>
         </div>
      </div>
      <div v-else-if="status === 'pending' || status === 'idle'">
         Loading
      </div>
      <div v-else-if="status === 'error'" class="text-center text-red-500 font-bold text-lg">
         {{ `Error: ${error?.statusMessage || error?.message || error?.data?.message}` }}
      </div>
   </div>
</template>

<style scoped></style>