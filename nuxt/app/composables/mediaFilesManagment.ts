import type { ModelRef } from "vue"
import type { UploadedImage } from "~/components/Media/UploadFiles.vue"
import type { NitroFetchRequest } from 'nitropack'

export const useSelectFilesWindow = (images: ModelRef<UploadedImage[] | undefined>) => {
   const isOpen = ref<boolean>(false)

   const keyCloseSelectWinwow = (e: KeyboardEvent) => {
      if (e.key !== 'Escape')
         return

      window.removeEventListener('keyup', keyCloseSelectWinwow)
      isOpen.value = false
   }

   const openSelectWindow = () => {
      window.addEventListener('keyup', keyCloseSelectWinwow)
      isOpen.value = true
   }

   const filesSelectedFromFS = (imageList: string[]) => {
      for (const item of imageList) {
         const isImageExist = images.value?.find(({ path }) => item === path)
         if (isImageExist)
            continue

         images.value?.push({ path: item })
      }

      isOpen.value = false
   }

   return {
      isOpen,
      open: openSelectWindow,
      callback: filesSelectedFromFS
   }
}



export const uploadImages = async (imageList: Ref<UploadedImage[]>, baseUrl?: NitroFetchRequest, types?: string[]) => {
   const chunkArray = <T>(arr: T[], size: number): T[][] => {
      const chunks = []
      for (let i = 0; i < arr.length; i += size) {
         chunks.push(arr.slice(i, i + size))
      }
      return chunks
   }

   const imagesToUpload = imageList.value.filter(({ file }) => file)
   if (!imagesToUpload.length)
      return imageList.value

   const imageChunks = chunkArray(imagesToUpload, 5)
   const urls: string[] = []

   for (const chunk of imageChunks) {
      const body = new FormData()
      for (const { file } of chunk) {
         body.append('images', file!)
      }

      try {
         const uploadedUrls = await $fetch<string[]>(baseUrl ? baseUrl : routesList.api.media.images.upload, {
            method: 'POST',
            body,
            query: { types }
         })
         urls.push(...uploadedUrls)
      } catch (err: any) {
         console.error('Failed to upload chunk', err)
         throw err
      }
   }

   return replaceBlobUrls(imageList, urls)
}

const replaceBlobUrls = (imageList: Ref<UploadedImage[]>, urls: string[]) => {
   let index = 0

   for (const item of imageList.value) {
      if (!item.file)
         continue

      item.path = urls[index]!
      delete item.file
      index++
   }

   return imageList.value
}