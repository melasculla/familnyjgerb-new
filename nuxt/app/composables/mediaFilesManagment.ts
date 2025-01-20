import type { ModelRef } from "vue"

export type UploadedFile = {
   path: string
   alt?: string
   file?: File
}

export const useSelectFilesWindow = (
   files?: ModelRef<UploadedFile[] | undefined>
): {
   isOpen: Ref<boolean>,
   open: () => void,
   handleSelected: (fileList: string[]) => void
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

   const filesSelectedFromFS = (fileList: string[]) => {
      if (!files)
         return

      for (const item of fileList) {
         const isFileExist = files.value?.find(({ path }) => item === path)
         if (isFileExist)
            continue

         files.value?.push({ path: item })
      }

      isOpen.value = false
   }

   return {
      isOpen,
      open: openSelectWindow,
      handleSelected: filesSelectedFromFS
   }
}


export const uploadFiles = async (
   fileList: Ref<UploadedFile[]>, baseUrl?: string, types?: string[]
) => {
   const chunkArray = <T>(arr: T[], size: number): T[][] => {
      const chunks = []
      for (let i = 0; i < arr.length; i += size) {
         chunks.push(arr.slice(i, i + size))
      }
      return chunks
   }

   const filesToUpload = fileList.value.filter(({ file }) => file)
   if (!filesToUpload.length)
      return fileList.value

   const fileChunks = chunkArray(filesToUpload, 5)
   const urls: string[] = []

   for (const chunk of fileChunks) {
      const body = new FormData()
      for (const { file } of chunk) {
         body.append('images', file!)
      }

      try {
         const uploadedUrls = await $fetch<string[]>(baseUrl
            ? routesList.api.media.match(baseUrl.replace('/api/media/', ''))
            : routesList.api.media.images.upload, {
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

   return replaceBlobUrls(fileList, urls)
}

const replaceBlobUrls = (fileList: Ref<UploadedFile[]>, urls: string[]) => {
   let index = 0

   for (const item of fileList.value) {
      if (!item.file)
         continue

      item.path = urls[index]!
      delete item.file
      index++
   }

   return fileList.value
}


type MimeTypes = 'image' | 'video'

/**
 * 
 * @param afterHandle Hook for handling uploaded Files
 * @returns 
 */
export const useUploadedFiles = (afterHandle?: (fileList: UploadedFile[]) => void, type: MimeTypes = 'image') => {
   const MAX_FILE_SIZE: Record<MimeTypes, number> = {
      image: 5,
      video: 20
   }

   const files = ref<UploadedFile[]>([])
   const error = ref<string>('')

   const handle = (e: Event) => {
      files.value = []
      error.value = ''

      const filesInput = (e.target as HTMLInputElement).files

      if (!filesInput)
         return

      for (let file of filesInput) {
         const isFileExists = files.value.find(({ file: loopFile }) => (file.name === loopFile?.name && file.size === loopFile?.size))
         const isSupportedFormat = file.type.includes(type)
         const isAllowedSize = file.size <= (MAX_FILE_SIZE[type] * 1024 * 1024)
         const size = (file.size / 1024 / 1024).toFixed(2)

         if (!isSupportedFormat) {
            error.value += `File ${file.name} have unsupported format ${file.type} (supported only ${type})<br>`
            continue
         }
         if (isFileExists || !isAllowedSize) {
            if (!isAllowedSize) error.value += `File ${file.name} too large: ${size} Mb (max size ${MAX_FILE_SIZE[type]} Mb)<br>`
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