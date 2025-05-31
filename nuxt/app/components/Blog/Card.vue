<script setup lang="ts">
import dateformat from 'dateformat'

defineProps<{
   post: PostList[0]
   admin?: boolean
}>()

const localPath = useLocalePath()
</script>

<template>
   <article
      class="shadow-main isolate px-8 pt-6 pb-8 relative
         [background:linear-gradient(rgba(255,255,255,.7),rgba(255,255,255,.7)),url(/img/blog/pattern1.jpg)_center_repeat]">
      <div>
         <div class="flex items-center gap-2 pb-4 text-accent-800 pl-5 pt-2 bg-white">
            <time>{{ dateformat(new Date(post.plannedAt ? post.plannedAt : post.createdAt), 'dd mmmm, yyyy') }}</time>

            <div class="self-stretch w-[1px] bg-accent-800"></div>

            <NuxtLink v-if="post.category" :to="localPath(routesList.client.posts.category(post.category.slug))"
               class="font-bold relative z-10">
               {{ post.category.nameRu }}
            </NuxtLink>
         </div>

         <div class="grid grid-cols-[2fr_5fr]">
            <div class="self-center">
               <NuxtImg v-if="post.thumbnail && post.thumbnail.path" class="aspect-square object-cover w-full"
                  :src="FS_IMAGE_SRC(post.thumbnail.path)" :alt="post.thumbnail?.alt" :title="post.thumbnail?.alt"
                  placeholder="/loader.svg" loading="lazy" />
               <svg v-else class="w-full aspect-square" viewBox="0 0 32 32">
                  <path fill="currentColor"
                     d="M30 3.414L28.586 2L2 28.586L3.414 30l2-2H26a2.003 2.003 0 0 0 2-2V5.414zM26 26H7.414l7.793-7.793l2.379 2.379a2 2 0 0 0 2.828 0L22 19l4 3.997zm0-5.832l-2.586-2.586a2 2 0 0 0-2.828 0L19 19.168l-2.377-2.377L26 7.414zM6 22v-3l5-4.997l1.373 1.374l1.416-1.416l-1.375-1.375a2 2 0 0 0-2.828 0L6 16.172V6h16V4H6a2 2 0 0 0-2 2v16z" />
               </svg>
            </div>

            <div class="flex flex-col h-full bg-white pl-6">
               <div class="flex items-center gap-3 bg-accent-800 text-white p-3 mb-10">
                  <IconsKeys class="w-auto h-20" />

                  <div class="self-stretch w-[1px] bg-white"></div>

                  <NuxtLink :to="localPath(routesList.client.posts.single(post.slug))" class="text-xl font-bold">
                     <span class="absolute inset-0"></span>

                     {{ post.title }}
                  </NuxtLink>
               </div>

               <p class="leading-6 pr-5">
                  {{ post.excerpt?.split(' ').slice(0, 80).join(' ') }} [...]
               </p>

               <div class="flex items-center gap-10 mt-auto ml-auto pb-5 pr-5">
                  <NuxtLink v-if="admin" class="mt-auto ml-auto text-lg flex items-center gap-2"
                     :to="localPath(routesList.client.admin.posts.single(post.slug, post.id))">
                     <span>Редактировать</span>

                     <svg class="h-5 w-auto shrink-0" viewBox="0 0 13 19" fill="none">
                        <path
                           d="M1.54546 0.87793L12.3145 9.87793L1.54546 18.8779L0.314454 17.8491L9.8536 9.87793L0.315613 1.90672L1.54546 0.87793Z"
                           fill="#1A1919" />
                     </svg>
                  </NuxtLink>

                  <div class="text-lg flex items-center gap-2">
                     <span>Подробнее</span>

                     <svg class="h-5 w-auto shrink-0" viewBox="0 0 13 19" fill="none">
                        <path
                           d="M1.54546 0.87793L12.3145 9.87793L1.54546 18.8779L0.314454 17.8491L9.8536 9.87793L0.315613 1.90672L1.54546 0.87793Z"
                           fill="#1A1919" />
                     </svg>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </article>
</template>

<style scoped></style>