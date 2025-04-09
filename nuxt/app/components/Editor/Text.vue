<script setup lang="ts">
import type { OutputBlockData } from '@editorjs/editorjs';

const { block, tunes } = defineProps<{
   block: OutputBlockData['data'],
   tunes: any
}>()

const align = ref<'text-left' | 'text-center' | 'text-right'>('text-left')

switch (tunes?.AligmentTune?.alignment) {
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
      <p :class="align" v-html="block.text" />
   </div>
</template>

<style scoped>
:deep(p:has(a[style*="background:"])) {
   text-align: center;
}
</style>