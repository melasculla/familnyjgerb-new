<script setup lang="ts">
const files = ref<UploadedFile[]>([])
const videos = ref<UploadedFile[]>([])
</script>

<template>
   <div>
      <MediaUploadFiles upload v-model="files" title="Images" multiple />
      <MediaUploadVideos upload v-model="videos" multiple class="mt-20" />
   </div>
</template>

<style scoped></style>