<script setup lang="ts">

</script>

<template>
   <div>
      <ClientOnly>
         <Teleport to="#admin__teleport">
            <div class="ml-10 flex flex-wrap gap-4">
               <ButtonsMain :href="routesList.client.admin.projects.list">
                  All Projects
               </ButtonsMain>
               <ButtonsMain :href="routesList.client.admin.projects.create">
                  New Project
               </ButtonsMain>
            </div>
         </Teleport>
      </ClientOnly>

      <ProjectsEditor />
   </div>
</template>

<style scoped></style>