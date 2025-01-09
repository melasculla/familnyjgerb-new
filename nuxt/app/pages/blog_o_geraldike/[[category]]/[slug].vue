<script setup lang="ts">
const route = useRoute()
const { locale } = useI18n()
const { data, status, error } = await useLazyFetch<{ post: Post, category: Category }>(
   routesList.api.posts.getSingle(Array.isArray(route.params.slug) ? route.params.slug[0]! : route.params.slug!),
   {
      query: {
         locale: 'ru',
      }
   }
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
            :href="`/api/posts/${route.params.slug}?locale=ru`">
            API
         </a>
         <a class="underline text-base text-purple-600 my-5 block text-center" target="_blank"
            :href="`https://familnyjgerb.com/${route.params.category}/${route.params.slug}`">
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
      </div>
      <div v-else-if="status === 'pending'">
         Loading
      </div>
      <div v-else-if="status === 'error'">
         {{ `Error: ${error?.message}` }}
      </div>
   </div>
</template>

<style scoped></style>