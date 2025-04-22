<script setup lang="ts">
defineProps<{
   to?: string
   icon?: {
      position: 'left' | 'right',
      name: string
   }
}>()
</script>

<template>
   <button type="button"
      class="flex gap-3 border border-primary-900 text-lg text-basic-900 transition-all cursor-pointer [&:hover_span::before]:w-full"
      :class="{ 'px-8 py-2.5': !to }">
      <component v-if="icon && icon.position === 'left'" :is="resolveComponent(`Icons${icon.name}`)" />

      <NuxtLink v-if="to" :to="to.startsWith('#') ? to : useLocalePath()(to)" class="px-8 py-2.5">
         <span class="relative before:bg-accent-800 before:h-[2px] before:w-0 before:absolute before:-bottom-0.5 before:left-0
            before:transition-all before:duration-500 delay-100 before:delay-0">
            <slot />
         </span>
      </NuxtLink>

      <template v-else>
         <span class="relative before:bg-accent-800 before:h-[2px] before:w-0 before:absolute before:-bottom-0.5 before:left-0
            before:transition-all before:duration-500 delay-100 before:delay-0">
            <slot />
         </span>
      </template>

      <component v-if="icon && icon.position === 'right'" :is="resolveComponent(`Icons${icon.name}`)" />
   </button>
</template>