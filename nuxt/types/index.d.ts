import type { TLineProps } from '~/components/Line.vue'

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

export { }