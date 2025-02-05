<script setup lang="ts">
const localPath = useLocalePath()
const { data, status } = useAuth()
</script>

<template>
   <header>
      <TheHeader />
   </header>
   <main>
      <slot />
   </main>
   <aside>
      <!-- Sidebar -->
   </aside>
   <footer>
      <!-- <TheFooter /> -->
   </footer>
</template>

<style scoped></style>