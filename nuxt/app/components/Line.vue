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
type TColors = 'accent' | 'black' | 'gold-gradient'

defineProps<{
   icon: TIcons | {
      name: TIcons
      single: boolean
   }
   wrap?: boolean
   sides?: 'dots' | 'lily'
   color?: TColors
   full?: boolean
}>()

const icons: Record<TIcons, Component> = {
   main: IconsMain,
   stars: IconsStars,
   keys: IconsKeys,
   'shield-lily': IconsShieldLily,
   lily: IconsBigLily,
}

const colors: Record<TColors, string> = {
   'gold-gradient': 'gradient-primary',
   accent: 'text-accent-800',
   black: 'text-basic-900',
}
</script>

<template>
   <div class="flex gap-2 justify-center items-center" :class="[
      colors[color || 'black'],
      { 'grid! grid-cols-[1fr_auto_auto_auto_1fr] [&_.line]:w-auto': full && wrap },
      { 'grid! grid-cols-[1fr_auto_1fr] [&_.line]:w-auto': full && !wrap },
   ]">
      <div class="w-40 h-0.5 bg-current line"></div>

      <IconsMain v-if="wrap" class="shrink-0 w-auto h-9" />

      <component class="shrink-0 size-16" :is="typeof icon === 'object' ? icons[icon.name] : icons[icon]" />

      <IconsMain v-if="wrap" class="shrink-0 w-auto h-9" />

      <div class="w-40 h-0.5 bg-current line"></div>
   </div>
</template>

<style scoped></style>