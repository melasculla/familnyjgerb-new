<script setup lang="ts">

</script>

<template>
   <div>
      <ClientOnly>
         <Teleport to="#admin__teleport">
            <div class="ml-10 flex flex-wrap gap-4">
               <ButtonsMain :to="routesList.client.admin.projects.list">
                  All Projects
               </ButtonsMain>
               <ButtonsMain :to="routesList.client.admin.projects.create">
                  New Project
               </ButtonsMain>
            </div>
         </Teleport>
      </ClientOnly>

      <ProjectsList admin />
   </div>
</template>

<style scoped></style>