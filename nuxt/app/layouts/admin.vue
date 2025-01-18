<script setup lang="ts">
import { type ConcreteComponent } from 'vue'

const { locales } = useI18n()
const localPath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()

const { signOut, data } = useAuth()

type Page = { path: string, title: string, icon: ConcreteComponent | string }
const pages: Page[] = [
   { path: routesList.client.admin.main, title: 'Admin', icon: resolveComponent('IconsDashboard') },
   // { path: routesList.client.admin.users.list, title: 'Users', icon: '/icons/admin/users.svg' },
   { path: routesList.client.admin.posts.list, title: 'Posts', icon: resolveComponent('IconsPosts') },
   { path: routesList.client.admin.projects.list, title: 'Projects', icon: resolveComponent('IconsProjects') },
   { path: routesList.client.admin.gallery.list, title: 'Gallery', icon: resolveComponent('IconsGallery') },
   { path: routesList.client.admin.images.upload, title: 'Upload', icon: resolveComponent('IconsUpload') },
]
</script>

<template>
   <div class="">
      <div class="flex gap-2 items-center flex-wrap px-2 py-2 border-b-[2px] xs:border-b-[5px] border-title">
         <NuxtLink :to="localPath('/')">
            <IconsHome class="icon size-12 sm:size-14 block" />
         </NuxtLink>
         <button @click="$router.back()">
            <svg class="icon size-12 sm:size-14 block" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
               viewBox="0 0 24 24">
               <path fill="currentColor" d="m7.825 13l5.6 5.6L12 20l-8-8l8-8l1.425 1.4l-5.6 5.6H20v2z" />
            </svg>
         </button>
         <div class="flex gap-2 text-lg uppercase">
            <NuxtLink v-for="locale in locales" :key="locale.code" :to="switchLocalePath(locale.code)"
               class="cursor-pointer relative group [&.router-link-active]:bg-red-700 p-2 rounded-md">
               {{ locale.code }}
            </NuxtLink>
         </div>
         <div class="flex-shrink flex-grow" v-if="$slots.header">
            <slot name="header" />
         </div>
         <!-- <ThemeSwitcher :admin="true" /> -->
         <div class="ml-auto flex items-center gap-4" v-if="data?.user">
            <p class="max-xs:hidden text-lg">{{ data?.user?.name }}</p>
            <img class="size-10 sm:size-14 rounded-full" :src="data?.user?.image || ''" alt="">
            <IconsLogout class="icon size-10 sm:size-14 block" title="Logout"
               @click="() => signOut({ callbackUrl: '/' })" />
         </div>
      </div>
      <div class="grid grid-cols-[1fr,auto] items-start">
         <main class="border-r-[2px] xs:border-r-[5px] border-title pt-4 px-1 xs:px-4 min-h-[92vh]">
            <div class="relative">
               <slot />
            </div>
         </main>
         <aside class="group grid justify-items-center sticky top-0">
            <nav class="text-base">
               <ul class="grid divide-y-[2px] xs:divide-y-4 divide-fill">
                  <li v-for="page in pages" class="py-2 px-2 xs:px-3 text-center transition-all"
                     :class="{ '[&:has(.router-link-active)]:bg-red-800 [&:has(.router-link-active)]:text-white': page.path !== routesList.client.admin.main }">
                     <NuxtLink :to="localPath(page.path) || page.path" class="flex items-center icon-parent">
                        <p class="block mr-0 max-w-0 md:group-hover:max-w-[40rem] md:group-hover:pr-2 overflow-hidden">
                           {{ page.title }}
                        </p>
                        <component :is="page.icon" class="block size-8 xs:size-12 ml-auto" />
                     </NuxtLink>
                  </li>
               </ul>
            </nav>
         </aside>
      </div>
   </div>
</template>

<style scoped>
:global(.page-leave-active) {
   width: 100%;
}
</style>