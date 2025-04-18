<script setup lang="ts">
const { single } = defineProps<{
   name: string
   options: Record<any, any>
   single?: boolean
   tooltip?: string
}>()

const model = defineModel<string | string[]>()

const toggleFilter = (key: string) => {
   if (!single)
      return

   if (key === model.value)
      model.value = []
}
</script>

<template>
   <div class="grid gap-3">
      <p class="flex items-center gap-2 text-accent-800 uppercase text-lg font-semibold cursor-pointer">
         <span>
            <slot />
         </span>

         <svg v-if="tooltip" v-tooltip.top="tooltip" class="size-6" viewBox="0 0 22 23" fill="none">
            <path
               d="M11 20.5C12.1819 20.5 13.3522 20.2672 14.4442 19.8149C15.5361 19.3626 16.5282 18.6997 17.364 17.864C18.1997 17.0282 18.8626 16.0361 19.3149 14.9442C19.7672 13.8522 20 12.6819 20 11.5C20 10.3181 19.7672 9.14778 19.3149 8.05585C18.8626 6.96392 18.1997 5.97177 17.364 5.13604C16.5282 4.30031 15.5361 3.63738 14.4442 3.18508C13.3522 2.73279 12.1819 2.5 11 2.5C8.61305 2.5 6.32387 3.44821 4.63604 5.13604C2.94821 6.82387 2 9.11305 2 11.5C2 13.8869 2.94821 16.1761 4.63604 17.864C6.32387 19.5518 8.61305 20.5 11 20.5ZM22 11.5C22 17.575 17.075 22.5 11 22.5C4.925 22.5 0 17.575 0 11.5C0 5.425 4.925 0.5 11 0.5C17.075 0.5 22 5.425 22 11.5ZM10 17V9.5H12V17H10ZM12 8H9.996V5.996H12V8Z"
               fill="#08257D" />
         </svg>
      </p>
      <div v-for="[key, value] in Object.entries(options)" :key="value">
         <input :id="`${name}-${key}`" :type="single ? 'radio' : 'checkbox'" :value="key" v-model="model"
            class="sr-only" @click="toggleFilter(key)">
         <label :for="`${name}-${key}`" class="cursor-pointer flex gap-2 items-center group"
            :class="{ 'active': (Array.isArray(model) && model) ? model.includes(key as any) : model === key }">
            <div class="relative size-6 border border-basic-900 transition-all *:transition-all
                  shrink-0 group-[:not(:hover).active]:border-transparent group-[.active]:text-accent-800">
               <!-- hover empty -->
               <svg class="absolute size-5 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[2px] opacity-0 group-hover:group-[:not(.active)]:opacity-100
                     origin-bottom-left scale-110 z-10" viewBox="0 0 21 17" fill="none">
                  <path
                     d="M7.38534 12.5086L1.93237 6.88417L0 8.78157L7.38534 16.3714L21 2.36165L19.1579 0.371399L7.38534 12.5086Z"
                     fill="currentColor" />
               </svg>

               <!-- active -->
               <svg class="absolute size-5 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[2px] opacity-0 group-[.active]:opacity-100
                     group-hover:group-[.active]:opacity-0 z-10" viewBox="0 0 21 17" fill="none">
                  <path
                     d="M7.38534 12.5086L1.93237 6.88417L0 8.78157L7.38534 16.3714L21 2.36165L19.1579 0.371399L7.38534 12.5086Z"
                     fill="currentColor" />
               </svg>

               <!-- hover active -->
               <svg class="absolute size-4 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[2px] opacity-0 text-basic-900
                     group-hover:group-[.active]:opacity-100 z-10" viewBox="0 0 15 16" fill="none">
                  <path
                     d="M13.6399 15.3714L7.50482 9.23065L1.36977 15.3714L0 14.0025L6.14469 7.8714L0 1.74029L1.36977 0.371399L7.50482 6.51214L13.6399 0.381039L15 1.74029L8.86495 7.8714L15 14.0025L13.6399 15.3714Z"
                     fill="currentColor" />
               </svg>

               <div
                  class="absolute size-4 right-0 top-0 translate-x-1/2 -translate-y-1/2 bg-white opacity-0 group-hover:opacity-100 z-0">
               </div>
            </div>

            <span class="text-neutral group-hover:font-bold transition-all">{{ value }}</span>
         </label>
      </div>
   </div>
</template>

<style scoped></style>