<script setup lang="ts">
const route = useRoute()
const { locale } = useI18n()
const localPath = useLocalePath()

const slug = computed(() => Array.isArray(route.params.slug) ? route.params.slug[0]! : route.params.slug!)

const { data, status, error } = await useLazyFetch<{ post: Post, category: Category, prev?: string, next?: string }>(
   routesList.api.posts.getSingle(slug.value), {
   query: {
      locale: locale.value,
   },
   key: `${locale.value}:blog_posts:${slug.value}`,
   getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] || nuxtApp.static.data[key],
   onResponseError: ({ response, error }) => {
      if (error)
         return showError(error)
      showError({ statusCode: response.status, message: response.statusText })
   }
})

// const { data: related } = await useFetch<{ posts: PostList, total?: number }>(routesList.api.posts.getAll, {
//    query: {
//       locale: locale.value,
//       category: data.value?.category.slug,
//       perPage: 3,
//       page: 1,
//       options: {
//          random: true,
//          exclude: data.value?.post.id ? [data.value?.post.id] : undefined
//       }
//    },
// })

useSeoMeta({
   title: () => data.value?.post.title || null
})

// TODO: fix form /blog_o_geraldike/universalnyj-podarok-v-vide-gerba.html
// TODO: fix form /blog_o_geraldike/idei-dlya-podarka-na-23-fevralya.html
// TODO: fix form /blog_o_geraldike/podarki-na-novyj-god-monogramma-ili-gerb.html
// TODO: fix form /blog_o_geraldike/monogrammy-igra-shtrixov.html
</script>

<template>
   <div>
      <div class="flex justify-evenly sticky top-12 backdrop-blur-sm backdrop-brightness-125 bg-gray-200/80 z-20">
         <NuxtLink class="underline text-base text-purple-600 my-5 block text-center" href="/blog_o_geraldike">
            Blog
         </NuxtLink>

         <a class="underline text-base text-purple-600 my-5 block text-center" target="_blank"
            :href="routesList.api.posts.getSingle(route.params.slug as string) + '?locale=ru'">
            API
         </a>

         <a class="underline text-base text-purple-600 my-5 block text-center" target="_blank"
            :href="`https://familnyjgerb.com/${data?.category.slug}/${route.params.slug}`">
            Original
         </a>

         <NuxtLink v-if="route.params.slug && !Array.isArray(route.params.slug)"
            class="underline text-base text-purple-600 my-5 block text-center"
            :to="routesList.client.admin.posts.single(route.params.slug, data?.post.id!)">
            Edit
         </NuxtLink>
      </div>
      <div v-if="status === 'success' && data">
         <h2 class="text-center text-accent-500 font-bold text-4xl">{{ data.post.title }}</h2>

         <NuxtImg v-if="data.post.thumbnail" :src="FS_IMAGE_SRC(data.post.thumbnail.path)" class="mx-auto my-5 w-150" />

         <EditorContent :content="data.post.content" />

         <!-- <div class="mt-20">
            <p class="text-lg text-center">Read more:</p>
            <div v-if="related" class="grid grid-cols-3 gap-4 mt-4">
               <BlogCard v-for="post in related?.posts" :key="post.id" :post="post" />
            </div>
         </div> -->

         <div
            class="flex justify-between px-10 py-2 mt-5 backdrop-brightness-125 bg-gray-200/80 text-lg uppercase sticky bottom-0 w-full">
            <NuxtLink v-if="data.prev" :to="{
               params: {
                  slug: data.prev
               }
            }" class="text-teal-400">
               Prev
            </NuxtLink>

            <NuxtLink v-if="data.next" :to="{
               params: {
                  slug: data.next
               }
            }" class="text-teal-400 ml-auto">
               Next
            </NuxtLink>
         </div>
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