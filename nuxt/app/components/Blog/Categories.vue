<script setup lang="ts">
defineProps<{
   current?: string
}>()

const { data: categoties, status, error } = await useLazyFetch(routesList.api.categories.getAll, {
   getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] || nuxtApp.static.data[key],
   key: 'categories'
})
</script>

<template>
   <div>
      <div v-if="status === 'success' && categoties" class="flex flex-wrap gap-4 justify-between text-center my-8 px-5 text-base">
         <NuxtLink v-if="current" :to="routesList.client.posts.list">
            Blog
         </NuxtLink>
         <template v-for="category in categoties" :key="category.id">
            <NuxtLink :to="routesList.client.posts.category(category.slug)"
               :class="{ 'outline outline-1 outline-offset-4 outline-orange-500': current === category.slug }">
               {{ category.nameRu }}
            </NuxtLink>
         </template>
      </div>
      <div v-else-if="status === 'pending' || status === 'idle'">
         Loading
      </div>
      <div v-else-if="status === 'error'" class="text-center text-red-500 font-bold text-lg">
         {{ `Error: ${error?.statusMessage || error?.message || error?.data?.message}` }}
      </div>
   </div>
</template>