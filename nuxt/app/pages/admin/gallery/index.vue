<script setup lang="ts">
const { data, status, error } = await useLazyFetch(routesList.api.gallery.list, {
   getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] || nuxtApp.static.data[key],
   key: 'galleryList'
})
</script>

<template>
   <div>
      <GalleryAdminList v-if="status === 'success' && data" :items="data" />
      <GalleryAdminList v-else-if="status === 'pending' || status === 'idle'" />
      <div v-else-if="status === 'error'" class="text-center text-red-500 font-bold text-lg">
         {{ `Error: ${error?.statusMessage || error?.message || error?.data?.message}` }}
      </div>
   </div>
</template>

<style scoped></style>