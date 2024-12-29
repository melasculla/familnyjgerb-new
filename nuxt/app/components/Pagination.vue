<script setup lang="ts">
const localPath = useLocalePath()

const { pages, currentPage, urlBase, total } = defineProps<{
   pages: number
   currentPage: number
   urlBase?: (page?: number) => string
   total?: number
}>()

const emit = defineEmits<{
   pageChanged: [page: number]
}>()

const pageChanged = (page: number) => {
   if (urlBase)
      return

   emit('pageChanged', page)
}
</script>

<template>
   <div v-if="currentPage > pages ? true : currentPage !== 1">
      <div class="flex gap-4 justify-center mb-2">
         <NuxtLink v-if="pages" v-for="page in pages" :key="page"
            class="border leading-none rounded-[50%] size-10 grid place-items-center cursor-pointer transition-colors"
            :class="currentPage == page ? 'border-orange-400 text-orange-400' : 'border-primary'"
            :to="urlBase && localPath(urlBase(page !== 1 ? page : undefined))" @click="pageChanged(page)">
            {{ page }}
         </NuxtLink>
      </div>
   </div>
</template>

<style scoped></style>