<script setup lang="ts">
import { joinURL } from 'ufo'

const { locale } = useI18n()

defineProps<{
   items: GalleryItem[]
}>()
</script>

<template>
   <div class="w-full">
      <div class="flex overflow-x-auto">
         <NuxtImg class="w-[20rem] h-[15rem] object-cover" v-for="image in items" :src="joinURL('/fs/', image.image!)"
            :alt="image[`alt${locale.charAt(0).toUpperCase() + locale.slice(1)}` as keyof GalleryItem['altRu']] || image.altRu || undefined"
            placeholder="/loader.svg" />
      </div>
   </div>
</template>

<style scoped></style>