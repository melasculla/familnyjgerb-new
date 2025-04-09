<script setup lang="ts">

</script>

<template>
   <div>
      <ClientOnly>
         <Teleport to="#admin__teleport">
            <div class="ml-10 flex flex-wrap gap-4">
               <ButtonsMain :href="routesList.client.admin.posts.list">
                  All Posts
               </ButtonsMain>
               <ButtonsMain :href="routesList.client.admin.posts.create">
                  New Post
               </ButtonsMain>
            </div>
         </Teleport>
      </ClientOnly>

      <BlogList admin />
   </div>
</template>

<style scoped></style>