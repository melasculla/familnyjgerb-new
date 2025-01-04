<script setup lang="ts">
import type { OutputBlockData } from '@editorjs/editorjs';

const { block } = defineProps<{
   block: OutputBlockData['data']
}>()

const imageProps = computed(() => {
   const classList = ref<string>('')
   classList.value += block.withBorder ? ' border-2' : ''
   classList.value += block.stretched ? ' w-full' : ''
   classList.value += block.withBackground ? ' bg-red-600' : ''
   return classList.value ? classList.value : 'w-full sm:w-4/6 2xl:w-2/5 mx-auto'
})
</script>

<template>
   <div>
      <NuxtImg v-if="!block.file?.url?.includes('http')" :src="'/fs/' + block.file.url" :alt="block.caption"
         :title="block.caption" :class="imageProps" placeholder="/loader.svg" placeholder-class="nuxtImage-loading" />
      <img v-else :src="block.file?.url" :alt="block.caption" :class="imageProps">
   </div>
</template>

<style scoped></style>