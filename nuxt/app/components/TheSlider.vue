<script setup lang="ts">
defineProps<{
   data: number | { path: string, sub?: string, alt?: string, description?: string }[]
   config: MyCarouselConfig
   nav?: boolean
   shadow?: boolean
}>()
</script>

<template>
   <div>
      <ClientOnly>
         <CCarousel v-bind="config">
            <CSlide v-for="slide, index in data" :key="typeof slide === 'number' ? slide : slide.path">
               <div class="carousel__item w-full grid gap-4 justify-items-center"
                  :class="{ '[&>*:first-child]:transition-shadow [&>*:first-child]:shadow-main [&:hover>*:first-child]:shadow-main-hover': shadow }">
                  <slot v-if="typeof slide === 'object'" :description="slide.description" :path="slide.path"
                     :alt="slide.alt" :index="index" :img="slide.path" :sub="slide.sub" />
                  <slot v-else description="description" :index="index" />
               </div>
            </CSlide>

            <template #addons>
               <CNavigation v-if="nav" />
            </template>
         </CCarousel>

         <template #fallback>
            <div class="flex aspect-square overflow-hidden">
               <div v-for="slide, index in data" :key="typeof slide === 'number' ? slide : slide.path"
                  class="size-full **:size-full shrink-0 grow">
                  <div class="carousel__item grid gap-4 justify-items-center">
                     <slot v-if="typeof slide === 'object'" :description="slide.description" :path="slide.path"
                        :alt="slide.alt" :index="index" class="object-cover" />
                     <slot v-else description="description" :index="index" />
                  </div>
               </div>
            </div>
         </template>
      </ClientOnly>
   </div>
</template>

<style scoped></style>