<script setup lang="ts">
const { admin } = defineProps<{
   admin?: boolean
}>()

const { locale } = useI18n()

const perPage = 12
const { currentPage, pages, totaItems } = usePagination(perPage, 'state', 'projectsPage')

const statuses = useState<ProjectStatus[]>('projects:statuses', () => [])

const { data, status, error, refresh } = await useLazyFetch<{ projects: ProjectList, total?: number }>(routesList.api.projects.getAll, {
   query: {
      locale: locale.value,
      perPage,
      page: currentPage,
      statuses
   },
   getCachedData: (key, nuxtApp) => {
      const data = nuxtApp.payload.data[key] || nuxtApp.static.data[key]
      if (!data)
         return

      totaItems.value = data.total
      return data
   },
   key: `${locale.value}:projects:${currentPage.value}`,
   onResponseError: ({ response, error }) => {
      if (admin)
         return

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
   <div class="grid gap-4">
      <div class="flex flex-wrap items-center justify-between gap-5">
         <ButtonsMain @click="refresh()">
            Rerfresh
         </ButtonsMain>
         <div class="flex gap-4 text-base" v-if="admin">
            <div class="flex items-center justify-center flex-wrap gap-2">
               <span class="capitalize text-slate-500">Status: </span>
               <PrimeSelectButton multiple v-model="statuses" :options="(projectsStatusList as any)"
                  class="md:*:!text-base" />
            </div>
         </div>
      </div>
      <Pagination v-if="totaItems > perPage" @page-changed="page => currentPage = page"
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