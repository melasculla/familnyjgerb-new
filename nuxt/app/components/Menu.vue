<script setup lang="ts">
type RecursiveKeyOf<T> = T extends string | ((...args: any) => string)
   ? never
   : {
      [K in Extract<keyof T, string>]: K | `${K}.${RecursiveKeyOf<T[K]>}`
   }[Extract<keyof T, string>]

type MenuLink = RecursiveKeyOf<typeof routesList>

type MenuInterface = {
   link: MenuLink
   label: string
   children?: MenuInterface[]
}
const menu: MenuInterface[] = [
   {
      link: 'client.admin.main',
      label: 'Dashboard',
   },
   {
      link: 'client.admin.posts.list',
      label: 'Posts',
      children: [
         { link: 'client.admin.posts.create', label: 'Create Post' },
         { link: 'client.admin.posts.category', label: 'Post Categories' },
      ],
   },
   {
      link: 'client.admin.gallery.list',
      label: 'Gallery',
      children: [
         { link: 'client.admin.gallery.category.list', label: 'Categories' },
         {
            link: 'client.admin.gallery.category.single',
            label: 'Single Category',
         },
      ],
   },
   {
      link: 'client.gallery.gerbs',
      label: 'Gerbs',
   },
]
</script>

<template>
   <div>
      
   </div>
</template>

<style scoped></style>