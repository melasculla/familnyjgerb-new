<script setup lang="ts">
import type { OutputBlockData } from '@editorjs/editorjs';

const { block } = defineProps<{
   block: OutputBlockData['data']
}>()
</script>

<template>
   <div>
      <ul :class="block.style === 'ordered' ? 'list-decimal' : 'list-disc'" class="grid gap-3">
         <li v-for="item in block.items" :key="item" class="flex items-center gap-2">
            <div class="border border-blue-300 rounded-lg size-6 shrink-0" :class="item.checked && 'bg-blue-300'">
               <svg class="w-full h-full text-white" v-if="item.checked" xmlns="http://www.w3.org/2000/svg" width="24"
                  height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-width="2"
                     d="M7 12L10.4884 15.8372C10.5677 15.9245 10.705 15.9245 10.7844 15.8372L17 9"></path>
               </svg>
            </div>
            <p class="text-base" v-html="item.text"></p>
         </li>
      </ul>
   </div>
</template>

<style scoped></style>