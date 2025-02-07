<script setup lang="ts">
import { type MenuInterface } from './Main.vue';

defineProps<{ list: MenuInterface[] }>()
</script>

<template>
   <div>
      <div class="w-full grid justify-items-start wrapper">
         <MenuLink v-for="item in list" :route="!!item.link" :to="item.link ? item.link : item.custom!">
            {{ item.label }}
         </MenuLink>
      </div>
   </div>
</template>

<style scoped></style>