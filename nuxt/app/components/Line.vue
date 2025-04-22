<script setup lang="ts">
import type { Component } from 'vue'
import {
   IconsBigLily,
   IconsMain,
   IconsKeys,
   IconsStars,
   IconsShieldLily,
   IconsSmallLily,

   IconsMainGold,
   IconsSmallLilyGold,
   IconsStarsGold,
} from '#components'

type TIcons = 'main' | 'stars' | 'keys' | 'shield-lily' | 'lily'
type TIconsSides = 'stars' | 'lily'
type TColors = 'accent' | 'black' | 'gradient-gold'

const { color } = defineProps<{
   icon: TIcons
   size?: 'small'
   single?: boolean
   wrap?: boolean
   sides?: TIconsSides
   color?: TColors
   full?: boolean
}>()

// const resolveIcon = (name: string) => {
//    if (name)
//       return `${Icons}`
// }

const icons: Record<TIcons, Component> = {
   main: color === 'gradient-gold' ? IconsMainGold : IconsMain,
   stars: color === 'gradient-gold' ? IconsStarsGold : IconsStars,
   keys: IconsKeys,
   'shield-lily': IconsShieldLily,
   lily: IconsBigLily,
}

const iconsSides: Record<TIconsSides, Component> = {
   stars: color === 'gradient-gold' ? IconsStarsGold : IconsStars,
   lily: color === 'gradient-gold' ? IconsSmallLilyGold : IconsSmallLily,
}

const colors: Record<TColors, string> = {
   'gradient-gold': '[&_.line]:gradient-gold',
   accent: 'text-accent-800',
   black: 'text-basic-900',
}
</script>

<template>
   <div class="flex justify-center items-center" :class="[
      colors[color || 'black'],
   ]">
      <component v-if="sides" :is="iconsSides[sides]" class="w-7 h-auto translate-x-1" />

      <div class="flex justify-center items-center gap-1" :class="{ 'grow': full }">
         <div class="h-0.5 bg-current line" :class="full ? 'grow' : 'min-w-40'"></div>

         <IconsMain v-if="wrap" class="shrink-0 w-auto" :class="size === 'small' ? 'h-6' : 'h-8'" />

         <component class="shrink-0" :is="icons[icon]" :class="(icon === 'main' || icon === 'stars')
            ? (size === 'small' ? 'h-6' : 'h-10')
            : (size === 'small' ? 'h-12' : 'h-20')
            " />

         <IconsMain v-if="wrap" class="shrink-0 w-auto" :class="size === 'small' ? 'h-6' : 'h-8'" />

         <div class="h-0.5 bg-current line" :class="full ? 'grow' : 'min-w-40'"></div>
      </div>

      <component v-if="sides" :is="iconsSides[sides]" class="w-7 h-auto rotate-180 -translate-x-1" />
   </div>
</template>

<style scoped></style>