<script setup lang="ts">
const { admin } = defineProps<{
   admin?: boolean
}>()

const themeCookie = useCookie<'dark' | 'light'>('theme', {
   maxAge: 1000 * 60 * 60 * 24, sameSite: 'lax', default: () => 'light'
})
const themeState = computed<'dark' | 'light' | 'change'>({
   get: () => themeCookie.value ?? 'light',
   set: (newVal) => {
      if (newVal !== 'change')
         return

      const newTheme = themeState.value === 'light' ? 'dark' : 'light'
      return themeCookie.value = newTheme
   }
})

useHead({
   htmlAttrs: {
      class: [themeState]
   }
})
</script>

<template>
   <div class="sidebar-item group" @click="themeState = 'change'" :class="{ 'cursor-pointer': admin }">
      <div class="relative">
         <template v-if="themeState === 'dark'">
            <NuxtImg class="inintal-img" :class="{ 'h-14': admin }" src="/icons/moon.webp" alt="" />
            <NuxtImg v-if="!admin" class="hovered-img" src="/icons/moon-active.webp" alt="" />
            <div class="tooltip" v-if="!admin">{{ $t('sidebar.light') }}</div>
         </template>
         <template v-else>
            <NuxtImg class="inintal-img" :class="{ 'h-14': admin }" src="/icons/sun.webp" alt="" />
            <NuxtImg v-if="!admin" class="hovered-img" src="/icons/sun-active.webp" alt="" />
            <div class="tooltip" v-if="!admin">{{ $t('sidebar.dark') }}</div>
         </template>
      </div>
   </div>
</template>

<style scoped></style>