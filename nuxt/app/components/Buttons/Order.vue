<script setup lang="ts">
defineProps<{
   href?: string
   icon?: {
      position: 'left' | 'right',
      name: string
   }
}>()
</script>

<template>
   <button type="button"
      class="flex gap-3 px-3 py-2 text-base bg-red-600 text-white hover:bg-white hover:text-red-400 transition-all cursor-pointer">
      <component v-if="icon && icon.position === 'left'" :is="resolveComponent(`Icons${icon.name}`)" />

      <NuxtLink v-if="href" :to="useLocalePath()(href)" class="">
         <slot />
      </NuxtLink>

      <template v-else>
         <slot />
      </template>

      <component v-if="icon && icon.position === 'right'" :is="resolveComponent(`Icons${icon.name}`)" />
   </button>
</template>