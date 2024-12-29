<script setup lang="ts">
import type { OutputBlockData } from '@editorjs/editorjs';

const { block, tunes } = defineProps<{
   block: OutputBlockData['data'],
   tunes: any
}>()

const align = ref<'text-left' | 'text-center' | 'text-right'>('text-left')

switch (tunes.AligmentTune.alignment) {
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
      <h2 class="text-xl" :class="align" v-if="block.level === 2" v-html="block.text" />
      <h3 class="text-lg" :class="align" v-else-if="block.level === 3" v-html="block.text" />
   </div>
</template>

<style scoped></style>