<script setup lang="ts">
import type { Editor } from '#components'

const route = useRoute()
const { locale } = useI18n()

const { postData } = defineProps<{
   postData?: Post
}>()

const editedAt = computed<Date | null>({
   get: () => postData?.editedAt ? new Date(postData.editedAt) : null,
   set: () => { }
})

const { data: categories, status: categoryStatus, error } = await useLazyFetch(routesList.api.categories.getAll, {
   getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] || nuxtApp.static.data[key],
   key: 'categories'
})

const isEditPage = computed(() => !!postData)

const post = reactive<NewPost>({
   id: postData?.id,
   slug: postData?.slug || '',
   title: postData?.title || '',
   description: postData?.description || null,
   content: postData?.content || null,
   gallery: postData?.gallery || null,
   categoryId: postData?.categoryId || null,
   thumbnail: postData?.thumbnail || null,
   status: postData?.status || 'published',
   seoKeys: postData?.seoKeys || null,
   plannedAt: typeof postData?.plannedAt === 'string' ? new Date(postData?.plannedAt) : postData?.plannedAt || null,
})

const gallery = computed<ImageJSON[]>({
   get: () => post.gallery || [],
   set: (newValue) => {
      if (!newValue || !newValue.length) {
         post.gallery = null
         return []
      }

      return post.gallery = [...newValue]
   }
})
const thumbnail = computed<ImageJSON[]>({
   get: () => post.thumbnail ? [post.thumbnail] : [],
   set: (newValue: ImageJSON[]) => {
      if (!newValue || !newValue.length) {
         post.thumbnail = null
         return []
      }

      return post.thumbnail = newValue[0]
   }
})

const errors = reactive<PostErrors>({
   slug: '',
   title: '',
   description: '',
   category: ''
})
provide(PROVIDE_KEYS.postErrors, errors)

const editor = ref<InstanceType<typeof Editor>>()

const toast = useVueToast()
const loading = ref<boolean>(false)
const saveData = async () => {
   const messages = {
      loading: isEditPage.value ? 'Saving post...' : 'Creating post...',
      error: isEditPage.value ? 'Post wasn\'t saved' : 'Post wasn\'t created',
      success: isEditPage.value ? 'Post saved' : 'Post created'
   }

   loading.value = true
   const savingToast = toast.loading(messages.loading)

   validateFields()

   let error;
   if (Object.keys(errors).some(key => error = errors[key as keyof PostErrors])) {
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
   post.content = await editor.value?.save()
   // ./Body updating

   const result = await $fetch<{ post: Post }>(isEditPage.value ? routesList.api.posts.edit : routesList.api.posts.create, {
      method: isEditPage.value ? 'PATCH' : 'POST',
      body: post,
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

   if ((result?.post.slug && route.params.slug) && result.post.slug !== route.params.slug)
      await navigateTo({ params: { slug: result.post.slug } })

   if (!route.params.slug && result?.post.slug)
      await navigateTo(routesList.client.admin.posts.single(result.post.slug, result.post.id))
}

const validateFields = () => {
   errors.category = ''

   if (!post.categoryId)
      errors.category = 'Cannot be empty'
}

useSeoMeta({
   title: () => post.title || 'New Post'
})
</script>

<template>
   <div>
      <div class="grid gap-6 xl:grid-cols-[1fr_minmax(200px,350px)] text-base items-start max-md:px-2">
         <div class="grid gap-10">
            <div class="grid gap-6 grid-cols-1 md:grid-cols-2 justify-between">
               <UtilsTitle class="md:contents md:[&_p]:mt-0 [&_input[type='text']]:w-full" provide-key="postErrors"
                  v-model="post.title" v-model:slug="post.slug" :is-edit="isEditPage" />
               <UtilsDescription class="[&_input[type='text']]:w-full" provide-key="postErrors"
                  v-model="post.description" />
            </div>
            <Editor ref="editor" :data="post.content" />
            <MediaUploadFiles v-model="gallery" title="gallery" multiple />
         </div>
         <div class="grid gap-6 xl:gap-10 content-start justify-items-center sticky top-2 max-xl:pb-5">
            <ButtonsMain @click="saveData" :disabled="loading"
               class="max-xl:order-10 w-full justify-center text-xl disabled:opacity-50 disabled:cursor-not-allowed bg-green-500 sticky top-2 z-10">
               {{ isEditPage ? 'Save' : 'Create' }}
            </ButtonsMain>
            <div class="max-xl:order-9 w-full grid grid-cols-2 gap-4">
               <div v-if="categoryStatus !== 'error'">
                  <PrimeSelect v-model="post.categoryId" class="w-full" :options="(categories as any)"
                     :placeholder="(categoryStatus === 'pending' || categoryStatus === 'idle' || !categories) ? 'Loading...' : 'Category'"
                     :loading="categoryStatus === 'pending' || categoryStatus === 'idle' || !categories"
                     :option-label="`name${locale.charAt(0).toUpperCase() + locale.slice(1)}` || 'nameRu'"
                     option-value="id" :invalid="!post.categoryId" />
                  <UtilsError v-if="errors.category" :error="errors.category" />
               </div>
               <div v-else class="text-center text-red-500 font-bold text-lg">
                  {{ `Error: ${error?.statusMessage || error?.message || error?.data?.message}` }}
               </div>
               <PrimeSelect v-model="post.status" :options="(postsStatusList as any)" />
            </div>
            <div class="w-full max-xl:order-8 grid gap-2">
               <template v-if="editedAt">
                  <p class="text-gray-400">Edited Date:</p>
                  <PrimeDatePicker v-model="editedAt" showTime dateFormat="dd/mm/yy" hourFormat="24" fluid
                     class="[&_input]:text-base" disabled />
               </template>
               <div class="flex flex-wrap justify-between gap-2">
                  <p class="text-gray-400">Planned Date:</p>
                  <span class="cursor-pointer" @click="post.plannedAt = null">Reset</span>
               </div>
               <PrimeDatePicker v-model="post.plannedAt" showTime dateFormat="dd/mm/yy" hourFormat="24" fluid
                  class="[&_input]:text-base" />
            </div>
            <MediaUploadFiles v-model="thumbnail" title="Thumbnail" :multiple="false" input-static />
            <UtilsKeys v-model="post.seoKeys" />
         </div>
      </div>
   </div>
</template>

<style scoped>
:deep(input) {
   min-width: 0;
}
</style>