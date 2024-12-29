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
   return classList.value
})
</script>

<template>
   <div>
      <NuxtImg :src="'/fs/' + block.file.url" :alt="block.caption" :title="block.caption" class="border-orange-400"
         :class="imageProps" placeholder="/loader.svg" placeholder-class="nuxtImage-loading" />
   </div>
</template>

<style scoped></style>