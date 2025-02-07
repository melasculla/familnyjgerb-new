<script setup lang="ts" generic="ANY">
import { type MenuLink } from './Main.vue';
import { NuxtLink } from '#components'

type Props = {
   to: MenuLink | string
   route: boolean
}

defineProps<Props>()

// @ts-ignore
const getProp = (path: string): any => path.split('.').reduce((acc, key) => acc?.[key], routesList)
</script>

<template>
   <component :is="to ? NuxtLink : 'p'" :to="to ? (route ? getProp(to) : to) : undefined" class="relative py-3
   before:bg-accent-800 before:h-[2px] before:w-0 before:absolute before:bottom-2 before:left-0
   before:transition-all before:duration-500 delay-100 before:delay-0 hover:before:w-full">
      <slot />
   </component>
</template>

<style scoped>
p {
   cursor: default;
}
</style>