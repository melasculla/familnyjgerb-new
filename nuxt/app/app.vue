<script setup lang="ts">
useHead({
   titleTemplate: (title) => {
      return title ? `${title} | Фамильный Герб` : 'Фамильный Герб'
   },
})
</script>

<template>
   <div>
      <NuxtLayout>
         <NuxtPage />
         <PrimeConfirmDialog />
      </NuxtLayout>
   </div>
</template>