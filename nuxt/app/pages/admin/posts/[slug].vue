<script setup lang="ts">
const route = useRoute()
const { locale } = useI18n()
const { data, status, error } = await useLazyFetch<any>(
   routesList.api.posts.getSingle(Array.isArray(route.params.slug) ? route.params.slug[0]! : route.params.slug!),
   {
      query: {
         locale: 'ru',
      }
   }
)

useSeoMeta({
   title: () => data.value?.post.title
})
</script>

<template>
   <div>
      <div v-if="status === 'success' && data">
         <Editor class="w-11/12 mx-auto" :data="data.post.content" />
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