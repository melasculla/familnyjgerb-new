<script setup lang="ts">
import type { OutputBlockData } from '@editorjs/editorjs';
import { joinURL } from 'ufo'

const { block, child } = defineProps<{
   block: OutputBlockData['data']
   child?: boolean
}>()

const imageProps = computed(() => {
   const classList = ref<string>('')
   classList.value += block.withBorder ? ' border-2' : ''
   classList.value += block.stretched ? ' w-full' : ''
   classList.value += block.withBackground ? ' bg-red-600' : ''

   return classList.value
      ? classList.value
      : (child ? 'w-full' : 'w-full sm:w-1/2 2xl:w-2/5 mx-auto') // h-full object-cover
})

const zoomed = ref<boolean>(false)
const closeListener = (e: KeyboardEvent) => {
   if (e.key !== 'Escape')
      return

   window.removeEventListener('keydown', closeListener)
   zoomed.value = false
}
const zoom = (e: MouseEvent) => {
   const image = e.target as HTMLImageElement
   if (!image || !image.src)
      return

   zoomed.value = true
   window.addEventListener('keydown', closeListener)
}
</script>

<template>
   <div class="image grid items-center">
      <transition name="zoomedImage">
         <div v-if="zoomed" class="fixed z-[100] inset-0 w-full h-full backdrop-blur-md transition-all"
            @click="zoomed = false">
            <NuxtImg :src="block.file?.url?.includes('http') ? block.file.url : joinURL('/fs/', block.file.url)"
               placeholder="/loader.svg" class="size-full object-contain" />
         </div>
      </transition>

      <NuxtImg @click="zoom" v-if="!block.file?.url?.includes('http')" :src="joinURL('/fs/', block.file.url)"
         :alt="block.caption" :title="block.caption" class="cursor-pointer" :class="imageProps"
         :format="block.file.url?.split('.')?.pop() !== 'gif' ? 'webp' : undefined" placeholder="/loader.svg" />
      <img @click="zoom" v-else :src="block.file?.url" :alt="block.caption" class="cursor-pointer" :class="imageProps">
   </div>
</template>

<style scoped>
.zoomedImage-enter-active,
.zoomedImage-leave-active {
   transition: all 400ms;
}

.zoomedImage-enter-from,
.zoomedImage-leave-to {
   opacity: 0;
   transform: scale(0);
   translate: 0 100vh;
}
</style>