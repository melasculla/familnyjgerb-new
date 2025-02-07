<script setup lang="ts">
const user = useState<any | null>('auth:user', () => null)
</script>

<template>
   <div>
      <h1 class="text-2xl text-center">Dashboard</h1>
      <pre>{{ user }}</pre>
      <NuxtLink to="/nashi-kontakty">Contacts</NuxtLink>
   </div>
</template>

<style scoped></style>