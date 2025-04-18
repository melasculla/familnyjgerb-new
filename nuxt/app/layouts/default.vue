<script setup lang="ts">
// const localPath = useLocalePath()
// const { data, status } = useAuth()
</script>

<template>
   <div class="grid grid-cols-[1fr_5fr]">
      <NuxtLoadingIndicator class="col-span-full" color="hsl(225, 88%, 36%)" :height="4" data-allow-mismatch />

      <header class="col-span-full">
         <TheHeader />
      </header>

      <MenuMain class="col-span-full my-3 sticky top-0 z-50 bg-white" />

      <aside v-if="!$route.meta.hideSidebar" class="px-5">
         <TheSidebar />
      </aside>

      <main class="[&>div:not(.custom)]:grid [&>div:not(.custom)]:gap-12 [&>div:not(.custom)]:items-start pr-5">
         <slot />
      </main>

      <footer class="col-span-full pt-12">
         <TheFooter />
      </footer>
   </div>
</template>

<style scoped></style>