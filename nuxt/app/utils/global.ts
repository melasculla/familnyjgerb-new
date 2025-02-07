import { type CarouselConfig } from 'vue3-carousel'

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