<script setup lang="ts">
const route = useRoute()
const category = computed(() => Array.isArray(route.params.category) ? route.params.category[0] : route.params.category)
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

      <BlogList :category="category" admin />
   </div>
</template>

<style scoped></style>