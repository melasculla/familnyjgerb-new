<script setup lang="ts">
defineProps<{
   admin?: boolean
}>()

const perPage = 12
const { currentPage, pages, totaItems } = usePagination(perPage, 'state', 'projectsPage')

const { data, status, error } = await useLazyFetch<{ projects: ProjectList, total?: number }>(routesList.api.projects.getAll, {
   query: {
      locale: 'ru',
      perPage,
      page: currentPage
   },
   getCachedData: (key, nuxtApp) => {
      const data = nuxtApp.payload.data[key] || nuxtApp.static.data[key]
      if (!data)
         return

      totaItems.value = data.total
      return data
   },
   key: `ru:projects:${currentPage.value}`,
   onResponseError: ({ response, error }) => {
      if (error)
         return showError(error)
      showError({ statusCode: response.status, message: response.statusText })
   },
})

watch(data, (newProjects) => {
   if (newProjects?.total)
      totaItems.value = newProjects.total
}, { immediate: true })

useSeoMeta({
   title: 'Projects'
})
</script>

<template>
   <div>
      <Pagination class="mt-5"
         :class="{ 'select-none pointer-events-none': (status === 'pending' || status === 'idle') }" v-bind="{
            pages,
            currentPage,
            pagesLoading: 11
         }" />
      <div v-if="status === 'success' && data" class="grid grid-cols-2 md:grid-cols-6 gap-4">
         <ProjectsCard v-for="project in data.projects" :key="project.id" :project="project" :admin="admin" />
      </div>
      <div v-else-if="status === 'pending' || status === 'idle'" class="grid grid-cols-2 md:grid-cols-6 gap-4">
         <ProjectsSkeletonCard v-for="project in perPage" />
      </div>
      <div v-else-if="status === 'error'" class="text-center text-red-500 font-bold text-lg">
         {{ `Error: ${error?.statusMessage || error?.message || error?.data?.message}` }}
      </div>
   </div>
</template>

<style scoped></style>