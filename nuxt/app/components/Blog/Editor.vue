<script setup lang="ts">
import type { Editor } from '#components'
const route = useRoute()
const { locale } = useI18n()

const { postData } = defineProps<{
   postData?: Post
}>()

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
   plannedAt: postData?.plannedAt || null,
})

// TODO: fetch category list and make selection for that

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
   description: ''
})
provide(PROVIDE_KEYS.postErrors, errors)

const editor = ref<InstanceType<typeof Editor>>()

const toast = useToast()
const loading = ref<boolean>(false)
const saveData = async () => {
   const messages = {
      loading: isEditPage.value ? 'Saving post...' : 'Creating post...',
      error: isEditPage.value ? 'Post wasn\'t saved' : 'Post wasn\'t created',
      success: isEditPage.value ? 'Post saved' : 'Post created'
   }

   loading.value = true
   const savingToast = toast.loading(messages.loading)

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

useSeoMeta({
   title: () => post.title
})
</script>

<template>
   <div>
      <div class="grid gap-2 text-base">
         <UtilsTitle provide-key="postErrors" v-model="post.title" v-model:slug="post.slug" :is-edit="isEditPage" />
         <UtilsDescription provide-key="postErrors" v-model="post.description" />
         <MediaUploadFiles v-model="gallery" title="gallery" multiple />
         <Editor ref="editor" class="w-11/12 mx-auto" :data="post.content" />
         <MediaUploadFiles v-model="thumbnail" title="Thumbnail" :multiple="false" class="" />
         <UtilsKeys v-model="post.seoKeys" />
         <select v-model="post.status">
            <option class="capitalize" v-for="status in postsStatusList" :value="status">{{ status }}</option>
         </select>
         <ButtonsMain @click="saveData"
            class="w-max mx-auto text-xl mt-10 mb-5 disabled:opacity-50 disabled:cursor-not-allowed bg-green-500"
            :disabled="loading">
            {{ isEditPage ? 'Save' : 'Create' }}
         </ButtonsMain>
      </div>
   </div>
</template>

<style scoped></style>