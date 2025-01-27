<script setup lang="ts">
definePageMeta({
   middleware: [
      // async (to, from) => {
      //    const { status, data } = useAuth()

      //    if (status.value === 'unauthenticated' || data.value?.role !== 'admin')
      //       return abortNavigation({ statusCode: 400, message: 'Forbidden' })
      //    // return await navigateTo(`/api/auth/signin?callbackUrl=${encodeURIComponent(to.fullPath)}`, { external: true })
      // }
   ]
})
</script>

<template>
   <div>
      <NuxtPage />
   </div>
</template>