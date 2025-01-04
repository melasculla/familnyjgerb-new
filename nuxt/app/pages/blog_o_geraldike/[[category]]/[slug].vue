<script setup lang="ts">
const route = useRoute()
const { locale } = useI18n()
const { data, status, error } = await useLazyFetch<any>(`/api/posts/${route.params.slug}` as `/api/posts/${string}`, {
   query: {
      locale: 'ru',
   }
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
      </div>
      <div v-if="status === 'success' && data">
         <!-- <pre>{{ post }}</pre> -->
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