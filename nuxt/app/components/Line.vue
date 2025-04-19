<script setup lang="ts">
import type { Component } from 'vue'
import {
   IconsBigLily,
   IconsMain,
   IconsKeys,
   IconsStars,
   IconsShieldLily
} from '#components'

type TIcons = 'main' | 'stars' | 'keys' | 'shield-lily' | 'lily'

defineProps<{
   icon: TIcons | {
      name: TIcons
      single: boolean
   }
   wrap?: boolean
   sides?: 'dots' | 'lily'
   color?: 'accent' | 'black' | 'gold-gradient'
   fill?: boolean
}>()

const icons: Record<TIcons, Component> = {
   'main': IconsMain,
   'stars': IconsStars,
   'keys': IconsKeys,
   'shield-lily': IconsShieldLily,
   'lily': IconsBigLily,
}
</script>

<template>
   <div class="flex gap-2 justify-center items-center">
      <div class="w-80 h-0.5 bg-accent-800"></div>

      <IconsMain v-if="wrap" class="shrink-0 w-50" />

      <component class="shrink-0 size-16 text-accent-800"
         :is="typeof icon === 'object' ? icons[icon.name] : icons[icon]" />

      <IconsMain v-if="wrap" class="shrink-0 w-50" />

      <div class="w-80 h-0.5 bg-accent-800"></div>
   </div>
</template>

<style scoped></style>