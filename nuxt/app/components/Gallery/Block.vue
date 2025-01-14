<script setup lang="ts">
defineProps<{
   items: GalleryItem[]
}>()
</script>

<template>
   <div class="grid gap-4">
      <p class="text-center font-bold uppercase text-lg">
         <slot />
      </p>
      <GalleryList :items="items" />
   </div>
</template>

<style scoped></style>