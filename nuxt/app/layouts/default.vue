<script setup lang="ts">
const localPath = useLocalePath()
const { data, status } = useAuth()
</script>

<template>
   <div>
      <NuxtLoadingIndicator color="hsl(225, 88%, 36%)" :height="4" data-allow-mismatch />

      <header>
         <TheHeader />
      </header>

      <MenuMain class="my-3 sticky top-0 z-10 bg-primary-100" />

      <main class="[&>div:not(.custom)]:grid [&>div:not(.custom)]:gap-12 [&>div:not(.custom)]:items-start">
         <slot />
      </main>
      <!-- <aside>
      </aside> -->
      <footer class="pt-12">
         <TheFooter />
      </footer>
   </div>
</template>

<style scoped></style>