<script setup lang="ts">
import type { OutputBlockData } from '@editorjs/editorjs';
// TODO: Make all alert types
const { block } = defineProps<{
   block: OutputBlockData['data'],
}>()

const align = ref<'text-left' | 'text-center' | 'text-right'>('text-left')

switch (block.align) {
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
      <!-- 'border-2 border-sky-400 bg-sky-200': block.type === 'primary',
      'border-2 border-sky-400 bg-sky-200': block.type === 'secondary',
      'border-2 border-sky-400 bg-sky-200': block.type === 'success',
      'border-2 border-sky-400 bg-sky-200': block.type === 'warning',
      'border-2 border-sky-400 bg-sky-200': block.type === 'danger',
      'border-2 border-sky-400 bg-sky-200': block.type === 'light',
      'border-2 border-sky-400 bg-sky-200': block.type === 'dark' -->
      <div class="w-3/4 mx-auto text-base rounded-xl px-4 py-2" :class="align, {
         'border-2 border-sky-400 bg-sky-200': block.type === 'info',
      }">
         <p>
            {{ block.message }}
         </p>
      </div>
   </div>
</template>

<style scoped></style>