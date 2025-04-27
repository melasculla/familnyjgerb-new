<script setup lang="ts">
defineProps<{
   data: number | { path: string, sub?: string, alt?: string, description?: string }[]
   config: MyCarouselConfig
   aspect: `${number}/${number}`
   nav?: boolean | {
      type: 'static'
      size?: 'full'
   }
   shadow?: boolean
}>()

const carousel = ref()
const handleInit = () => {
   // console.log(toRaw())
}

const prev = () => carousel.value?.prev()
const next = () => carousel.value?.next()
</script>

<template>
   <div class="min-w-0 relative group"
      :class="{ 'grid grid-cols-[1fr_auto]': typeof nav === 'object' && nav.type === 'static' }"
      :style="{ '--_aspect': aspect, gap: typeof nav === 'object' && nav.type === 'static' ? `${config.gap}px` : undefined }">
      <ClientOnly>
         <CCarousel class="[&>.carousel\_\_viewport]:py-[1px]" v-bind="config" ref="carousel" @init="handleInit()">
            <CSlide v-for="slide, index in data" :key="typeof slide === 'number' ? slide : slide.path" class="">
               <div
                  class="carousel__item w-full grid gap-4 justify-items-stretch *:first:w-full [&_img]:aspect-(--_aspect) [&_img]:object-cover"
                  :class="{ '[&>*:first-child]:transition-shadow [&>*:first-child]:shadow-main [&:hover>*:first-child]:shadow-main-hover': shadow }">
                  <slot v-if="typeof slide === 'object'" v-bind="{
                     path: slide.path,
                     img: slide.path,
                     alt: slide.alt,
                     description: slide.description,
                     index: index,
                     sub: slide.sub,
                  }" />
                  <slot v-else description="description" :index="index" />
               </div>
            </CSlide>
         </CCarousel>

         <template #fallback>
            <div class="w-full flex overflow-hidden" :style="{
               '--_width': (((1 / config.itemsToShow) * 100) - (config.gap ? 1 : 0)) + '%',
               gap: config.gap + 'px'
            }">
               <div v-for="slide, index in data" :key="typeof slide === 'number' ? slide : slide.path"
                  class="w-(--_width) basis-(--_width) shrink-0 grow">
                  <div
                     class="w-full carousel__item grid gap-4 justify-items-stretch [&_img]:aspect-(--_aspect) [&_img]:object-cover">
                     <slot v-if="typeof slide === 'object'" class="w-full object-cover" v-bind="{
                        description: slide.description,
                        path: slide.path,
                        alt: slide.alt,
                        index: index,
                        ssr: true
                     }" />
                     <slot v-else description="description" :index="index" />
                  </div>
               </div>
            </div>
         </template>
      </ClientOnly>

      <div v-if="nav" class="contents *:not-[.static]:z-10 *:px-3 *:py-8 *:bg-primary-500
               *:not-[.static]:absolute *:not-[.static]:top-1/2 *:not-[.static]:-translate-y-1/2 *:text-white [&_svg]:h-9 *:transition-all
               *:cursor-pointer">
         <!-- nav === 'full' -->
         <div class="opacity-0 group-hover:opacity-100 left-0" :class="[
            { 'top-0 translate-y-0 h-full flex items-center': typeof nav === 'object' && nav.size === 'full' },
         ]" @click="prev">
            <svg class="rotate-180" viewBox="0 0 13 22" fill="none">
               <path
                  d="M1.31304 0.71582L12.082 11.2158L1.31304 21.7158L0.0820303 20.5156L9.62118 11.2158L0.083188 1.91608L1.31304 0.71582Z"
                  fill="currentColor" />
            </svg>
         </div>

         <div class="right-0" :class="[
            { 'static self-center': typeof nav === 'object' && nav.type === 'static' },
            { 'self-stretch flex items-center': typeof nav === 'object' && nav.size === 'full' },
         ]" @click="next">
            <svg class="" viewBox="0 0 13 22" fill="none">
               <path
                  d="M1.31304 0.71582L12.082 11.2158L1.31304 21.7158L0.0820303 20.5156L9.62118 11.2158L0.083188 1.91608L1.31304 0.71582Z"
                  fill="currentColor" />
            </svg>
         </div>
      </div>
   </div>
</template>

<style scoped></style>