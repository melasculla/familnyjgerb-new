<script setup lang="ts">
const { data, status, error } = await useFetch(routesList.api.categories.getAll, {
   getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] || nuxtApp.static.data[key],
   key: 'categories'
})

const categories = ref<NewCategory[]>(data.value || [])

const remove = async (id?: number) => {
   if (!id)
      return categories.value = categories.value.filter(item => item.id)
}
</script>

<template>
   <div>
      <div v-if="status === 'success' && categories">
         <div class="grid max-md:grid-rows-1 md:grid-cols-2 lg:grid-cols-3 gap-5 [&>div]:rounded-lg">
            <BlogCategoryCard :category="category" v-for="category in categories" :key="category.id" @delete="remove" />
            <div v-if="!categories.some(item => !item.id)" @click="() => {
               categories.push({ slug: '', nameRu: 'New' });
               useState<number | null>('admin:category:editing').value = -1
            }" class="relative flex cursor-pointer hover:text-green-700 hover:scale-125 transition-all">
               <svg class="absolute inset-0 size-full" viewBox="0 0 24 24">
                  <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                     stroke-width="2.5" d="M12 6v12m-6-6h12" />
               </svg>
            </div>
         </div>
      </div>
      <div v-else-if="status === 'pending' || status === 'idle'">
         Loading
      </div>
      <div v-else-if="status === 'error'" class="text-center text-red-500 font-bold text-lg">
         {{ `Error: ${error?.statusMessage || error?.message || error?.data?.message}` }}
      </div>
   </div>
</template>

<style scoped></style>