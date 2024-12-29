<script setup lang="ts">
const props = defineProps<{
   condition: any
}>()

const condition = toRef(() => props.condition)
</script>

<template>
   <transition name="error">
      <div class="grid text-center md:text-right" v-if="condition">
         <p class="text-sm text-error font-semibold">
            <slot />
         </p>
      </div>
   </transition>
</template>

<style scoped>
.error-enter-active,
.error-leave-active {
   transition: all 400ms;
   max-height: 8rem;
}

.error-enter-from,
.error-leave-to {
   opacity: 0;
   max-height: 0;
}
</style>