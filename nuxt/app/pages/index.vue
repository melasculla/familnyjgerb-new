<script setup lang="ts">
import { Editor } from '#components'

const editor = ref<InstanceType<typeof Editor>>()
const result = ref()
const data = undefined
</script>

<template>
   <div class="grid gap-6 text-center justify-items-center">
      <NuxtLink class="block text-center text-4xl mt-5" to="/blog_o_geraldike">
         Blog
      </NuxtLink>
      <button class="block mx-auto text-base text-red-500" @click="result = undefined">
         Reset
      </button>
      <EditorContent v-if="result" :content="result" />
      <Editor :data="data" ref="editor" class="w-10/12 mx-auto" />
      <button class="block mx-auto text-xl text-green-400" @click="async () => {
         result = await editor?.save()
         console.log(toRaw(result.blocks))
      }">
         Save
      </button>
   </div>
</template>

<style scoped></style>