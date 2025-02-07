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
      class="flex gap-3 px-8 py-2.5 border border-primary-900 text-lg text-basic-900 transition-all cursor-pointer">
      <component v-if="icon && icon.position === 'left'" :is="resolveComponent(`Icons${icon.name}`)" />

      <NuxtLink v-if="href" :to="useLocalePath()(href)" class="">
         <span class="relative before:bg-accent-800 before:h-[2px] before:w-0 before:absolute before:-bottom-0.5 before:left-0
            before:transition-all before:duration-500 delay-100 before:delay-0 hover:before:w-full">
            <slot />
         </span>
      </NuxtLink>

      <template v-else>
         <span class="relative before:bg-accent-800 before:h-[2px] before:w-0 before:absolute before:-bottom-0.5 before:left-0
            before:transition-all before:duration-500 delay-100 before:delay-0 hover:before:w-full">
            <slot />
         </span>
      </template>

      <component v-if="icon && icon.position === 'right'" :is="resolveComponent(`Icons${icon.name}`)" />
   </button>
</template>