<script setup lang="ts">
definePageMeta({
   layout: false
})
</script>

<template>
   <div>
      <NuxtLayout name="admin">
         <NuxtPage />
         <template #header>
            <div class="ml-10 flex flex-wrap gap-4">
               <ButtonsMain :href="routesList.client.admin.posts.list">
                  All Posts
               </ButtonsMain>
               <ButtonsMain :href="routesList.client.admin.posts.create">
                  New Post
               </ButtonsMain>
            </div>
         </template>
      </NuxtLayout>
   </div>
</template>