<script setup lang="ts">
const route = useRoute()
const { data, status, error } = await useLazyFetch(routesList.api.gallery.category.list(route.params.gallery as string), {
   getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] || nuxtApp.static.data[key],
   key: `galleryCategotyList:${route.params.gallery}`
})
</script>

<template>
   <div>
      <GalleryAdminList v-if="status === 'success' && data" :items="data"
         :gallery="Array.isArray(route.params.gallery) ? route.params.gallery[0] : route.params.gallery" />
      <GalleryAdminList v-else-if="status === 'pending' || status === 'idle'" />
      <div v-else-if="status === 'error'" class="text-center text-red-500 font-bold text-lg">
         {{ `Error: ${error?.statusMessage || error?.message || error?.data?.message}` }}
      </div>
   </div>
</template>

<style scoped></style>