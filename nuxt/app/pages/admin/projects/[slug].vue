<script setup lang="ts">
const route = useRoute()
const { locale } = useI18n()
const { data, status, error } = await useLazyFetch<{ project: Project }>(
   routesList.api.projects.getSingle(Array.isArray(route.params.slug) ? route.params.slug[0]! : route.params.slug!),
   {
      query: {
         locale: 'ru',
      }
   }
)

const project = reactive<NewProject>(data.value?.project || {
   slug: '',
   title: '',
   description: null,
   content: null,
   usage: null,
   sketches: null,
   thumbnail: null,
   video: null,
   status: 'published',
   seoKeys: null,
   ogImage: null,
})

const usage = computed<ImageJSON[]>({
   get: () => project.usage || [],
   set: (newValue) => {
      if (!newValue || !newValue.length) {
         project.usage = null
         return []
      }

      let newArray: ImageJSON[] = []
      if (project.usage) {
         newArray.push(...project.usage)
         newArray.unshift(...newValue)
      }

      return project.usage = newArray
   }
})
// TODO: handle duplicates
const sketches = computed<ImageJSON[]>({
   get: () => project.sketches || [],
   set: (newValue) => {
      if (!newValue || !newValue.length) {
         project.sketches = null
         return []
      }

      let newArray: ImageJSON[] = []
      if (project.sketches) {
         newArray.push(...project.sketches)
         newArray.unshift(...newValue)
      }

      project.sketches = newArray
      return newArray
   }
})

useSeoMeta({
   title: () => data.value?.project.title || 'Project'
})
</script>

<template>
   <div>
      <pre class="mb-5">{{ project }}</pre>
      <div v-if="status === 'success' && data" class="grid gap-2 text-base">
         <UtilsTitle v-model="project.title" v-model:slug="project.slug" />
         <UtilsDescription v-model="project.description" />
         <MediaUploadFiles v-model="usage" title="Usage" multiple />
         <MediaUploadFiles v-model="sketches" title="Sketches" multiple />
         <Editor class="w-11/12 mx-auto" :data="data.project.content" />
      </div>
      <div v-else-if="status === 'pending' || status === 'idle'">
         Loading
      </div>
      <div v-else-if="status === 'error'" class="text-center text-red-500 font-bold text-lg">
         {{ `Error: ${error?.statusMessage || error?.message || error?.data?.message}` }}
      </div>
   </div>
</template>

<style scoped></style>