<script setup lang="ts">
import type { OutputData } from '@editorjs/editorjs';

const { content } = defineProps<{
   content: OutputData | null
}>()

const parseLink = async (e: MouseEvent) => {
   const target = e.target as HTMLAnchorElement
   if (target.nodeName !== 'A')
      return

   e.preventDefault()

   const url = new URL(target.href)
   const isExternal: boolean = useRequestURL().hostname !== url.hostname
   await navigateTo(url.pathname, { external: isExternal })
}
</script>

<template>
   <div class="grid gap-4 px-4" v-if="content" @click="parseLink">
      <template v-for="block in content.blocks" :key="block.id">
         <div v-if="block.type === 'columns'" class="grid gap-4 grid-cols-1 sm:grid-cols-2"
            :class="block.data.cols.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'">
            <div v-for="column, index in block.data.cols" :key="index">
               <EditorColumns v-for="columnBlock in column.blocks" :key="columnBlock.id" :block="columnBlock" />
            </div>
         </div>
         <EditorColumns v-else :block="block" />
      </template>
   </div>
</template>

<style scoped>
:deep(a) {
   text-decoration: underline
}
</style>