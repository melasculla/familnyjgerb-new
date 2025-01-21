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


type MimeTypes = 'image' | 'video'
const MAX_FILE_SIZE = 5

export const uploadFilesByChunks = async (
   fileList: Ref<UploadedFile[]>,
   baseUrl: string,
   types?: string[]
) => {
   const CHUNK_SIZE = MAX_FILE_SIZE * 1024 * 1024
   const urls: string[] = []

   const uploadChunk = async (file: File, chunk: Blob, index: number) => {
      const body = new FormData()
      body.append('file', chunk)
      body.append('filename', file.name)
      body.append('index', `${index}`)

      try {
         await $fetch(routesList.api.media.match(baseUrl.replace('/api/media/', '')), {
            method: 'POST',
            body,
            query: { types, options: { chunks: true } }
         })
      } catch (err: any) {
         console.error(`Failed to upload chunk ${index} of ${file.name}`, err)
         throw createError({ statusCode: err.code, message: err?.data?.message || err.message })
      }
   }

   const filesToUpload = fileList.value.filter(({ file }) => file)
   if (!filesToUpload.length)
      return fileList.value

   for (const item of filesToUpload) {
      const totalChunks = Math.ceil(item.file!.size / CHUNK_SIZE);

      for (let i = 0; i < totalChunks; i++) {
         const chunk = item.file!.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
         await uploadChunk(item.file!, chunk, i)
      }

      try {
         const { url } = await $fetch<{ url: string }>(routesList.api.media.match(baseUrl.replace('/api/media/', '')), {
            method: 'POST',
            body: { filename: item.file!.name, index: -1 },
            query: { types, options: { chunks: true, final: true } }
         })
         urls.push(url)
      } catch (err: any) {
         console.error(`Failed to finalize upload for ${item.file!.name}`, err);
         throw createError({ statusCode: err.code, message: err?.data?.message || err.message })
      }
   }

   return replaceBlobUrls(fileList, urls)
}


export const uploadFiles = async (
   fileList: Ref<UploadedFile[]>,
   baseUrl?: string,
   types?: string[]
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
         throw createError({ statusCode: err.code, message: err?.data?.message || err.message })
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


/**
 * 
 * @param afterHandle Hook for handling uploaded Files
 * @returns 
 */
export const useUploadedFiles = (afterHandle?: (fileList: UploadedFile[]) => void, type: MimeTypes = 'image') => {

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
         const isAllowedSize = type === 'image' ? file.size <= (MAX_FILE_SIZE * 1024 * 1024) : true
         const size = (file.size / 1024 / 1024).toFixed(2)

         if (!isSupportedFormat) {
            error.value += `File ${file.name} have unsupported format ${file.type} (supported only ${type})<br>`
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