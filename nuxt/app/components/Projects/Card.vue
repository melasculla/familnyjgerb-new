<script setup lang="ts">
import { joinURL } from 'ufo'

defineProps<{
   project: ProjectList[0]
   admin?: boolean
}>()

const localPath = useLocalePath()
</script>

<template>
   <div class="grid" :class="{ 'outline outline-purple-600': project.status === 'hidden' }">
      <NuxtLink class="text-center text-sm overflow-hidden"
         :to="admin ? localPath(routesList.client.admin.projects.single(project.slug, project.id)) : localPath(routesList.client.projects.single(project.slug))">
         <NuxtImg v-if="project.thumbnail && project.thumbnail.path" class="aspect-square object-cover w-full"
            :src="joinURL('/fs/', project.thumbnail.path)" :alt="project.thumbnail?.alt" :title="project.thumbnail?.alt"
            placeholder="/loader.svg" loading="lazy" />
         <svg v-else class="w-full aspect-square" viewBox="0 0 32 32">
            <path fill="currentColor"
               d="M30 3.414L28.586 2L2 28.586L3.414 30l2-2H26a2.003 2.003 0 0 0 2-2V5.414zM26 26H7.414l7.793-7.793l2.379 2.379a2 2 0 0 0 2.828 0L22 19l4 3.997zm0-5.832l-2.586-2.586a2 2 0 0 0-2.828 0L19 19.168l-2.377-2.377L26 7.414zM6 22v-3l5-4.997l1.373 1.374l1.416-1.416l-1.375-1.375a2 2 0 0 0-2.828 0L6 16.172V6h16V4H6a2 2 0 0 0-2 2v16z" />
         </svg>
         <span class="block truncate">{{ project.title }}</span>
      </NuxtLink>
   </div>
</template>

<style scoped></style>