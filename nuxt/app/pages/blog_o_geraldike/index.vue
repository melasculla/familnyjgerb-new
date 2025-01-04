<script setup lang="ts">
const { data: posts, status, error } = await useLazyFetch('/api/posts', {
   query: {
      locale: 'ru',
      // perPage: 20,
      // page: 1
   },
   getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] || nuxtApp.static.data[key]
})
</script>

<template>
   <div>
      <div v-if="status === 'success' && posts" class="grid grid-cols-2 md:grid-cols-5 gap-4">
         <div v-for="post in posts.posts" :key="post.id" class="grid">
            <NuxtLink class="text-center text-base" :to="`/blog_o_geraldike/${post.category?.slug}/${post.slug}`">
               <NuxtImg class="aspect-square object-cover w-full" :src="'/fs/' + post.thumbnail?.path"
                  :alt="post.thumbnail?.alt" :title="post.thumbnail?.alt" placeholder="/loader.svg" loading="lazy" />
               <span v-html="post.title"></span>
            </NuxtLink>
         </div>
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