<script setup lang="ts">
import type { Editor } from '#components'
const route = useRoute()
const { locale } = useI18n()

const { projectData } = defineProps<{
   projectData?: Project
}>()

const isEditPage = computed(() => !!projectData)

const project = reactive<NewProject>({
   id: projectData?.id,
   slug: projectData?.slug || '',
   title: projectData?.title || '',
   description: projectData?.description || null,
   content: projectData?.content || null,
   usage: projectData?.usage || null,
   sketches: projectData?.sketches || null,
   thumbnail: projectData?.thumbnail || null,
   video: projectData?.video || null,
   status: projectData?.status || 'published',
   seoKeys: projectData?.seoKeys || null,
   ogImage: projectData?.ogImage || null,
})

const usage = computed<ImageJSON[]>({
   get: () => project.usage || [],
   set: (newValue) => {
      if (!newValue || !newValue.length) {
         project.usage = null
         return []
      }

      return project.usage = [...newValue]
   }
})
const sketches = computed<ImageJSON[]>({
   get: () => project.sketches || [],
   set: (newValue) => {
      if (!newValue || !newValue.length) {
         project.sketches = null
         return []
      }

      return project.sketches = [...newValue]
   }
})
const thumbnail = computed<ImageJSON[]>({
   get: () => project.thumbnail ? [project.thumbnail] : [],
   set: (newValue: ImageJSON[]) => {
      if (!newValue || !newValue.length) {
         project.thumbnail = null
         return []
      }

      return project.thumbnail = newValue[0]
   }
})
const ogImage = computed<ImageJSON[]>({
   get: () => project.ogImage ? [{ path: project.ogImage }] : [],
   set: (newValue: ImageJSON[]) => {
      if (!newValue || !newValue.length) {
         project.ogImage = null
         return []
      }

      return project.ogImage = newValue[0]!.path
   }
})

const video = computed<ImageJSON[]>({
   get: () => project.video ? [{ path: project.video }] : [],
   set: (newValue: ImageJSON[]) => {
      if (!newValue || !newValue.length) {
         project.video = null
         return []
      }

      return project.video = newValue[0]!.path
   }
})

const errors = reactive<ProjectErrors>({
   slug: '',
   title: '',
   description: ''
})
provide(PROVIDE_KEYS.projectErrors, errors)

const editor = ref<InstanceType<typeof Editor>>()

const toast = useToast()
const loading = ref<boolean>(false)
const saveData = async () => {
   const messages = {
      loading: isEditPage.value ? 'Saving project...' : 'Creating project...',
      error: isEditPage.value ? 'Project wasn\'t saved' : 'Project wasn\'t created',
      success: isEditPage.value ? 'Project saved' : 'Project created'
   }

   loading.value = true
   const savingToast = toast.loading(messages.loading)

   let error;
   if (Object.keys(errors).some(key => error = errors[key as keyof ProjectErrors])) {
      loading.value = false
      await nextTick()
      toast.update(savingToast, {
         render: error || 'Still have some errors',
         autoClose: true,
         closeOnClick: true,
         type: 'error',
         isLoading: false
      })
      return
   }

   errors.slug = ''

   // Body updating
   project.content = await editor.value?.save()

   if (!project.ogImage)
      project.ogImage = project.thumbnail?.path
   // ./Body updating

   const result = await $fetch<{ project: Project }>(isEditPage.value ? routesList.api.projects.edit : routesList.api.projects.create, {
      method: isEditPage.value ? 'PATCH' : 'POST',
      body: project,
      query: {
         locale: locale.value
      }
   }).catch(async err => {
      if (err?.data?.statusCode === 409)
         errors.slug = 'Please user other slug'

      loading.value = false
      await nextTick()
      const zodField = (err?.data?.data?.issues && err?.data?.data?.issues[0]?.path) ? `(${err?.data?.data?.issues[0]?.path[0]}) ` : ''
      toast.update(savingToast, {
         render: zodField + (err?.data?.message || messages.error),
         autoClose: true,
         closeOnClick: true,
         type: 'error',
         isLoading: false
      })
   })

   loading.value = false
   await nextTick()
   toast.update(savingToast, {
      render: messages.success,
      autoClose: true,
      closeOnClick: true,
      type: 'success',
      isLoading: false
   })

   if ((result?.project.slug && route.params.slug) && result.project.slug !== route.params.slug)
      await navigateTo({ params: { slug: result.project.slug } })

   if (!route.params.slug && result?.project.slug)
      await navigateTo(routesList.client.admin.projects.single(result.project.slug, result.project.id))
}

useSeoMeta({
   title: () => project.title
})
</script>

<template>
   <div>
      <div class="grid gap-2 text-base">
         <UtilsTitle provide-key="projectErrors" v-model="project.title" v-model:slug="project.slug"
            :is-edit="isEditPage" />
         <UtilsDescription provide-key="projectErrors" v-model="project.description" />
         <MediaUploadFiles v-model="usage" title="Usage" multiple />
         <MediaUploadFiles v-model="sketches" title="Sketches" multiple />
         <Editor ref="editor" class="w-11/12 mx-auto" :data="project.content" />
         <div class="grid md:grid-cols-2 gap-2 lg:w-3/5 mx-auto">
            <MediaUploadFiles v-model="thumbnail" title="Thumbnail" :multiple="false" class="" />
            <MediaUploadFiles v-model="ogImage" title="OG Image" :multiple="false" class="">
               <template #inputs></template>
            </MediaUploadFiles>
         </div>
         <MediaUploadVideos v-model="video" title="Video" :multiple="false" />
         <UtilsKeys v-model="project.seoKeys" />
         <select v-model="project.status">
            <option class="capitalize" v-for="status in projectsStatusList" :value="status">{{ status }}</option>
         </select>
         <!-- <p class="mt-5">test: {{ project.ogImage }}</p> -->
         <ButtonsMain @click="saveData"
            class="w-max mx-auto text-xl mt-10 mb-5 disabled:opacity-50 disabled:cursor-not-allowed bg-green-500"
            :disabled="loading">
            {{ isEditPage ? 'Save' : 'Create' }}
         </ButtonsMain>
      </div>
   </div>
</template>

<style scoped></style>