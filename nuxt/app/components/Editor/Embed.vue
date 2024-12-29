<script setup lang="ts">
import type { OutputBlockData } from '@editorjs/editorjs';

const { block } = defineProps<{
   block: OutputBlockData['data']
}>()

const youtubeEmbedLink = new URL(block.embed)
const ytCode = youtubeEmbedLink.pathname.replace('/embed/', '')
const thumbnail = `https://i.ytimg.com/vi_webp/${ytCode}/sddefault.webp`

const isShown = ref<boolean>(false)
const iframe = ref<HTMLIFrameElement | null>(null)

const loadVideo = () => {
   isShown.value = !isShown.value
}
const handleLoadIframe = () => {
   iframe.value?.classList.remove('animate-pulse', 'loading')
}
</script>

<template>
   <div>
      <div v-if="block.service === 'youtube'" :type="block.service">
         <div class="aspect-video w-2/3 xl:w-1/2 mx-auto mb-2 rounded-md overflow-hidden">
            <div class="h-full relative cursor-pointer group" v-if="!isShown" @click.once="loadVideo">
               <NuxtImg class="w-full h-full object-cover" :alt="block.caption" :src="thumbnail" loading="lazy"
                  placeholder="/loader.svg" placeholder-class="nuxtImage-loading" />
               <svg
                  class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 filter group-hover:grayscale transition-all"
                  xmlns="http://www.w3.org/2000/svg" width="45.52" height="32" viewBox="0 0 256 180">
                  <path fill="red"
                     d="M250.346 28.075A32.18 32.18 0 0 0 227.69 5.418C207.824 0 127.87 0 127.87 0S47.912.164 28.046 5.582A32.18 32.18 0 0 0 5.39 28.24c-6.009 35.298-8.34 89.084.165 122.97a32.18 32.18 0 0 0 22.656 22.657c19.866 5.418 99.822 5.418 99.822 5.418s79.955 0 99.82-5.418a32.18 32.18 0 0 0 22.657-22.657c6.338-35.348 8.291-89.1-.164-123.134" />
                  <path fill="#FFF" d="m102.421 128.06l66.328-38.418l-66.328-38.418z" />
               </svg>
            </div>
            <!-- [&.loading]:styles -->
            <iframe v-else class="w-full h-full outline-none loading animate-pulse" :src="block.embed"
               :width="block.width" frameborder="0" allowfullscreen ref="iframe" @load="handleLoadIframe" />
         </div>
         <div class="text-center"><small class="text-sm text-gray-600 italic" v-html="block.caption" /></div>
      </div>
   </div>
</template>

<style scoped></style>