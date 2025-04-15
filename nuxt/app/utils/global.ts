import { joinURL } from 'ufo'
import { type CarouselConfig } from 'vue3-carousel'
import { type LocationQueryValue } from '#vue-router'

export type MyCarouselConfig = Partial<CarouselConfig> & { itemsToShow: number };

export const deepClone = <T>(data: T): T => {
   try {
      return JSON.parse(JSON.stringify(data))
   }
   catch (err: any) {
      console.warn(err)
      return data
   }
}

export const FS_IMAGE_SRC = (path: string, mode: 'nuxt-image' | 'img' = 'nuxt-image') => {
   if (mode === 'nuxt-image')
      return joinURL('/fs', path)
   else
      return routesList.api.media.getFile(path)
}

export const convertQueryToStringArray = (param?: LocationQueryValue | LocationQueryValue[]): string[] => {
   if (param == null)
      return []

   if (Array.isArray(param))
      return param.filter(item => item != null)

   return param.split(',')
}