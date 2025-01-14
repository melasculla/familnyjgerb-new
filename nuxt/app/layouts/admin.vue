<script setup lang="ts">
import { type ConcreteComponent } from 'vue'

const { locales, locale: currentLocale } = useI18n()
const localPath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()

const { signOut, data } = useAuth()

type Page = { path: string, title: string, icon: ConcreteComponent | string }
const pages: Page[] = [
   // { path: routesList.client.admin.main, title: 'Admin', icon: '/icons/admin/dashboard.svg' },
   // { path: routesList.client.admin.users.list, title: 'Users', icon: '/icons/admin/users.svg' },
   { path: routesList.client.admin.posts.list, title: 'Posts', icon: resolveComponent('IconsPosts') },
   // { path: routesList.client.admin.projects.list, title: 'Projects', icon: '/icons/admin/gallery.svg' },
   { path: routesList.client.admin.gallery.list, title: 'Gallery', icon: resolveComponent('IconsGallery') },
   // { path: routesList.client.admin.images.upload, title: 'Images', icon: '/icons/admin/uploadImage.svg' },
]
</script>

<template>
   <div
      class="[&_.icon]:cursor-pointer [&_.icon]:bg-secondary [&_.icon:hover]:bg-fuchsia-700 [&_.icon-parent:hover_.icon]:bg-fuchsia-700 [&_.icon]:transition-colors">
      <div class="flex gap-2 sm:gap-8 items-center flex-wrap px-2 py-2 border-b-[5px] border-title">
         <NuxtLink :to="localPath(routesList.client.admin.main) || routesList.client.admin.main">
            <IconsHome class="icon size-12 sm:size-14 block" />
         </NuxtLink>
         <NuxtLink v-for="locale in locales" :key="locale.code" :to="switchLocalePath(locale.code)"
            v-show="locale.code !== currentLocale" class="cursor-pointer relative group">
            <!-- <img class="h-10" :src="`/icons/${locale.code.toUpperCase()}.webp`" alt="" /> -->
            {{ locale }}
         </NuxtLink>
         <!-- <ThemeSwitcher :admin="true" /> -->
         <div class="ml-auto flex items-center gap-4" v-if="data?.user">
            <p class="max-xs:hidden text-lg">{{ data?.user?.name }}</p>
            <img class="size-10 sm:size-14 rounded-full" :src="data?.user?.image || ''" alt="">
            <IconsLogout class="icon size-10 sm:size-14 block" title="Logout"
               @click="() => signOut({ callbackUrl: '/' })" />
         </div>
      </div>
      <div class="grid grid-cols-[1fr,auto] items-start">
         <main class="border-r-[5px] border-title pt-4 px-1 xs:px-4 min-h-[92vh]">
            <div class="relative">
               <slot />
            </div>
         </main>
         <aside class="group grid justify-items-center sticky top-0">
            <nav class="text-base">
               <ul class="grid gap-3 divide-y-4 divide-fill">
                  <li v-for="page in pages" class="pt-2 px-3 text-center">
                     <NuxtLink :to="localPath(page.path) || page.path" class="flex items-center icon-parent">
                        <p
                           class="block mr-0 max-w-0 md:group-hover:max-w-[40rem] md:group-hover:pr-2 overflow-hidden transition-all">
                           {{ page.title }}
                        </p>
                        <component :is="page.icon" class="block size-12 ml-auto" />
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