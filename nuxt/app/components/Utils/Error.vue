<script setup lang="ts">
defineProps<{
   error?: string
}>()
</script>

<template>
   <transition name="error">
      <div v-if="error">
         <p class="text-red-700 text-sm block mx-auto">{{ error }}</p>
      </div>
   </transition>
</template>

<style scoped>
.error-enter-active,
.error-leave-active {
   transition: all 300ms;
}

.error-enter-from,
.error-leave-to {
   opacity: 0;
}
</style>