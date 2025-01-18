<script setup lang="ts">
const files = ref<UploadedImage[]>([])
</script>

<template>
   <div>
      <MediaUploadFiles upload v-model="files" title="Images" multiple />
   </div>
</template>

<style scoped></style>