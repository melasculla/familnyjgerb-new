<script setup lang="ts">
import dateFormat, { i18n } from 'dateformat'

const { locale } = useI18n()
const localPath = useLocalePath()

i18n.monthNames = locale.value === 'ru'
   ? [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
      'Января',
      'Февраля',
      'Марта',
      'Апреля',
      'Мая',
      'Июня',
      'Июля',
      'Августа',
      'сентября',
      'Октября',
      'Ноября',
      'Декабря',
   ]
   : [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
   ]

const { data: posts, status, error } = await useLazyFetch<{ posts: PostList, total?: number }>(routesList.api.posts.getAll, {
   query: {
      locale: locale.value,
      perPage: 3,
      page: 1,
   },
   key: `${locale.value}:blog_posts:latest`,
   getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] || nuxtApp.static.data[key],
})

const { data: postsHeraldry, status: statusHeraldry, error: errorHeraldry } = await useLazyFetch<{ posts: PostList, total?: number }>(routesList.api.posts.getAll, {
   query: {
      locale: locale.value,
      perPage: 10,
      page: 1,
      category: 'geraldika-v-zhizni'
   },
   getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] || nuxtApp.static.data[key],
   key: `${locale.value}:blog_posts:latest:geraldika-v-zhizni`,
})
</script>

<template>
   <div class="grid gap-10 shadow-secondary px-4 py-2 h-[92svh] overflow-y-auto sticky top-15 overscroll-contain
      [&_.title-hover]:hover:bg-clip-text [&_.title-hover]:hover:text-transparent [&_.title-hover]:hover:gradient-gold
      [&_.title-hover]:transition-all">
      <Line icon="main" size="small" full sides="small-lily" color="gradient-gold" />

      <Socials />

      <div class="">
         <div class="text-center">
            <NuxtLink class="uppercase title-hover" :to="localPath(routesList.client.posts.list)">
               Блог о геральдике
            </NuxtLink>
         </div>

         <Line icon="stars" size="small" full color="gradient-gold" class="mb-4" />

         <BlogCategories
            class="grid gap-2! justify-stretch [&_a]:border-b [&_a]:border-accent-800 [&_a]:border-dashed [&_a]:pb-1"
            :current="($route.params.category as string)" />
      </div>

      <div class="">
         <div class="text-center">
            <NuxtLink class="uppercase title-hover"
               :to="localPath(routesList.client.posts.category('geraldika-v-zhizni'))">
               Геральдика в жизни
            </NuxtLink>
         </div>

         <Line icon="stars" size="small" full color="gradient-gold" class="mb-4" />

         <TheSlider v-if="postsHeraldry?.posts" :data="postsHeraldry?.posts.filter(item => item.thumbnail).map(item => ({
            path: item.thumbnail!.path,
            alt: item.thumbnail!.alt
         }))" :config="{ itemsToShow: 1, autoplay: 3000, wrapAround: true }" v-slot="{ path, alt, ssr }" aspect="1/1">
            <NuxtImg class="aspect-square object-cover w-full" :src="FS_IMAGE_SRC(path)" :alt="alt"
               :placeholder="ssr ? undefined : '/loader.svg'" loading="lazy" />
            <!-- <IconsNoImage v-else class="aspect-square w-full" /> -->
         </TheSlider>
      </div>

      <div class="">
         <div class="text-center">
            <NuxtLink class="uppercase text-center title-hover" :to="localPath(routesList.client.static.reviews)">
               Отзывы
            </NuxtLink>
         </div>

         <Line icon="stars" size="small" full color="gradient-gold" class="mb-4" />

         <TheSlider v-if="postsHeraldry?.posts" :data="10" :config="{ itemsToShow: 1, autoplay: 3000 }"
            v-slot="{ path, alt }" aspect="1/1">
            <IconsNoImage class="aspect-square object-cover w-full" />
         </TheSlider>
      </div>

      <div class="">
         <div class="text-center">
            <NuxtLink class="uppercase text-center title-hover" :to="localPath(routesList.client.posts.list)">
               Стати блога
            </NuxtLink>
         </div>

         <Line icon="stars" size="small" full color="gradient-gold" class="mb-4" />

         <div class="grid gap-4 *:border-b *:border-accent-800 *:border-dashed *:pb-3">
            <div v-for="post in posts?.posts" class="grid gap-2 text-center">
               <NuxtLink class="title-hover" :to="routesList.client.posts.single(post.slug)">{{ post.title }}</NuxtLink>

               <NuxtLink :to="routesList.client.posts.single(post.slug)" class="block w-10/12 mx-auto my-1">
                  <NuxtImg v-if="post.thumbnail" class="w-full" :src="FS_IMAGE_SRC(post.thumbnail.path)"
                     :alt="post.thumbnail.alt" loading="lazy" />
                  <IconsNoImage v-else class="w-full" />
               </NuxtLink>

               <p>{{ dateFormat(new Date(post.createdAt), 'dd mmmm, yyyy') }}</p>

               <NuxtLink v-if="post.category" :to="routesList.client.posts.category(post.category.slug)"
                  class="text-accent-800">
                  {{ post.category[`name${locale.charAt(0).toUpperCase() + locale.slice(1)}` as 'nameRu'] }}
               </NuxtLink>
            </div>
         </div>
      </div>

      <Line icon="main" size="small" full sides="small-lily" color="gradient-gold" />
   </div>
</template>

<style scoped></style>