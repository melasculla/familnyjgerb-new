<script setup lang="ts">
defineProps<{
   post: PostList[0]
}>()
</script>

<template>
   <div class="grid">
      <NuxtLink class="text-center text-base" :to="`/blog_o_geraldike/${post.slug}`">
         <NuxtImg v-if="post.thumbnail && post.thumbnail.path" class="aspect-square object-cover w-full"
            :src="'/fs/' + post.thumbnail.path" :alt="post.thumbnail?.alt" :title="post.thumbnail?.alt"
            placeholder="/loader.svg" loading="lazy" />
         <svg v-else class="w-full aspect-square" viewBox="0 0 32 32">
            <path fill="currentColor"
               d="M30 3.414L28.586 2L2 28.586L3.414 30l2-2H26a2.003 2.003 0 0 0 2-2V5.414zM26 26H7.414l7.793-7.793l2.379 2.379a2 2 0 0 0 2.828 0L22 19l4 3.997zm0-5.832l-2.586-2.586a2 2 0 0 0-2.828 0L19 19.168l-2.377-2.377L26 7.414zM6 22v-3l5-4.997l1.373 1.374l1.416-1.416l-1.375-1.375a2 2 0 0 0-2.828 0L6 16.172V6h16V4H6a2 2 0 0 0-2 2v16z" />
         </svg>
         <span>{{ post.title }}</span>
      </NuxtLink>
   </div>
</template>

<style scoped></style>