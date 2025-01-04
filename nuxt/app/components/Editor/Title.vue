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
      <!-- <component :is="`h${block.level}`" class="text-xl" :class="align" v-if="block.level === 1 || block.level === 2"
         v-html="block.text" />
      <component :is="`h${block.level}`" class="text-lg" :class="align" v-else v-html="block.text" /> -->
      <h1 class="text-xl" :class="align" v-if="block.level === 1" v-html="block.text"></h1>
      <h2 class="text-xl" :class="align" v-else-if="block.level === 2" v-html="block.text"></h2>
      <h3 class="text-lg" :class="align" v-else-if="block.level === 3" v-html="block.text"></h3>
      <h4 class="text-lg" :class="align" v-else-if="block.level === 4" v-html="block.text"></h4>
      <h5 class="text-lg" :class="align" v-else-if="block.level === 5" v-html="block.text"></h5>
      <h6 class="text-lg" :class="align" v-else-if="block.level === 6" v-html="block.text"></h6>
   </div>
</template>

<style scoped></style>