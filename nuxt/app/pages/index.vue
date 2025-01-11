<script setup lang="ts">
import { type Editor } from '#components'

const editor = ref<InstanceType<typeof Editor>>()
const result = ref()
// const { data } = await useFetch<any>('/api/migrate')
</script>

<template>
   <div class="grid gap-6 text-center justify-items-center">
      <NuxtLink class="block text-center text-4xl mt-5" to="/blog_o_geraldike">
         Blog
      </NuxtLink>
      <button class="block mx-auto text-base text-red-500" @click="result = undefined">
         Reset
      </button>
      <button class="block mx-auto text-xl text-green-400" @click="async () => {
         result = await editor?.save()
         console.log(toRaw(result.blocks))
      }">
         Save
      </button>
      <EditorContent v-if="result" :content="result" />
      <Editor ref="editor" class="w-10/12 mx-auto" />
      <!-- :data="data?.patrik" -->
   </div>
</template>

<style scoped></style>