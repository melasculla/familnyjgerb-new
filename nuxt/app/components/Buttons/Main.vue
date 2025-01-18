<script setup lang="ts">
const { href, icon } = defineProps<{
   href?: string
   icon?: {
      position: 'left' | 'right',
      name: string
   }
}>()
</script>

<template>
   <button type="button"
      class="flex gap-3 px-3 py-2 text-base bg-[#6796bf] rounded-md text-white hover:bg-white hover:text-[#6796bf] transition-all cursor-pointer">
      <component v-if="icon && icon.position === 'left'" :is="resolveComponent(`Icons${icon.name}`)" />

      <NuxtLink v-if="href" :to="href" class="">
         <slot />
      </NuxtLink>

      <template v-else>
         <slot />
      </template>

      <component v-if="icon && icon.position === 'right'" :is="resolveComponent(`Icons${icon.name}`)" />
   </button>
</template>