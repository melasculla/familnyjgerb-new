<script setup lang="ts">
import type { OutputData } from '@editorjs/editorjs';

const { content } = defineProps<{
   content: OutputData | null
}>()

const localPath = useLocalePath()

const parseLink = async (e: MouseEvent) => {
   const target = e.target as HTMLAnchorElement
   if (target.nodeName !== 'A')
      return

   e.preventDefault()

   try {
      const url = new URL(target.href)
      const isExternal: boolean = useRequestURL().hostname !== url.hostname
      await navigateTo(isExternal ? url.href : url.pathname, {
         external: isExternal,
         open: { target: '_blank' }
      })
   } catch (err: any) {
      target.href.startsWith('/') ? await navigateTo(localPath(target.href)) : await navigateTo(localPath('/' + target.href))
   }
}
</script>

<template>
   <div class="grid gap-4 px-4" v-if="content" @click="parseLink">
      <template v-for="block in content.blocks" :key="block.id">
         <div v-if="block.type === 'columns'" class="grid gap-4 grid-cols-1 sm:grid-cols-2 editor__columns"
            :class="block.data.cols.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'">
            <div class="editor__columns__child"
               :class="block.data.cols.length === 3 ? 'sm:max-lg:last:col-span-2 sm:max-lg:last:w-1/2 sm:max-lg:last:mx-auto' : undefined"
               v-for="column, index in block.data.cols" :key="index">
               <EditorColumns v-for="columnBlock in column.blocks" :key="columnBlock.id" :block="columnBlock"
                  :child="true" />
            </div>
         </div>
         <EditorColumns v-else :block="block" />
      </template>
   </div>
</template>

<style scoped>
:deep(a) {
   text-decoration: underline;
   display: inline-block;
}

:deep(.editor__columns:has(.editor__columns__child .image:only-child)) .image:only-child {
   height: 100%;

   &>img {
      height: 100%;
      object-fit: cover;
   }
}
</style>