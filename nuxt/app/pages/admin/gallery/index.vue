<script setup lang="ts">
const { data, status, error } = await useLazyFetch(routesList.api.gallery.list)
</script>

<template>
   <div>
      <div v-if="status === 'success' && data" class="flex gap-5 text-lg items-center justify-center">
         <NuxtLink class="bg-slate-200 flex-shrink-0 w-1/6 flex items-center justify-center aspect-square capitalize
         [box-shadow:0_0_10px_1px_var(--tw-shadow-color)] shadow-red-400/70 rounded-lg
         hover:rotate-2 hover:scale-110 transition-all" v-for="item in data" :key="item.id"
            :to="routesList.client.admin.gallery.category.list(item.name)">
            {{ item.name }}
         </NuxtLink>
      </div>
      <div v-else-if="status === 'pending' || status === 'idle'" class="">
         Loading
      </div>
      <div v-else-if="status === 'error'" class="text-center text-red-500 font-bold text-lg">
         {{ `Error: ${error?.statusMessage || error?.message || error?.data?.message}` }}
      </div>
   </div>
</template>

<style scoped></style>