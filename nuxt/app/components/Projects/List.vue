<script setup lang="ts">
defineProps<{
   admin?: boolean
}>()

const { locale } = useI18n()

const perPage = 12
const { currentPage, pages, totaItems } = usePagination(perPage, 'state', 'projectsPage')

const statuses = ref<ProjectStatus[]>(['published'])
const toggleStatus = (_status: ProjectStatus) => {
   if (_status === 'published' && statuses.value.length === 1 && statuses.value.includes('published'))
      return

   if (statuses.value.includes(_status))
      statuses.value = statuses.value.filter(s => s !== _status)
   else
      statuses.value.push(_status)
}

const { data, status, error, refresh } = await useLazyFetch<{ projects: ProjectList, total?: number }>(routesList.api.projects.getAll, {
   query: {
      locale,
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
      <div class="flex flex-wrap justify-between">
         <ButtonsMain @click="refresh()">
            Rerfresh
         </ButtonsMain>
         <div class="flex gap-4 text-base">
            <div class="flex items-center gap-2" v-for="item in projectsStatusList">
               <input class="size-6" :id="`${item}-status`" type="checkbox" @change="toggleStatus(item)"
                  :checked="statuses.includes(item)"
                  :disabled="item === 'published' && statuses.length === 1 && statuses.includes('published')" />
               <label class="capitalize" :for="`${item}-status`">{{ item }}</label>
            </div>
         </div>
      </div>
      <Pagination class="mt-5" v-if="totaItems"
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