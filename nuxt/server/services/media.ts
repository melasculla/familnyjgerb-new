import { type Storage, type StorageValue, type StorageMeta } from 'unstorage'
import { type MimeType, type MultiPartData } from 'h3'
import { joinURL } from 'ufo'
import path from 'path'
import fs from 'fs'

export interface IMediaService {
   getAll(
      pagination: { page: number | undefined, perPage: number | undefined },
      searchParam?: string,
      options?: { depth?: boolean }
   ): Promise<{
      data: string[]
      total: number
   }>

   getFolders(): Promise<string[]>

   getByKey(key: string): Promise<{
      data: Buffer;
      meta: StorageMeta & {
         mime: MimeType
      }
   } | null>

   create(file: MultiPartData, acceptedTypes?: string[]): Promise<string[]>

   createChunk(input: MultiPartData, filename: string, index: number, acceptedTypes?: string[]): Promise<string[]>

   finalizeChunk(filename: string): Promise<string[]>

   delete(key: string): Promise<void>
}

export class MediaService implements IMediaService {
   private repositroy: Storage<StorageValue>
   private storageKey
   private uploadDir
   private tempDir

   /** Constructor for MediaService.
    * 
    * @param {string} [storageKey='images'] - The storage key to use. `('songs:look:test')` `('images:avatars')`
    * 
   **/
   constructor(storageKey: string | null) {
      this.repositroy = useStorage(storageKey ? `media:${storageKey}` : 'media')
      this.storageKey = storageKey || ''
      this.uploadDir = joinURL('/app/media', this.storageKey.replaceAll(':', '/'))
      this.tempDir = '/app/media/temp'
   }

   async getAll(
      pagination: { page: number | undefined, perPage: number | undefined } = { page: undefined, perPage: undefined },
      searchParam?: string,
      options?: { depth?: boolean, types?: string[] }
   ) {
      const allKeys = await this.repositroy.getKeys()

      let currentDirKeys = allKeys
         .filter(key => {
            if (options?.depth)
               return true

            const relativeKey = key.replace(`${this.storageKey}:`, '')
            return !relativeKey.includes(':')
         })
         .filter(key => {
            if (!options?.types)
               return true

            const ext = key.split('.').pop()
            if (!ext)
               return

            return options?.types?.some(item => item.includes(ext))
         })
         .map(key => joinURL('/', this.storageKey.replaceAll(':', '/'), key.replaceAll(':', '/')))
         .sort((a, b) => {
            const timeA = a.split('__')[1]
            const timeB = b.split('__')[1]

            if (timeB && timeB && parseInt(timeB) && parseInt(timeB))
               return parseInt(timeB) - parseInt(timeA)

            return 0
         })

      let length = currentDirKeys.length

      if (searchParam) {
         currentDirKeys = currentDirKeys.filter(item => item.includes(searchParam))
         if (!currentDirKeys.length)
            throw createError(errorsList.notFound(`Results for <span>${searchParam}</span>`))

         length = currentDirKeys.length
      }

      if (pagination.page !== undefined && pagination.perPage !== undefined) {
         const start = (pagination.page - 1) * pagination.perPage
         const end = start + pagination.perPage
         currentDirKeys = currentDirKeys.slice(start, end)
         if (!currentDirKeys.length)
            throw createError({ ...errorsList.notFound(`Page ${pagination.page}`), data: { total: length } })
      }

      return { data: currentDirKeys, total: length }
   }

   async getFolders() {
      const allKeys = await this.repositroy.getKeys()

      const folders = new Set<string>()
      allKeys.forEach(item => {
         if (item.startsWith('temp'))
            return

         const parts = item.split(':')
         parts.pop()

         let currentPath = ''
         parts.forEach(part => {
            if (!part)
               return

            currentPath += `/${part}`
            folders.add(currentPath.replaceAll(':', '/'))
         })
      })

      return Array.from(folders)
   }

   async getByKey(key: string) {
      const decodedKey = decodeURIComponent(key)
      const [result, meta] = await Promise.all([
         this.repositroy.getItemRaw(decodedKey),
         this.repositroy.getMeta(decodedKey)
      ])
      if (!result || !meta)
         throw createError(errorsList.notFound('File'))

      return {
         data: result as Buffer,
         meta: meta as StorageMeta & { mime: MimeType }
      }
   }

   /**
    * 
    * @param {Array} acceptedTypes -[ 'audio/' ] [ 'image/' ] etc.
    * @returns 
    */
   async create(input: MultiPartData | MultiPartData[], acceptedTypes?: string[]) {
      const result: string[] = []

      if (Array.isArray(input)) {
         const entities: FileEntity[] = []

         for (const item of input) {
            entities.push(new FileEntity({ file: item, acceptedTypes }))
         }

         for (const item of entities) {
            await Promise.all([
               this.repositroy.setItemRaw(item.filename, item.data),
               this.repositroy.setMeta(item.filename, { 'mime': item.type })
            ])
            result.push(item.filename)
         }
      } else {
         const fileEntity = new FileEntity({ file: input, acceptedTypes })
         await Promise.all([
            this.repositroy.setItemRaw(fileEntity.filename, fileEntity.data),
            this.repositroy.setMeta(fileEntity.filename, { 'mime': fileEntity.type })
         ])
         result.push(fileEntity.filename)
      }

      return result.map(item => joinURL('/', this.storageKey.replaceAll(':', '/'), item))
   }

   async createChunk(input: MultiPartData, filename: string, index: number, acceptedTypes?: string[]) {
      const entity = new FileEntity({ file: input, acceptedTypes })
      const chunkDir = path.join(this.tempDir, filename)
      if (!fs.existsSync(chunkDir)) {
         fs.mkdirSync(chunkDir, { recursive: true })
      }

      const chunkPath = path.join(chunkDir, `chunk_${String(index).padStart(5, '0')}`)
      return new Promise((resolve, reject) => {
         fs.writeFile(chunkPath, entity.data, err => {
            if (err)
               reject(createError({ statusCode: 500, message: 'Failed to save chunk' }))

            resolve([chunkPath])
         })
      }) as Promise<string[]>
   }

   async finalizeChunk(filename: string) {
      const chunkDir = path.join(this.tempDir, filename)
      const finalPath = path.join(this.uploadDir, filename)

      if (fs.existsSync(finalPath))
         throw createError({
            statusCode: 400,
            message: 'File already exists',
         })

      if (!fs.existsSync(chunkDir))
         throw createError({ statusCode: 400, message: 'Chunks not found' })

      const chunkFiles = fs.readdirSync(chunkDir).sort()
      const writeStream = fs.createWriteStream(finalPath)

      return new Promise((resolve, reject) => {
         try {
            for (const chunkFile of chunkFiles) {
               const chunkPath = path.join(chunkDir, chunkFile)
               const data = fs.readFileSync(chunkPath)
               writeStream.write(data)
            }

            writeStream.end()
            writeStream.on('finish', () => {
               fs.rmdirSync(chunkDir, { recursive: true }) // Clean up
               resolve([joinURL('/', this.storageKey.replaceAll(':', '/'), filename)])
            })

            writeStream.on('error', (err) => {
               reject(createError({ statusCode: 500, message: 'Failed to write final file' }))
            })
         } catch (err) {
            reject(createError({ statusCode: 500, message: 'Error finalizing chunks' }))
         }
      }) as Promise<string[]>
   }

   async delete(key: string) {
      await this.repositroy.removeItem(key)
   }
}