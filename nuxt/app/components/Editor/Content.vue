<script setup lang="ts">
import type { OutputData } from '@editorjs/editorjs';

const { content } = defineProps<{
   content: OutputData | null
}>()

const localPath = useLocalePath()

const wrapperClass = 'grid gap-8 content-start items-start'

const parseLink = async (e: MouseEvent) => {
   const target = e.target as HTMLAnchorElement
   if (target.parentNode?.nodeName !== 'A' && target.nodeName !== 'A')
      return

   e.preventDefault()

   // @ts-expect-error
   const href = target.parentNode?.href || target.href
   try {
      const url = new URL(href)
      const isExternal: boolean = useRequestURL().hostname !== url.hostname

      await navigateTo(isExternal ? url.href : url.pathname, {
         external: isExternal,
         open: isExternal ? { target: '_blank' } : undefined
      })
   } catch (err: any) {
      href.startsWith('/') ? await navigateTo(localPath(href)) : await navigateTo(localPath('/' + href))
   }
}
</script>

<template>
   <div v-if="content" class="px-4" :class="wrapperClass" @click="parseLink">
      <!-- lg:[&_.single]:px-4 xl:[&_.single]:px-8 -->
      <div v-for="block, i in content.blocks" :key="block.id" :class="wrapperClass">
         <div v-if="block.type === 'columns'" class="grid-cols-1 sm:grid-cols-2 group
            [&.block-cols-3]:xl:grid-cols-3 [&.block-cols-2]:md:grid-cols-2 editor__columns"
            :class="[`block-cols-${block.data.cols.length}`, wrapperClass]">
            <div v-for="column, index in block.data.cols" :key="index"
               class="group-[.block-cols-3]:xl:sticky group-[.block-cols-3]:xl:top-12
               group-[.block-cols-2]:md:sticky group-[.block-cols-2]:md:top-12 group-[.block-cols-3]:sm:max-xl:last:col-span-full
               group-[.block-cols-3]:sm:max-xl:last:w-1/2 group-[.block-cols-3]:sm:max-xl:last:mx-auto editor__columns__child" :class="[wrapperClass]">
               <!-- block.data.cols.length === 3 ? 'sm:max-lg:last:col-span-2 sm:max-lg:last:w-1/2 sm:max-lg:last:mx-auto' : undefined -->
               <EditorColumns v-for="columnBlock in column.blocks" :key="columnBlock.id" :class="wrapperClass"
                  :block="columnBlock" child />
            </div>
         </div>

         <EditorColumns v-else :block="block" class="single" />
      </div>
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