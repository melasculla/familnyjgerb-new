<script setup lang="ts">
definePageMeta({
   layout: false
})

const { data, status, error, refresh } = await useLazyFetch(routesList.api.categories.getAll, {
   getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] || nuxtApp.static.data[key],
   key: 'categories',
   onResponse({ response }) {
      if (response.ok)
         categories.value = response._data
   }
})

const categories = ref<NewCategory[]>(data.value ? deepClone(data.value) : [])
const canAddMore = computed(() => !categories.value.some(item => !item.id))

const updateArray = (category: Category) => {
   if (categories.value.some(item => !item.id)) {
      const last = categories.value.findLastIndex(item => !item.id)
      categories.value[last] = category
   }
   refresh()
}

const remove = (id?: number) => {
   if (id) {
      categories.value = categories.value.filter(item => item.id !== id)
      refresh()
      return
   }

   categories.value = categories.value.filter(item => item.id)
}
</script>

<template>
   <div>
      <NuxtLayout name="admin">
         <template #header>
            <PrimeButton class="sm:ml-10 !text-base [&_::before]:!text-base" label="Refresh" icon="pi pi-refresh"
               @click="refresh()" />
         </template>
         <div v-if="categories.length">
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5 [&>div]:rounded-lg">
               <BlogCategoryCard :category="category" v-for="category, i in categories" :key="category.id || i"
                  @delete="remove" @saved="updateArray" />
               <div v-if="canAddMore" @click="categories.push({ slug: '', nameRu: '' })"
                  class="relative flex cursor-pointer hover:text-green-700 hover:scale-125 transition-all min-h-[12rem]">
                  <svg class="absolute inset-0 size-full" viewBox="0 0 24 24">
                     <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                        stroke-width="2.5" d="M12 6v12m-6-6h12" />
                  </svg>
               </div>
            </div>
         </div>
         <div v-else-if="status === 'pending' || status === 'idle'"
            class="grid md:grid-cols-2 lg:grid-cols-3 gap-5 [&>div]:rounded-lg">
            <div v-for="item in 9" class="aspect-[2/1.2] bg-slate-700/90 animate-pulse"></div>
         </div>
         <div v-else-if="status === 'error'" class="text-center text-red-500 font-bold text-lg">
            {{ `Error: ${error?.statusMessage || error?.message || error?.data?.message}` }}
         </div>
      </NuxtLayout>
   </div>
</template>

<style scoped></style>