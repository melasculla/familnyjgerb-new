<script setup lang="ts">
import type { Component } from 'vue'
import {
   IconsBigLily,
   IconsMain,
   IconsKeys,
   IconsStars,
   IconsStar,
   IconsShieldLily,
   IconsSmallLily,

   IconsMainGold,
   IconsSmallLilyGold,
   IconsStarsGold,
   IconsLily,
} from '#components'

type TIcons = 'main' | 'stars' | 'keys' | 'shield-lily' | 'lily'
type TIconsSides = 'star' | 'small-lily'
type TGradients = 'gradient-gold' // | 'gradient-burgundy'
type TColors = 'accent' | 'black' | TGradients

export type TLineProps = {
   icon: TIcons
   size?: 'small'
   single?: boolean
   wrap?: boolean
   sides?: TIconsSides
   color?: TColors
   full?: boolean
}

const { color } = defineProps<TLineProps>()

const gradientIcons: Record<TIcons | TIconsSides, Record<TGradients, Component>> = {
   main: {
      'gradient-gold': IconsMainGold
   },
   stars: {
      'gradient-gold': IconsStarsGold
   },
   keys: {
      'gradient-gold': IconsKeys
   },
   'shield-lily': {
      'gradient-gold': IconsShieldLily
   },
   lily: {
      'gradient-gold': IconsLily
   },
   star: {
      'gradient-gold': IconsStar
   },
   'small-lily': {
      'gradient-gold': IconsSmallLilyGold
   },
}

const colors: Record<TColors, string> = {
   'gradient-gold': '[&_.line]:gradient-gold',
   // 'gradient-burgundy': '[&_.line]:gradient-gold',
   accent: 'text-accent-800',
   black: 'text-basic-900',
}

const icons: Record<TIcons, Component> = {
   main: color?.startsWith('gradient') ? gradientIcons.main[color as 'gradient-gold'] : IconsMain,
   stars: color?.startsWith('gradient') ? gradientIcons.stars[color as 'gradient-gold'] : IconsStars,
   keys: IconsKeys,
   'shield-lily': IconsShieldLily,
   lily: IconsBigLily,
}

const iconsSides: Record<TIconsSides, Component> = {
   star: color?.startsWith('gradient') ? gradientIcons.star[color as 'gradient-gold'] : IconsStar,
   'small-lily': color?.startsWith('gradient') ? gradientIcons['small-lily'][color as 'gradient-gold'] : IconsSmallLily,
}
</script>

<template>
   <div class="flex justify-center items-center" :class="[
      colors[color || 'black'],
   ]">
      <component v-if="sides" :is="iconsSides[sides]" class="w-2 h-auto translate-x-1" />

      <div class="flex justify-center items-center gap-1" :class="{ 'grow': full }">
         <div class="h-[1.3px] bg-current line" :class="full ? 'grow' : 'min-w-40'"></div>

         <IconsMain v-if="wrap" class="shrink-0 w-auto" :class="size === 'small' ? 'h-6' : 'h-8'" />

         <component class="shrink-0" :is="icons[icon]" :class="(icon === 'main' || icon === 'stars')
            ? (size === 'small' ? 'h-6' : 'h-10')
            : (size === 'small' ? 'h-12' : 'h-20')
            " />

         <IconsMain v-if="wrap" class="shrink-0 w-auto" :class="size === 'small' ? 'h-6' : 'h-8'" />

         <div class="h-[1.3px] bg-current line" :class="full ? 'grow' : 'min-w-40'"></div>
      </div>

      <component v-if="sides" :is="iconsSides[sides]" class="w-2 h-auto rotate-180 -translate-x-1" />
   </div>
</template>

<style scoped></style>