<script setup lang="ts">
defineProps<{
   path: string
   alt?: string
   text?: string
}>()
</script>

<template>
   <div>
      <NuxtImg class="w-full" :src="path" :alt="alt" loading="lazy" placeholder="/loader.svg" />

      <div class="border-b border-x border-primary-500 text-center">
         <p v-if="text" class="p-4 font-bold">{{ text }}</p>
      </div>
   </div>
</template>

<style scoped></style>