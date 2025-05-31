<script setup lang="ts">
const props = defineProps<{
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


const calculateBreakpointWidth = (breakpoint: MyCarouselBreakpoints) => {
   const items = props.config.breakpoints?.[breakpoint]?.itemsToShow
   if (!items || items === 'auto')
      return undefined

   return `${((1 / items) * 100) - (props.config.gap ? 1.35 : 0)}%`
}
const isBreakpointExists = (breakpoint: MyCarouselBreakpoints): boolean => !!props.config.breakpoints?.[breakpoint]?.itemsToShow
</script>

<template>
   <div class="min-w-0 relative"
      :class="{ 'grid grid-cols-[1fr_auto]': typeof nav === 'object' && nav.type === 'static' }"
      :style="{ '--_aspect': aspect, gap: typeof nav === 'object' && nav.type === 'static' && config.gap ? `${config.gap}px` : undefined }">
      <ClientOnly>
         <CCarousel class="[&>.carousel\_\_viewport]:py-[1px] overflow-x-hidden" v-bind="{
            ...config,
            snapAlign: config.snapAlign ? config.snapAlign : 'start'
         }" ref="carousel" @init="handleInit()">
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
               '--_width': (((1 / config.itemsToShow) * 100) - (config.gap ? 1.35 : 0)) + '%',
               '--_width-xxs': calculateBreakpointWidth(320),
               '--_width-xs': calculateBreakpointWidth(480),
               '--_width-sm': calculateBreakpointWidth(640),
               '--_width-md': calculateBreakpointWidth(768),
               '--_width-lg': calculateBreakpointWidth(1024),
               '--_width-xl': calculateBreakpointWidth(1280),
               '--_width-2xl': calculateBreakpointWidth(1536),
               gap: config.gap ? `${config.gap}px` : undefined
            }">
               <div v-for="slide, index in data" :key="typeof slide === 'number' ? slide : slide.path"
                  class="w-(--_width) basis-(--_width) shrink-0 grow" :class="[
                     { 'xxs:w-(--_width-xxs) xxs:basis-(--_width-xxs)': isBreakpointExists(320) },
                     { 'xs:w-(--_width-xs) xs:basis-(--_width-xs)': isBreakpointExists(480) },
                     { 'sm:w-(--_width-sm) sm:basis-(--_width-sm)': isBreakpointExists(640) },
                     { 'md:w-(--_width-md) md:basis-(--_width-md)': isBreakpointExists(768) },
                     { 'lg:w-(--_width-lg) lg:basis-(--_width-lg)': isBreakpointExists(1024) },
                     { 'xl:w-(--_width-xl) xl:basis-(--_width-xl)': isBreakpointExists(1280) },
                     { '2xl:w-(--_width-2xl) 2xl:basis-(--_width-2xl)': isBreakpointExists(1536) },
                  ]">
                  <div
                     class="w-full carousel__item grid gap-4 justify-items-stretch [&_img]:aspect-(--_aspect) [&_img]:object-cover">
                     <slot v-if="typeof slide === 'object'" class="w-full object-cover" v-bind="{
                        description: slide.description,
                        path: slide.path,
                        alt: slide.alt,
                        index: index,
                        sub: slide.sub,
                        ssr: true
                     }" />

                     <slot v-else description="description" :index="index" />
                  </div>
               </div>
            </div>
         </template>
      </ClientOnly>

      <div v-if="nav" class="contents *:not-[.static]:z-10 *:px-3 *:py-8 *:bg-primary-500 *:not-[.static]:absolute *:not-[.static]:top-1/2
         *:not-[.static]:-translate-y-1/2 *:text-white [&_svg]:h-9 *:transition-all *:cursor-pointer">
         <div class="opacity-0 hover:opacity-100 left-0" :class="[
            { 'top-0 translate-y-0 h-full flex items-center': typeof nav === 'object' && nav.size === 'full' },
            { 'cursor-not-allowed! hover:opacity-50!': carousel?.data.currentSlide === 0 },
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
            { 'cursor-not-allowed! opacity-50': carousel?.data.maxSlide === carousel?.data.currentSlide },
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