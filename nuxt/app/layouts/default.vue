<script setup lang="ts">
const { locale, t, tm, rt } = useI18n()
// const localPath = useLocalePath()
// const { data, status } = useAuth()

const route = useRoute()

const headData = computed<{
   title?: string
   info?: {
      text: { tag: string, text: string, classes: string }[]
      image: {
         path: string
         alt: string
      }
      line: any
   }
}>(() => ({
   title: route.meta.customTitle && t(`custom-page-meta.${route.meta.customTitle.key}.title`),

   info: route.meta.info && {
      image: {
         path: route.meta.info.image,
         alt: t(`custom-page-meta.${route.meta.info.key}.image-alt`)
      },
      text: tm(`custom-page-meta.${route.meta.info.key}.description`),
      line: route.meta.info.line,
   }
}))
</script>

<template>
   <div class="grid grid-cols-[3fr_12fr]">
      <NuxtLoadingIndicator class="col-span-full" color="hsl(225, 88%, 36%)" :height="4" data-allow-mismatch />

      <header class="col-span-full">
         <TheHeader />
      </header>

      <MenuMain class="col-span-full my-3 sticky top-0 z-50 bg-white" />

      <div v-if="headData.info || headData.title" class="col-span-full my-10">
         <div class="w-10/12 mx-auto text-center">
            <div v-if="headData.title" class="max-w-max mx-auto">
               <h1 class="text-accent-800 uppercase font-bold text-2xl px-20">{{ headData.title }}</h1>

               <Line class="mt-2 mx-auto" v-bind="{
                  icon: 'main',
                  size: 'small',
                  color: 'accent',
                  sides: 'star',
                  full: true
               }" />
            </div>

            <div v-if="headData.info" class="grid grid-cols-[7fr_8fr] items-center shadow-main mt-10 bg-primary-100">
               <div>
                  <NuxtImg class="size-full object-cover" :src="headData.info.image.path" :alt="headData.info.image.alt"
                     preload />
               </div>

               <div class="px-10 py-20 text-lg leading-7">
                  <p class="[&_b]:text-accent-800">
                     <template v-for="item, i in headData.info.text" :key="i">
                        <component v-if="item.tag" :is="rt(item.tag)" :class="item.classes && rt(item.classes)">
                           {{ rt(item.text) }}
                        </component>
                        <template v-else>{{ rt(item.text) }}</template>
                     </template>
                  </p>

                  <Line class="mt-5" v-bind="{
                     ...headData.info.line,
                     full: true
                  }" />
               </div>
            </div>
         </div>
      </div>

      <aside v-if="!$route.meta.hideSidebar" class="pl-10 pr-5">
         <TheSidebar />
      </aside>

      <main class="[&>div:not(.custom)]:grid [&>div:not(.custom)]:gap-12 [&>div:not(.custom)]:items-start pr-10"
         :class="{ 'col-span-full': $route.meta.hideSidebar }">
         <slot />
      </main>

      <footer class="col-span-full pt-12">
         <TheFooter />
      </footer>
   </div>
</template>

<style scoped></style>