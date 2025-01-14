<script setup lang="ts">
import { joinURL } from 'ufo'

defineProps<{
   items: GalleryItem[]
}>()
// TODO: alt locale
</script>

<template>
   <div class="w-full">
      <div class="flex overflow-x-auto">
         <NuxtImg class="w-[20rem] h-[15rem] object-cover" v-for="image in items" :src="joinURL('/fs/', image.image!)"
            :alt="image.altRu || undefined" placeholder="/loader.svg" />
      </div>
   </div>
</template>

<style scoped></style>