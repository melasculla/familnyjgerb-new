<script setup lang="ts">
const route = useRoute()
const { locale } = useI18n()

const { data, status } = await useLazyFetch(routesList.api.projects.getSingle(route.params.slug as string), {
   query: {
      locale: locale.value
   }
})
</script>

<template>
   <div>
      <pre>{{ data }}</pre>
   </div>
</template>

<style scoped></style>