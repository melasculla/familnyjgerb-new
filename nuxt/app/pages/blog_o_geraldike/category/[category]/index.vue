<script setup lang="ts">
definePageMeta({
   key: route => `blog: ${route.params.category}`,
   scrollToTop: false
})

const route = useRoute()
const category = computed(() => Array.isArray(route.params.category) ? route.params.category[0] : route.params.category)
</script>

<template>
   <BlogList :category="category" />
</template>

<style scoped></style>