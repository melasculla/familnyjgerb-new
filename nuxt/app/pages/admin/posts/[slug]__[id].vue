<script setup lang="ts">
const route = useRoute()
const { locale } = useI18n()

const { data, status, error } = await useLazyFetch<{ post: Post }>(
   routesList.api.posts.getSingle(Array.isArray(route.params.slug) ? route.params.slug[0]! : route.params.slug!), {
   query: {
      locale: locale.value,
   }
})

definePageMeta({
   key: route => route.path.replace(route.params.slug as string + '__', '')
})
</script>

<template>
   <div>
      <div v-if="status === 'success' && data">
         <BlogEditor :post-data="data.post" />
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