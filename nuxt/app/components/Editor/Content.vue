<script setup lang="ts">
import type { OutputData } from '@editorjs/editorjs';

const { content } = defineProps<{
   content: OutputData | null
}>()
</script>

<template>
   <div class="grid gap-4 px-4" v-if="content">
      <template v-for="block in content.blocks" :key="block.id">
         <div v-if="block.type === 'columns'" class="grid gap-4 grid-cols-1 sm:grid-cols-2"
            :class="block.data.cols.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'">
            <div v-for="column, index in block.data.cols" :key="index">
               <template v-for="columnBlock in column.blocks" :key="columnBlock.id">
                  <EditorTitle v-if="columnBlock.type === 'header'" :block="columnBlock.data"
                     :tunes="columnBlock.tunes" />
                  <EditorText v-else-if="columnBlock.type === 'paragraph'" :block="columnBlock.data"
                     :tunes="columnBlock.tunes" />
                  <EditorImage v-else-if="columnBlock.type === 'image'" :block="columnBlock.data" />
                  <EditorList v-else-if="columnBlock.type === 'list'" :block="columnBlock.data" />
                  <EditorCheckList v-else-if="columnBlock.type === 'checklist'" :block="columnBlock.data" />
                  <EditorQuote v-else-if="columnBlock.type === 'quote'" :block="columnBlock.data" />
                  <EditorEmbed v-else-if="columnBlock.type === 'embed'" :block="columnBlock.data" />
               </template>
            </div>
         </div>
         <EditorTitle v-else-if="block.type === 'header'" :block="block.data" :tunes="block.tunes" />
         <EditorText v-else-if="block.type === 'paragraph'" :block="block.data" :tunes="block.tunes" />
         <EditorImage v-else-if="block.type === 'image'" :block="block.data" />
         <EditorList v-else-if="block.type === 'list'" :block="block.data" />
         <EditorCheckList v-else-if="block.type === 'checklist'" :block="block.data" />
         <EditorQuote v-else-if="block.type === 'quote'" :block="block.data" />
         <EditorEmbed v-else-if="block.type === 'embed'" :block="block.data" />
         <EditorAlert v-else-if="block.type === 'alert'" :block="block.data" />
      </template>
   </div>
</template>

<style scoped>
:deep(a) {
   text-decoration: underline
}
</style>