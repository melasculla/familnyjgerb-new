<script setup lang="ts">
const [
   { data: standard, status: standardStatus },
   { data: premium, status: premiumStatus },
   { data: elite, status: eliteStatus },
   { data: individual, status: individualStatus },
] = await Promise.all([
   useLazyFetch(routesList.api.gallery.category.single('monograms', 'standard')),
   useLazyFetch(routesList.api.gallery.category.single('monograms', 'premium')),
   useLazyFetch(routesList.api.gallery.category.single('monograms', 'elite')),
   useLazyFetch(routesList.api.gallery.category.single('monograms', 'individual')),
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
      <GalleryBlock v-if="individualStatus === 'success' && individual?.length" :items="individual">
         Individual
      </GalleryBlock>
   </div>
</template>

<style scoped></style>