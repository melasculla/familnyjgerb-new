import { type Storage, type StorageValue, type StorageMeta } from 'unstorage'
import { type MimeType, type MultiPartData } from 'h3'

export interface IMediaService {
   getAll(pagination: { page: number | undefined, perPage: number | undefined }, searchParam?: string, options?: { depth?: boolean }): Promise<{
      data: string[]
      total: number
   }>

   getByKey(key: string): Promise<{
      data: Buffer;
      meta: StorageMeta & {
         mime: MimeType
      }
   } | null>

   create(file: MultiPartData, acceptedTypes?: string[]): Promise<string[]>

   delete(key: string): Promise<void>
}

export class MediaService implements IMediaService {
   private repositroy: Storage<StorageValue>
   protected storageKey

   /** Constructor for MediaService.
    * 
    * @param {string} [storageKey='images'] - The storage key to use. `('songs:look:test')` `('images:avatars')`
    * 
   **/
   constructor(storageKey: string | null) {
      this.repositroy = useStorage(storageKey ? `media:${storageKey}` : 'media')
      this.storageKey = storageKey || ''
   }

   async getAll(
      pagination: { page: number | undefined, perPage: number | undefined } = { page: undefined, perPage: undefined },
      searchParam?: string,
      options?: { depth?: boolean }
   ) {
      const allKeys = await this.repositroy.getKeys()

      let currentDirKeys = options?.depth // TODO: make depth support (folders)
         ? allKeys
         : allKeys
            .filter(key => {
               const relativeKey = key.replace(`${this.storageKey}:`, '')
               return !relativeKey.includes(':')
            })
            .map(key => `${this.storageKey.replaceAll(':', '/')}/${key}`)

      let length = currentDirKeys.length

      if (searchParam) {
         currentDirKeys = currentDirKeys.filter(item => item.includes(searchParam))
         if (!currentDirKeys.length)
            throw createError(errorsList.notFound(`Results for <span>${searchParam}</span>`))

         length = currentDirKeys.length
      }

      if (pagination.page !== undefined && pagination.perPage !== undefined) {
         const start = (pagination.page - 1) * pagination.perPage;
         const end = start + pagination.perPage;
         currentDirKeys = currentDirKeys.slice(start, end)
         if (!currentDirKeys.length)
            throw createError({ ...errorsList.notFound(`Page ${pagination.page}`), data: { total: length } })
      }

      return { data: currentDirKeys, total: length }
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

      return result.map(item => `${this.storageKey.replaceAll(':', '/')}/${item}`)
   }

   async delete(key: string) {
      await this.repositroy.removeItem(key)
   }
}