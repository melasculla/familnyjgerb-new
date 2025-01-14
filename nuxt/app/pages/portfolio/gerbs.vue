<script setup lang="ts">
const [
   { data: standard, status: standardStatus },
   { data: premium, status: premiumStatus },
   { data: elite, status: eliteStatus },
] = await Promise.all([
   useLazyFetch(routesList.api.gallery.category.single('gerbs', 'standard')),
   useLazyFetch(routesList.api.gallery.category.single('gerbs', 'premium')),
   useLazyFetch(routesList.api.gallery.category.single('gerbs', 'elite')),
])
</script>

<template>
   <div class="grid gap-6">
      <GalleryBlock v-if="standardStatus === 'success' && standard?.length" :items="standard">
         Standard
      </GalleryBlock>
      <GalleryBlock v-if="premiumStatus === 'success' && premium?.length" :items="premium">
         Premium
      </GalleryBlock>
      <GalleryBlock v-if="eliteStatus === 'success' && elite?.length" :items="elite">
         Elite
      </GalleryBlock>
   </div>
</template>

<style scoped></style>