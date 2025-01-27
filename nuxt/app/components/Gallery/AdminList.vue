<script setup lang="ts">
defineProps<{
   items?: GalleryCategory[] | Gallery[]
   gallery?: string
}>()

const localPath = useLocalePath()
</script>

<template>
   <div class="flex flex-wrap gap-5 text-lg items-center justify-center">
      <NuxtLink class="bg-slate-200 flex-shrink-0 w-[12rem] flex items-center justify-center aspect-square capitalize
         [box-shadow:0_0_10px_1px_var(--tw-shadow-color)] shadow-red-400/70 rounded-lg
         hover:rotate-2 hover:scale-110 transition-all" v-if="items" v-for="item in items" :key="item.id" :to="gallery
            ? localPath(routesList.client.admin.gallery.category.single(gallery as string, item.name))
            : localPath(routesList.client.admin.gallery.category.list(item.name))">
         {{ item.name }}
      </NuxtLink>
      <div class="bg-slate-200 flex-shrink-0 w-[12rem] flex items-center justify-center aspect-square capitalize
         [box-shadow:0_0_10px_1px_var(--tw-shadow-color)] shadow-red-400/70 rounded-lg
         hover:rotate-2 hover:scale-110 transition-all" v-else v-for="item in 4" :key="item">
         Loading...
      </div>
   </div>
</template>

<style scoped></style>