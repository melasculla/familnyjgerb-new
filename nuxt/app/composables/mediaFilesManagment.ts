import type { ModelRef } from "vue"
import type { UploadedImage } from "~/components/Media/UploadFiles.vue"
import type { NitroFetchRequest } from 'nitropack'

type Image = { path: string, file?: File }

export const useSelectFilesWindow = (
   images?: ModelRef<UploadedImage[] | undefined>
): {
   isOpen: Ref<boolean>,
   open: () => void,
   callback: (imageList: string[]) => void
} => {
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
      if (!images)
         return

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


export const uploadImages = async (
   imageList: Ref<Image[]>, baseUrl?: NitroFetchRequest, types?: string[]
) => {
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

const replaceBlobUrls = (imageList: Ref<Image[]>, urls: string[]) => {
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


/**
 * 
 * @param afterHandle Hook for handling uploaded Files
 * @returns 
 */
export const useUploadedFiles = (afterHandle?: (images: Image[]) => void) => {
   const MAX_FILE_SIZE = 5 // Mb

   const files = ref<Image[]>([])
   const error = ref<string>('')

   const handle = (e: Event) => {
      files.value = []
      error.value = ''

      const filesInput = (e.target as HTMLInputElement).files

      if (!filesInput)
         return

      for (let file of filesInput) {
         const isFileExists = files.value.find(({ file: loopFile }) => (file.name === loopFile?.name && file.size === loopFile?.size))
         const isSupportedFormat = file.type.includes('image')
         const isAllowedSize = file.size <= (MAX_FILE_SIZE * 1024 * 1024)
         const size = (file.size / 1024 / 1024).toFixed(2)

         if (!isSupportedFormat) {
            error.value += `File ${file.name} have unsupported format ${file.type} (supported only images)<br>`
            continue
         }
         if (isFileExists || !isAllowedSize) {
            if (!isAllowedSize) error.value += `File ${file.name} too large: ${size} Mb (max size ${MAX_FILE_SIZE} Mb)<br>`
            if (isFileExists) error.value += `File ${file.name} already exists<br>`
            continue
         }

         const preview = URL.createObjectURL(file)
         files.value.push({ path: preview, file: file })
      }

      if (afterHandle)
         afterHandle(files.value)
   }

   return { handle, files, error }
}