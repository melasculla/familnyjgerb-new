<script setup lang="ts">
const { text, href, icon } = defineProps<{
   text?: string
   href?: string
   icon?: {
      position: 'left' | 'right',
      name: string
   }
}>()
</script>

<template>
   <div>
      <button
         class="flex mx-auto gap-3 px-3 py-2 text-base bg-red-600 text-white hover:bg-white hover:text-red-400 transition-all">
         <component v-if="icon && icon.position === 'left'" :is="resolveComponent(`Icons${icon.name}`)" />
         <NuxtLink v-if="href" :to="href" class="">
            {{ text }}
         </NuxtLink>
         <template v-else>{{ text }}</template>
         <component v-if="icon && icon.position === 'right'" :is="resolveComponent(`Icons${icon.name}`)" />
      </button>
   </div>
</template>