<script setup lang="ts">
import type { OutputBlockData } from '@editorjs/editorjs';

const { block } = defineProps<{
   block: OutputBlockData['data']
}>()

const align = ref<'text-left' | 'text-center' | 'text-right'>('text-left')

switch (block.alignment) {
   case 'center': align.value = 'text-center'
      break;
   case 'right': align.value = 'text-right'
      break;
   default: align.value = 'text-left'
      break;
}
</script>

<template>
   <div>
      <div class="relative px-4 py-2">
         <div class="absolute top-0 left-0 size-6 border-t-[5px] border-l-[5px] border-blue-500"></div>
         <p class="text-base quote" :class="align" v-html="block.text" />
         <div class="absolute bottom-0 right-0 size-6 border-b-[5px] border-r-[5px] border-blue-500"></div>
      </div>
      <small class="block italic text-sm mt-2 text-center" v-html="block.caption" />
   </div>
</template>

<style scoped></style>