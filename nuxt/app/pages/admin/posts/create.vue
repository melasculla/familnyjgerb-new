<script setup lang="ts">

</script>

<template>
   <div>
      <ClientOnly>
         <Teleport to="#admin__teleport">
            <div class="ml-10 flex flex-wrap gap-4">
               <ButtonsMain :to="routesList.client.admin.posts.list">
                  All Posts
               </ButtonsMain>
               <ButtonsMain :to="routesList.client.admin.posts.create">
                  New Post
               </ButtonsMain>
            </div>
         </Teleport>
      </ClientOnly>

      <BlogEditor />
   </div>
</template>

<style scoped></style>