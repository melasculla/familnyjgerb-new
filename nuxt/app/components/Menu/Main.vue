<script setup lang="ts">
type RecursiveKeyOf<T> = T extends string | ((...args: any) => string)
   ? never
   : {
      [K in Extract<keyof T, string>]: K | `${K}.${RecursiveKeyOf<T[K]>}`
   }[Extract<keyof T, string>]

export type MenuLink = RecursiveKeyOf<typeof routesList>

export type MenuInterface = {
   label: string
   link?: MenuLink
   custom?: string
   external?: boolean
   children?: MenuInterface[]
}
const menu: MenuInterface[] = [
   // {
   //    link: 'client.admin.main',
   //    label: 'Dashboard',
   // },
   // {
   //    link: 'client.admin.posts.list',
   //    label: 'Posts',
   //    children: [
   //       { link: 'client.admin.posts.create', label: 'Create Post' },
   //       { link: 'client.admin.posts.category', label: 'Post Categories' },
   //    ],
   // },
   // {
   //    link: 'client.admin.gallery.list',
   //    label: 'Gallery',
   //    children: [
   //       { link: 'client.admin.gallery.category.list', label: 'Categories' },
   //       {
   //          link: 'client.admin.gallery.category.single',
   //          label: 'Single Category',
   //       },
   //    ],
   // },
   {
      label: 'Гербы',
      children: [
         { link: 'client.static.services.gerbs', label: 'Разработка фамильных гербов' },
         { link: 'client.static.services.korp_gerbs', label: 'Разработка корпоративных гербов' },
         { link: 'client.static.services.ter_gerbs', label: 'Разработка территориальной геральдики' },
         { custom: '/blog_o_geraldike/geraldicheskoe-opisanie-gerba.html', label: 'Описание герба' },
         { link: 'client.static.services.gerb_restore', label: 'Восстановление герба' },
      ]
   },
   {
      label: 'Монограммы',
      children: [
         { link: 'client.static.services.monograms', label: 'Разработка монограмм' },
         { link: 'client.static.services.wedding_monograms', label: 'Разработка свадебных монограмм' },
      ]
   },
   {
      label: 'Портфолио',
      children: [
         { link: 'client.gallery.gerbs', label: 'Гербы' },
         { link: 'client.gallery.monograms', label: 'Монограммы' },
         { link: 'client.projects.list', label: 'Выполненные проекты' },
      ]
   },
   {
      label: 'Блог',
      link: 'client.posts.list'
   },
   {
      label: 'Вопросы/Ответы',
   },
   {
      label: 'Контакты',
      link: 'client.static.contacts'
   },
   {
      label: 'Главная',
      custom: '/'
   },
]

const activeMenu = ref<number | null>(null)
let hideTimeout: NodeJS.Timeout

const showMenu = (index: number) => {
   clearTimeout(hideTimeout)
   activeMenu.value = index
}

const hideMenu = () => hideTimeout = setTimeout(() => activeMenu.value = null, 300)
</script>

<template>
   <nav>
      <ul class="relative flex gap-3 justify-center flex-wrap">
         <li @mouseenter="showMenu(index)" @mouseleave="hideMenu" v-for="item, index in menu"
            class="group menu__transition__group text-lg">
            <MenuLink class="inline-block px-3" :class="{ 'before:w-full before:h-1': activeMenu === index }"
               :route="!!item.link" :to="item.link ? item.link : item.custom!">
               {{ item.label }}
            </MenuLink>
            <MenuChild
               class="absolute left-0 top-full w-full bg-primary-200 p-5 opacity-0 -translate-y-[9999rem] menu__transition [&_.wrapper]:px-[30rem]"
               :class="{ '!opacity-100 !translate-y-0': activeMenu === index }" :list="item.children"
               v-if="item.children" />
         </li>
      </ul>
   </nav>
</template>

<style scoped>
.menu__transition__group {
   & .menu__transition {
      transition: opacity 300ms 50ms, transform 0s 310ms;
      z-index: 4;
   }

   &:hover .menu__transition {
      transition: opacity 150ms 50ms, transform 0s 0s;
      z-index: 5;
   }
}
</style>