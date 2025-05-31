import type { TLineProps } from '~/components/Line.vue'
import type { CarouselConfig } from 'vue3-carousel'

declare module '#app' {
   interface PageMeta {
      hideSidebar?: boolean

      customTitle?: {
         key: string
      }

      info?: {
         image: string
         key: string
         line: TLineProps
      }
   }
}

export type MyCarouselBreakpoints = 320 | 480 | 640 | 768 | 1024 | 1280 | 1536
export type MyCarouselConfig = Partial<CarouselConfig> & {
   itemsToShow: number
   breakpoints?: {
      [K in MyCarouselBreakpoints]?: Partial<Omit<CarouselConfig, "breakpointMode" | "breakpoints" | "modelValue">>
   }
}

export { }